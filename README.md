# Optimizador de envíos

Frontend del MVP para cotizar, recomendar y confirmar envíos dentro del flujo logístico del sistema. La aplicación actúa como capa de orquestación: recibe datos del usuario, consulta microservicios externos y muestra el resultado final sin contener lógica de negocio pesada.

## Qué consume

- `user-service`: registro e inicio de sesión.
	- `POST /api/users/register`
	- `POST /api/users/login`
- `shipment-service`: cotización, confirmación e historial.
	- `POST /api/v1/pedido`
	- `POST /api/v1/pedido/confirmar`
	- `GET /api/v1/pedido/mis-pedidos`
- `OpenRouteService`: autocompletado de ubicaciones y cálculo de ruta en el mapa.

El flujo de autenticación usa JWT: el frontend obtiene el token desde `user-service` y lo reusa como `Bearer` al llamar `shipment-service`.

## Rutas de la aplicación

- `/login`: pública.
- `/register`: pública.
- `/`: protegida, formulario de cotización.
- `/results`: protegida, muestra recomendación y alternativas.
- `/confirmation`: protegida, resume el pedido confirmado.
- `/history`: protegida, historial de pedidos del usuario autenticado.

Las rutas protegidas se resguardan con `ProtectedRoute`; si no hay sesión activa, el usuario es redirigido a `/login`.

## Flujo resumido

1. El usuario se registra o inicia sesión.
2. Completa origen, destino, peso y prioridad.
3. El frontend consulta la recomendación de envío.
4. El usuario selecciona un proveedor y confirma el pedido.
5. Se muestra la confirmación y, si lo necesita, el historial de pedidos.

## Variables de entorno

- `VITE_AUTH_API_BASE`: base del `user-service`.
- `VITE_ORDER_API_BASE`: base del `shipment-service`.
- `VITE_OPENROUTESERVICE_API_KEY`: clave para autocompletado y rutas.

## Ejecutar en local

```bash
npm install
npm run dev
```

## Pruebas

```bash
npm test
npm run test:integration
```

La prueba de integración contra OpenRouteService está protegida para evitar consumo accidental de tokens.
