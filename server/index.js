import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { calculateOrder, getServerCatalog } from './catalog.js';
import { flowPost, getFlowPaymentStatus } from './flow.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 4321);

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function redirect(res, location, status = 303) {
  res.writeHead(status, { Location: location });
  res.end();
}

async function readBody(req, limit = 64_000) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('Solicitud demasiado grande.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function clean(value, max = 160) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function getPublicBaseUrl(req) {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${port}`;
  return `${proto}://${host}`;
}

async function createPayment(req, res) {
  try {
    const body = JSON.parse(await readBody(req) || '{}');
    const email = clean(body.email).toLowerCase();
    const name = clean(body.name, 80);
    const surname = clean(body.surname, 80);
    const phone = clean(body.phone, 40);
    const deliveryMethod = clean(body.deliveryMethod, 30) || 'pickup';
    const address = clean(body.address, 220);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(res, 400, { error: 'Correo de pago no válido.' });
    }
    if (!name || !surname) return json(res, 400, { error: 'Nombre y apellido son obligatorios.' });
    if (!['pickup', 'shipping'].includes(deliveryMethod)) {
      return json(res, 400, { error: 'Método de entrega no válido.' });
    }
    if (deliveryMethod === 'shipping' && !address) {
      return json(res, 400, { error: 'Debes ingresar una dirección para despacho.' });
    }

    const calculated = calculateOrder(body.items);
    const commerceOrder = `QMAT-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const publicBaseUrl = getPublicBaseUrl(req);
    const itemSummary = calculated.items.map((item) => `${item.qty}x ${item.id}`).join(', ');

    // Igual que Famores: no enviamos `optional` a payment/create porque Flow
    // puede rechazar payloads grandes. Los datos de cliente/entrega quedan en
    // el frontend y más adelante pueden persistirse en BD usando commerceOrder.
    const payment = await flowPost('/payment/create', {
      commerceOrder,
      subject: `Pedido QuartzMat - ${itemSummary}`.slice(0, 255),
      currency: 'CLP',
      amount: calculated.total,
      email,
      urlConfirmation: `${publicBaseUrl}/api/flow/confirmation`,
      urlReturn: `${publicBaseUrl}/api/flow/return`
    });

    if (!payment?.url || !payment?.token) {
      throw new Error('Flow no devolvió una URL de checkout válida.');
    }

    console.info('[QuartzMat checkout created]', {
      commerceOrder,
      flowOrder: payment.flowOrder,
      total: calculated.total,
      customer: `${name} ${surname}`,
      phoneConfigured: Boolean(phone),
      deliveryMethod,
      addressConfigured: Boolean(address)
    });

    return json(res, 200, {
      checkoutUrl: `${payment.url}?token=${encodeURIComponent(payment.token)}`,
      commerceOrder,
      flowOrder: payment.flowOrder,
      breakdown: calculated
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No fue posible crear el pago.';
    const clientError = /vacío|no válido|obligatorio|Falta configurar|dirección|Cantidad|Producto/.test(message);
    console.error('[QuartzMat Flow create]', message);
    return json(res, clientError ? 400 : 502, { error: message });
  }
}

async function flowConfirmation(req, res) {
  try {
    const form = new URLSearchParams(await readBody(req));
    const token = clean(form.get('token'), 500);
    if (!token) return json(res, 400, { error: 'missing-token' });
    const status = await getFlowPaymentStatus(token);
    console.info('[QuartzMat Flow confirmation]', {
      flowOrder: status?.flowOrder,
      commerceOrder: status?.commerceOrder,
      status: status?.status,
      amount: status?.amount
    });
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('OK');
  } catch (error) {
    console.error('[QuartzMat Flow confirmation]', error instanceof Error ? error.message : error);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ERROR');
  }
}

async function flowReturn(req, res) {
  const raw = await readBody(req);
  const form = new URLSearchParams(raw);
  const token = clean(form.get('token'), 500);
  if (!token) return redirect(res, '/?payment=error&reason=missing-token');
  return redirect(res, `/?payment=result&token=${encodeURIComponent(token)}`);
}

async function flowStatus(url, res) {
  try {
    const token = clean(url.searchParams.get('token'), 500);
    if (!token) return json(res, 400, { error: 'Token requerido.' });
    const status = await getFlowPaymentStatus(token);
    return json(res, 200, {
      status: status?.status,
      commerceOrder: status?.commerceOrder,
      flowOrder: status?.flowOrder,
      amount: status?.amount,
      currency: status?.currency,
      payer: status?.payer
    });
  } catch (error) {
    return json(res, 502, { error: error instanceof Error ? error.message : 'No fue posible consultar Flow.' });
  }
}

function publicConfig(res) {
  try {
    const catalog = getServerCatalog();
    return json(res, 200, {
      products: Object.fromEntries(Object.entries(catalog).map(([id, item]) => [id, { price: item.price }])),
      showroomAddress: process.env.QUARTZMAT_SHOWROOM_ADDRESS || 'Av. Las Condes 9036, Las Condes, Región Metropolitana',
      whatsapp: process.env.QUARTZMAT_WHATSAPP || null,
      flowConfigured: Boolean(process.env.FLOW_API_KEY && process.env.FLOW_SECRET_KEY)
    });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : 'Configuración inválida.' });
  }
}

async function createAppServer() {
  const vite = !isProd
    ? await createViteServer({ root: projectRoot, server: { middlewareMode: true }, appType: 'spa' })
    : null;

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

      if (req.method === 'GET' && url.pathname === '/api/checkout-config') return publicConfig(res);
      if (req.method === 'POST' && url.pathname === '/api/flow/create-payment') return createPayment(req, res);
      if (req.method === 'POST' && url.pathname === '/api/flow/confirmation') return flowConfirmation(req, res);
      if (req.method === 'POST' && url.pathname === '/api/flow/return') return flowReturn(req, res);
      if (req.method === 'GET' && url.pathname === '/api/flow/status') return flowStatus(url, res);

      if (vite) return vite.middlewares(req, res, () => json(res, 404, { error: 'Not found' }));

      const dist = path.join(projectRoot, 'dist');
      const requested = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
      let filePath = path.join(dist, requested);
      try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        const type = ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : ext === '.svg' ? 'image/svg+xml' : 'text/html';
        res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
        return res.end(data);
      } catch {
        filePath = path.join(dist, 'index.html');
        const data = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(data);
      }
    } catch (error) {
      console.error('[QuartzMat server]', error);
      return json(res, 500, { error: 'Error interno.' });
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`QuartzMat ${isProd ? 'production' : 'development'} server: http://localhost:${port}`);
  });
}

createAppServer();
