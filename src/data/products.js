export const brandAssets = {
  heroImage: 'https://images.unsplash.com/photo-1758274529460-455002cfe74c?auto=format&fit=crop&fm=jpg&q=80&w=1800',
  storyImage: 'https://images.unsplash.com/photo-1758274526584-7f42956db4b5?auto=format&fit=crop&fm=jpg&q=80&w=1800',
};

export const formatCLP = value =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);

export const products = [
  {
    id: 'quartzmat-bed',
    name: 'QuartzMat – Cama de cuarzo plegable portátil',
    shortName: 'QuartzMat',
    category: 'Cama de cuarzo',
    price: 69990,
    image: 'https://images.unsplash.com/photo-1758797316894-c25b94e8426a?auto=format&fit=crop&fm=jpg&q=80&w=1400',
    imageAlt: 'Persona sentada sobre una QuartzMat en un jardín.',
    description:
      'Tu espacio personal de bienestar, donde estés. Portátil, plegable y liviana, pensada para meditación, descanso en casa, pausas conscientes o conexión al aire libre.',
    features: ['Portátil', 'Plegable', 'Liviana', 'Incluye funda de regalo'],
    coverOptions: ['Natural', 'Azul oscuro', 'Verde', 'Púrpura'],
    badge: 'Más vendido',
  },
  {
    id: 'quartzmat-covers',
    name: 'Fundas de colores QuartzMat',
    shortName: 'Fundas',
    category: 'Accesorios',
    price: 16990,
    image: 'https://images.unsplash.com/photo-1758274529460-455002cfe74c?auto=format&fit=crop&fm=jpg&q=80&w=1400',
    imageAlt: 'Funda morada QuartzMat doblada sobre una rama.',
    description:
      'Fundas suaves, lavables y fáciles de intercambiar, pensadas para el uso diario y para acompañar momentos de descanso y pausa.',
    features: ['Lavables', 'Intercambiables', 'Uso diario'],
    coverOptions: ['Azul oscuro', 'Verde', 'Púrpura', 'Natural'],
    badge: 'Accesorio',
  },
  {
    id: 'quartzmat-kids',
    name: 'Fundas para niños',
    shortName: 'Fundas niños',
    category: 'Niños',
    price: 16990,
    image: 'https://images.unsplash.com/photo-1758274526584-7f42956db4b5?auto=format&fit=crop&fm=jpg&q=80&w=1400',
    imageAlt: 'Escena de bienestar y meditación al aire libre sobre una QuartzMat.',
    description:
      'Versión pensada para acompañar rutinas de descanso y calma en espacios familiares, con lenguaje visual suave y fácil de mantener.',
    features: ['Diseño infantil', 'Textil suave', 'Fácil de lavar'],
    coverOptions: ['Diseño infantil', 'Natural'],
    badge: 'Niños',
  },
  {
    id: 'weighted-blanket',
    name: 'Manta de peso rellena de cuarzo',
    shortName: 'Manta de peso',
    category: 'Descanso',
    price: 62990,
    image: 'https://images.unsplash.com/photo-1758797316894-c25b94e8426a?auto=format&fit=crop&fm=jpg&q=80&w=1400',
    imageAlt: 'Persona meditando sentada sobre una manta QuartzMat en el césped.',
    description:
      'Manta de peso pensada para acompañar momentos de descanso, relajación y pausa consciente, con una experiencia cómoda y visualmente cálida.',
    features: ['Uso en casa', 'Descanso consciente', 'Textil acolchado'],
    coverOptions: ['Adulto'],
    badge: 'Descanso',
  },
];
