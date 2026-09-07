import { useMemo, useState } from 'react';
import { ShoppingBag, Menu, X, ArrowRight, Sparkles, Leaf, HeartHandshake, MapPin } from 'lucide-react';
import { products } from './data/products';
import ProductArt from './components/ProductArt';
import CartDrawer from './components/CartDrawer';

const nav = [
  ['QuartzMat', '#productos'],
  ['Mantas de peso', '#productos'],
  ['Productos', '#productos'],
  ['Beneficios del cuarzo', '#bienestar'],
  ['Contacto', '#contacto']
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [options, setOptions] = useState(
    Object.fromEntries(products.map(p => [p.id, p.coverOptions?.[0] || 'Estándar']))
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const addToCart = product => {
    const option = options[product.id];
    setCart(current => {
      const ix = current.findIndex(i => i.id === product.id && i.option === option);
      if (ix >= 0) {
        return current.map((item, index) =>
          index === ix ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...product, option, qty: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty = (target, delta) => {
    setCart(current =>
      current
        .map(item =>
          item.id === target.id && item.option === target.option
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const removeItem = target => {
    setCart(current =>
      current.filter(item => !(item.id === target.id && item.option === target.option))
    );
  };

  return (
    <div className="site">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="QuartzMat inicio">
          <span className="brand__mark">Q</span>
          <span>
            <b>QuartzMat</b>
            <small>bienestar consciente</small>
          </span>
        </a>

        <nav className={`nav ${menuOpen ? 'is-open' : ''}`}>
          {nav.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} />
            <span>Comprar</span>
            {itemCount > 0 && <em>{itemCount}</em>}
          </button>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero__content">
            <span className="eyebrow">Descanso · equilibrio · pausa</span>
            <h1>Bienestar impulsado por la fuerza natural del cuarzo</h1>
            <p>
              QuartzMat es una cama de cuarzo portátil y plegable diseñada para acompañar
              distintos momentos de descanso y pausa consciente, en casa o al aire libre.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#productos">
                Ver productos <ArrowRight size={18} />
              </a>
              <a className="btn btn--ghost" href="#bienestar">Conocer la experiencia</a>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero-mat">
              <span className="hero-mat__glow" />
              <span className="hero-mat__quartz q1" />
              <span className="hero-mat__quartz q2" />
              <span className="hero-mat__quartz q3" />
              <span className="hero-mat__quartz q4" />
              <span className="hero-mat__label">QUARTZMAT</span>
            </div>
            <div className="floating-note">
              <span>Portátil</span>
              <span>Plegable</span>
              <span>Liviana</span>
            </div>
          </div>
        </section>

        <section className="section products" id="productos">
          <div className="section-heading">
            <span className="eyebrow">Nuestros productos</span>
            <h2>Elige cómo quieres hacer espacio para tu pausa</h2>
            <p>
              Antes de hablar de beneficios, queremos que veas claramente qué puedes comprar.
              Una experiencia simple, directa y fácil de entender.
            </p>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <article className="product-card" key={product.id}>
                <ProductArt variant={product.art} />
                <div className="product-card__body">
                  <span className="product-card__category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <ul>
                    {product.features.map(feature => <li key={feature}>{feature}</li>)}
                  </ul>
                  {product.coverOptions?.length > 0 && (
                    <label>
                      <span>Opción / funda</span>
                      <select
                        value={options[product.id]}
                        onChange={e => setOptions({ ...options, [product.id]: e.target.value })}
                      >
                        {product.coverOptions.map(option => <option key={option}>{option}</option>)}
                      </select>
                    </label>
                  )}
                  <button className="btn btn--primary btn--full" onClick={() => addToCart(product)}>
                    Agregar al carrito <ShoppingBag size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section wellness" id="bienestar">
          <div className="section-heading section-heading--left">
            <span className="eyebrow">El cuarzo en tu rutina</span>
            <h2>El poder del cuarzo aplicado al bienestar diario</h2>
          </div>
          <div className="benefit-grid">
            <article>
              <HeartHandshake size={28} />
              <h3>Bienestar</h3>
              <p>
                Una experiencia pensada para crear una sensación de pausa y descanso,
                ayudándote a desconectarte del ritmo diario y volver al cuerpo.
              </p>
            </article>
            <article>
              <Sparkles size={28} />
              <h3>Equilibrio</h3>
              <p>
                Un espacio personal para momentos de meditación, descanso consciente
                o simplemente para estar.
              </p>
            </article>
            <article>
              <Leaf size={28} />
              <h3>Uso consciente</h3>
              <p>
                Diseñado para integrarse fácilmente en tu día a día: en casa, el jardín,
                una pausa al aire libre o mientras descansas.
              </p>
            </article>
          </div>
          <p className="wellness-note">
            QuartzMat se presenta como producto de bienestar y descanso. El sitio evita afirmar
            beneficios médicos o terapéuticos no demostrados y no reemplaza atención profesional.
          </p>
        </section>

        <section className="story">
          <div>
            <span className="eyebrow">Una pausa que se mueve contigo</span>
            <h2>Extiende. Recuéstate. Respira.</h2>
            <p>
              La dirección visual recuperada de QuartzMat combina naturaleza, calma y una estética
              limpia. Esta versión en código mantiene ese espíritu, pero prioriza la claridad comercial,
              accesibilidad y rendimiento.
            </p>
          </div>
          <div className="story-panel">
            <blockquote>“Respira, descansa, equilibra.”</blockquote>
          </div>
        </section>

        <section className="contact section" id="contacto">
          <div>
            <span className="eyebrow">Showroom</span>
            <h2>Conoce QuartzMat</h2>
            <p>Agenda tu visita al showroom en Las Condes, Santiago.</p>
          </div>
          <div className="contact-card">
            <MapPin size={22} />
            <div>
              <strong>Av. Las Condes 9036</strong>
              <span>Las Condes · Región Metropolitana</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand brand--footer" href="#inicio">
          <span className="brand__mark">Q</span><b>QuartzMat</b>
        </a>
        <p>Bienestar impulsado por la fuerza natural del cuarzo.</p>
      </footer>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
        onRemove={removeItem}
      />
    </div>
  );
}

export default App;
