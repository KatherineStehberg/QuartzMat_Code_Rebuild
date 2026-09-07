const PRODUCT_ENV_KEYS = {
  'quartzmat-bed': 'QUARTZMAT_PRICE',
  'quartzmat-covers': 'QUARTZMAT_COVER_PRICE',
  'quartzmat-kids': 'QUARTZMAT_KIDS_PRICE',
  'weighted-blanket': 'QUARTZMAT_WEIGHTED_BLANKET_PRICE'
};

const DEFAULT_PRICES = {
  'quartzmat-bed': 69990,
  'quartzmat-covers': 16990,
  'quartzmat-kids': 16990,
  'weighted-blanket': 62990
};

function readPrice(envKey, fallback) {
  const raw = process.env[envKey];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0 || !Number.isInteger(value)) {
    throw new Error(`${envKey} debe ser un precio entero positivo en CLP.`);
  }
  return value;
}

export function getServerCatalog() {
  return Object.fromEntries(
    Object.entries(PRODUCT_ENV_KEYS).map(([id, envKey]) => [
      id,
      { id, envKey, price: readPrice(envKey, DEFAULT_PRICES[id]) }
    ])
  );
}

export function calculateOrder(items) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('El carrito está vacío.');
  const catalog = getServerCatalog();
  const normalized = [];
  let subtotal = 0;

  for (const item of items) {
    const product = catalog[item?.id];
    const qty = Number(item?.qty);
    if (!product) throw new Error('Producto no válido.');
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) throw new Error('Cantidad no válida.');
    const lineTotal = product.price * qty;
    subtotal += lineTotal;
    normalized.push({
      id: product.id,
      option: String(item?.option || 'Estándar').trim().slice(0, 80),
      qty,
      unitPrice: product.price,
      lineTotal
    });
  }

  return { items: normalized, subtotal, total: subtotal, currency: 'CLP' };
}
