# QuartzMat — reconstrucción en código

Reconstrucción inicial del sitio `quartzmat.cl` en React + Vite a partir del material recuperado de Google Drive.

## Objetivo
- Sustituir la dependencia de WordPress por un código fuente versionable.
- Conservar el enfoque UX/UI y los textos ya trabajados.
- Priorizar claridad comercial: entender el producto en menos de 10 segundos.
- Preparar el frontend para una futura integración segura con Flow.
- Evitar credenciales y secretos dentro del repositorio/frontend.

## Ejecutar localmente
```bash
npm install
npm run dev
```

## Build de producción
```bash
npm run build
npm run preview
```

## Estado de esta versión
Incluye:
- Home responsive.
- Hero y propuesta de valor.
- 4 categorías/productos recuperados.
- Selectores de funda/opciones.
- Carrito funcional en frontend.
- Dirección de showroom.
- Diseño basado en paleta UX recuperada.
- Documentación del estudio UX, branding y textos originales.
- Aviso para no presentar afirmaciones médicas no comprobadas.

Pendiente antes de publicar:
- Incorporar fotografías y logo originales en formatos web optimizados.
- Definir precios/stock definitivos.
- Implementar backend de checkout.
- Conectar Flow mediante backend/serverless usando variables de entorno.
- Agregar políticas de despacho/devolución, privacidad y términos.
- Analítica/SEO técnico.
- Tests de accesibilidad y QA visual.

## Integración Flow
No poner API Key/Secret Key en React ni en archivos públicos.

Arquitectura recomendada:
Frontend -> endpoint backend/serverless -> Flow API -> callback/confirmación -> frontend

Crear `.env` solo para backend y mantenerlo fuera de Git:
```
FLOW_API_KEY=...
FLOW_SECRET_KEY=...
FLOW_BASE_URL=...
```

## Material recuperado
Ver carpeta `/docs`.
