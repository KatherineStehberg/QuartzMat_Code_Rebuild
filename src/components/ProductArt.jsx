export default function ProductArt({ variant = 'bed' }) {
  const labels = {
    bed: 'QuartzMat',
    cover: 'Fundas',
    kids: 'Kids',
    blanket: 'Manta'
  };

  const realImages = {
    bed: {
      src: '/images/quartzmat-portatil.webp',
      alt: 'QuartzMat portátil en su bolsa de transporte'
    },
    cover: {
      src: '/images/quartzmat-funda.webp',
      alt: 'Detalle de funda y etiqueta QuartzMat'
    }
  };

  if (realImages[variant]) {
    return (
      <div className={`product-art product-art--${variant}`}>
        <img
          src={realImages[variant].src}
          alt={realImages[variant].alt}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  return (
    <div className={`product-art product-art--${variant}`} aria-label={`Ilustración conceptual ${labels[variant]}`}>
      <span className="quartz-orb" />
      <span className="quartz-orb quartz-orb--two" />
      <span className="quartz-orb quartz-orb--three" />
      <div className="product-art__label">{labels[variant]}</div>
    </div>
  );
}
