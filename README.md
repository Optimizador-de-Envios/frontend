# Optimizador de envíos — MVP

Pequeña herramienta para validar y recomendar opciones de envío según prioridad (menor costo o menor tiempo).

Resumen rápido (MVP)
- Registro de datos del envío: origen, destino y peso.
- Selector de prioridad: menor costo o menor tiempo.
- Motor de evaluación con proveedores simulados (FedEx, DHL, proveedor local representativo).
- Generación de la recomendación principal y visualización de alternativas.
- Selección de proveedor y persistencia temporal en estado (Zustand).

Tests
- Las pruebas unitarias se ejecutan por defecto; la prueba de integración contra OpenRouteService está protegida y **se ejecuta sólo cuando se habilita explícitamente** (para evitar consumir tokens).

# Run full unit tests (integration skipped)
npm test

# Run only the guarded integration test (loads .env.local + .env.integration)
npm run test:integration

Notas rápidas
- Proporcione la clave de OpenRouteService en `.env.local` para la integración. No subir ni commitear claves a VCS.
- El repositorio ya usa un guard para que la integración se ejecute sólo con `RUN_OPENROUTE_INTEGRATION=true`.

Docker (desarrollo)

Levanta el proyecto en un contenedor para desarrollo con HMR disponible en el host.

1. Construir y levantar:

```bash
docker compose up --build
```

2. Abrir en el navegador: http://localhost:5173

Notas:
- El `docker-compose` usa `Dockerfile.dev` y monta el código fuente como volumen para desarrollo.
- Para Windows, `CHOKIDAR_USEPOLLING=true` está activado en la configuración para asegurar que HMR detecte cambios.
