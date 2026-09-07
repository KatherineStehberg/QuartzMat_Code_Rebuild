import { useEffect, useMemo, useState } from 'react';
import { X, Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react';

const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function CartDrawer({ open, items, onClose, onQty, onRemove }) {
  const [config, setConfig] = useState(null);
  const [form, setForm] = useState({
    name: '', surname: '', email: '', phone: '', deliveryMethod: 'pickup', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || config) return;
    fetch('/api/checkout-config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setError('No fue posible cargar la configuración de compra.'));
  }, [open, config]);

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = useMemo(() => {
    if (!config?.products) return null;
    let sum = 0;
    for (const item of items) {
      const price = config.products[item.id]?.price;
      if (price == null) return null;
      sum += price * item.qty;
    }
    return sum;
  }, [items, config]);

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function checkout(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/flow/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(({ id, option, qty }) => ({ id, option, qty }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible crear el pago.');

      localStorage.setItem(`quartzmat-order-${data.commerceOrder}`, JSON.stringify({
        commerceOrder: data.commerceOrder,
        customer: form,
        items: items.map(({ id, shortName, option, qty }) => ({ id, shortName, option, qty })),
        breakdown: data.breakdown,
        createdAt: new Date().toISOString()
      }));
      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible crear el pago.');
      setLoading(false);
    }
  }

  const canPay = items.length > 0 && config?.flowConfigured && total != null;

  return (
    <div className={`drawer-shell ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Cerrar carrito" />
      <aside className="drawer" aria-label="Carrito de compra">
        <div className="drawer__header">
          <div>
            <span className="eyebrow">Tu selección</span>
            <h2>Carrito</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={34} strokeWidth={1.5} />
            <p>Aún no has agregado productos.</p>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={checkout}>
            <div className="cart-list">
              {items.map(item => {
                const price = config?.products?.[item.id]?.price;
                return (
                  <article key={`${item.id}-${item.option}`} className="cart-item">
                    <div>
                      <strong>{item.shortName}</strong>
                      <small>{item.option}</small>
                      <small>{price == null ? 'Precio por configurar' : money.format(price)}</small>
                    </div>
                    <div className="qty">
                      <button type="button" onClick={() => onQty(item, -1)} aria-label="Disminuir"><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => onQty(item, 1)} aria-label="Aumentar"><Plus size={14} /></button>
                    </div>
                    <button type="button" className="text-btn" onClick={() => onRemove(item)}>Quitar</button>
                  </article>
                );
              })}
            </div>

            <section className="checkout-fields" aria-label="Datos de compra">
              <h3>Datos para el pedido</h3>
              <div className="checkout-grid">
                <label><span>Nombre</span><input required value={form.name} onChange={(e) => updateForm('name', e.target.value)} /></label>
                <label><span>Apellido</span><input required value={form.surname} onChange={(e) => updateForm('surname', e.target.value)} /></label>
              </div>
              <label><span>Email de pago</span><input required type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></label>
              <label><span>Teléfono</span><input type="tel" placeholder="Se puede completar después" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} /></label>
              <label>
                <span>Entrega</span>
                <select value={form.deliveryMethod} onChange={(e) => updateForm('deliveryMethod', e.target.value)}>
                  <option value="pickup">Retiro en showroom</option>
                  <option value="shipping">Despacho</option>
                </select>
              </label>
              {form.deliveryMethod === 'shipping' && (
                <label><span>Dirección de despacho</span><input required value={form.address} onChange={(e) => updateForm('address', e.target.value)} /></label>
              )}
              {form.deliveryMethod === 'pickup' && config?.showroomAddress && (
                <p className="checkout-help">Retiro: {config.showroomAddress}</p>
              )}
            </section>

            <div className="drawer__footer">
              <div className="checkout-total">
                <span>{count} producto{count !== 1 ? 's' : ''}</span>
                <strong>{total == null ? 'Precios pendientes' : money.format(total)}</strong>
              </div>
              {error && <p className="checkout-error" role="alert">{error}</p>}
              {!config?.flowConfigured && <p className="checkout-help">Flow quedará habilitado cuando agregues las credenciales reales al hosting.</p>}
              {total == null && <p className="checkout-help">Falta completar uno o más precios en las variables de entorno.</p>}
              <button className="btn btn--primary btn--full" disabled={!canPay || loading}>
                <CreditCard size={18} /> {loading ? 'Conectando con Flow…' : 'Pagar con Flow'}
              </button>
              <small>El monto se recalcula en el servidor. Las credenciales de Flow nunca se exponen en el navegador.</small>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}
