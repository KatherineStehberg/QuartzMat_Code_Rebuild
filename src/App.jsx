import { useMemo, useState } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Leaf,
  HeartHandshake,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { products, formatCLP, brandAssets } from './data/products';
import CartDrawer from './components/CartDrawer';

const nav = [
  ['Inicio', '#inicio'],
  ['Productos', '#productos'],
  ['Beneficios', '#bienestar'],
  ['Galería', '#galeria'],
  ['Contacto', '#contacto']
];

const gallery = [
  {
    image: brandAssets.heroImage,
    alt: 'Persona meditando sobre una QuartzMat en un jardín rodeado de naturaleza.',
    caption: 'Uso diario en espacios de calma y conexión.'
  },
  {
    image: products[1].image,
    alt: products[1].imageAlt,
    caption: 'Fundas de colores y terminaciones textiles.'
  },
  {
    image: brandAssets.storyImage,
    alt: 'Persona meditando frente al mar al atardecer.',
    caption: 'Una estética más humana, simple y serena.'
  }
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
            <div className="hero__pricebar">
              <div><small>QuartzMat</small><strong>{formatCLP(69990)}</strong></div>
              <div><small>Fundas desde</small><strong>{formatCLP(16990)}</strong></div>
              <div><small>Manta de peso</small><strong>{formatCLP(62990)}</strong></div>
            </div>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#productos">Ver productos <ArrowRight size={18} /></a>
              <a className="btn btn--ghost" href="#galeria">Ver imágenes</a>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero-photo-card">
              <img src={brandAssets.heroImage} alt="Persona meditando al aire libre." />
            </div>
            <div className="floating-note"><span>Portátil</span><span>Plegable</span><span>Liviana</span></div>
          </div>
        </section>

        <section className="section proof-strip">
          <div className="proof-card"><CheckCircle2 size={20} /><div><strong>Imágenes incorporadas al sitio</strong><p>El sitio ya no usa sólo ilustraciones: ahora incorpora fotografía de bienestar y producto en contexto.</p></div></div>
          <div className="proof-card"><ShieldCheck size={20} /><div><strong>Precios históricos visibles</strong><p>Quedaron cargados para que el catálogo y el carrito sean más claros desde el primer vistazo.</p></div></div>
          <div className="proof-card"><ImageIcon size={20} /><div><strong>Base lista para Flow</strong><p>El frontend quedó más presentable mientras completas credenciales, teléfonos y datos finales.</p></div></div>
        </section>

        <section className="section products" id="productos">
          <div className="section-heading">
            <span className="eyebrow">Nuestros productos</span>
            <h2>Ahora sí se entiende qué vendes</h2>
            <p>Reorganicé el catálogo para que cada producto tenga imagen, precio y opción seleccionable.</p>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <article className="product-card" key={product.id}>
                <div className="product-media">
                  <img src={product.image} alt={product.imageAlt} />
                  <span className="product-badge">{product.badge}</span>
                </div>
                <div className="product-card__body">
                  <div className="product-heading-row">
                    <span className="product-card__category">{product.category}</span>
                    <strong className="product-price">{formatCLP(product.price)}</strong>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
                  {product.coverOptions?.length > 0 && (
                    <label>
                      <span>Opción / funda</span>
                      <select value={options[product.id]} onChange={e => setOptions({ ...options, [product.id]: e.target.value })}>
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
          <p className="section-note">*Precios cargados según el respaldo histórico del proyecto QuartzMat. Se pueden actualizar cuando Paloma confirme los definitivos.</p>
        </section>

        <section className="section wellness" id="bienestar">
          <div className="section-heading section-heading--left">
            <span className="eyebrow">El cuarzo en tu rutina</span>
            <h2>Una propuesta de bienestar más clara y más creíble</h2>
          </div>
          <div className="benefit-grid">
            <article><HeartHandshake size={28} /><h3>Bienestar</h3><p>Una experiencia pensada para crear una sensación de pausa y descanso.</p></article>
            <article><Sparkles size={28} /><h3>Equilibrio</h3><p>Un espacio personal para momentos de meditación y descanso consciente.</p></article>
            <article><Leaf size={28} /><h3>Uso consciente</h3><p>Diseñado para integrarse fácilmente en casa, jardín o una pausa al aire libre.</p></article>
          </div>
          <p className="wellness-note">QuartzMat se presenta como producto de bienestar y descanso. El sitio evita afirmar beneficios médicos o terapéuticos no demostrados y no reemplaza atención profesional.</p>
        </section>

        <section className="section gallery" id="galeria">
          <div className="section-heading">
            <span className="eyebrow">Galería</span>
            <h2>Una experiencia visual más cercana al producto</h2>
            <p>Incorporé fotografía de bienestar para que el sitio ya no se vea como una maqueta abstracta.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map(item => (
              <figure key={item.caption} className="gallery-card"><img src={item.image} alt={item.alt} /><figcaption>{item.caption}</figcaption></figure>
            ))}
          </div>
        </section>

        <section className="story">
          <div>
            <span className="eyebrow">Una pausa que se mueve contigo</span>
            <h2>Extiende. Recuéstate. Respira.</h2>
            <p>Esta versión prioriza naturaleza, serenidad, producto visible y una lectura comercial más directa.</p>
          </div>
          <div className="story-panel story-panel--image">
            <img src={brandAssets.storyImage} alt="Persona meditando al aire libre." />
            <blockquote>“Respira, descansa, equilibra.”</blockquote>
          </div>
        </section>

        <section className="contact section" id="contacto">
          <div><span className="eyebrow">Showroom</span><h2>Conoce QuartzMat</h2><p>Agenda tu visita al showroom en Las Condes, Santiago.</p></div>
          <div className="contact-card"><MapPin size={22} /><div><strong>Av. Las Condes 9036</strong><span>Las Condes · Región Metropolitana</span></div></div>
        </section>
      </main>

      <footer>
        <a className="brand brand--footer" href="#inicio"><span className="brand__mark">Q</span><b>QuartzMat</b></a>
        <p>Bienestar impulsado por la fuerza natural del cuarzo.</p>
        <small>Versión ajustada con imágenes, precios históricos visibles y catálogo más claro.</small>
      </footer>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={removeItem} />
    </div>
  );
}

export default App;
