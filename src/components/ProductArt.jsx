export default function ProductArt({ variant = 'bed' }) {
  const labels = {
    bed: 'QuartzMat',
    cover: 'Fundas',
    kids: 'Kids',
    blanket: 'Manta'
  };
  return (
    <div className={`product-art product-art--${variant}`} aria-label={`Ilustración conceptual ${labels[variant]}`}>
      <span className="quartz-orb" />
      <span className="quartz-orb quartz-orb--two" />
      <span className="quartz-orb quartz-orb--three" />
      <div className="product-art__label">{labels[variant]}</div>
    </div>
  );
}
