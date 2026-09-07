import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ open, items, onClose, onQty, onRemove }) {
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className={`drawer-shell ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Cerrar carrito" />
      <aside className="drawer" aria-label="Carrito de compra">
        <div className="drawer__header">
          <div>
            <span className="eyebrow">Tu selección</span>
            <h2>Carrito</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={34} strokeWidth={1.5} />
            <p>Aún no has agregado productos.</p>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {items.map(item => (
                <article key={`${item.id}-${item.option}`} className="cart-item">
                  <div>
                    <strong>{item.shortName}</strong>
                    <small>{item.option}</small>
                  </div>
                  <div className="qty">
                    <button onClick={() => onQty(item, -1)} aria-label="Disminuir">
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => onQty(item, 1)} aria-label="Aumentar">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="text-btn" onClick={() => onRemove(item)}>Quitar</button>
                </article>
              ))}
            </div>
            <div className="drawer__footer">
              <p>{count} producto{count !== 1 ? 's' : ''} seleccionado{count !== 1 ? 's' : ''}</p>
              <button className="btn btn--primary btn--full" disabled>
                Checkout — conectar Flow
              </button>
              <small>La integración real de pago debe hacerse desde backend, nunca exponiendo claves secretas en el navegador.</small>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
