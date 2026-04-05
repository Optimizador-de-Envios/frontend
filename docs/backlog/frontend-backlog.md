## Frontend Backlog

**Target path**
- c:\Users\sanav\Documents\Sofka\Semana 7\optimizador-envios-frontend\docs\backlog\frontend-backlog.md

**Objetivo**
Adaptar el frontend actual para trabajar con autenticacion obligatoria desde el inicio del flujo, integrando registro, login, logout, rutas protegidas e historial de pedidos del usuario, sin romper el flujo actual de cotizacion y confirmacion.

**Orden TDD por capas**
1. Domain
2. Application
3. Infrastructure
4. UI Components
5. UI Pages

## Fase F1 - Domain
1. RED: crear pruebas para modelar sesion autenticada, datos minimos del usuario y expiracion de token.
2. GREEN: implementar tipos y utilidades puras para AuthSession, AuthUser, token expiry y guards de dominio.
3. REFACTOR: consolidar nombres y eliminar duplicacion entre tipos de auth y pedido.
4. RED: crear pruebas para mapear la respuesta del historial del shipment-service a un modelo de dominio consistente.
5. GREEN: implementar tipos de UserOrderSummary y funciones puras de normalizacion.
6. REFACTOR: alinear nomenclatura entre recommendation, confirmation y order history.
7. RED: crear pruebas para el nuevo `confirmationToken` dentro del intento de recomendacion.
8. GREEN: incorporar `confirmationToken` al modelo de dominio del flujo de recomendacion.
9. REFACTOR: dejar claro que `confirmationToken` pertenece al intento, no a la entidad de usuario.

## Fase F2 - Application Store y Hooks
1. RED: probar un auth store con login/logout, persistencia de token y clear de estado al logout.
2. GREEN: implementar authStore siguiendo el patron de Zustand existente.
3. REFACTOR: separar responsabilidades entre estado de sesion y estado de UI.
4. RED: probar hook useLogin con estados idle, loading, success y error.
5. GREEN: implementar useLogin como orquestador del api client y store.
6. REFACTOR: extraer manejo comun de errores async si aparece duplicacion.
7. RED: probar hook useRegister con flujo exitoso y error por email duplicado.
8. GREEN: implementar useRegister.
9. REFACTOR: homologar contratos entre useRegister y useLogin.
10. RED: probar hook useAuth o equivalente para protected route y session restore.
11. GREEN: implementar useAuth.
12. REFACTOR: asegurar que la logica de redireccion no quede duplicada en pages.
13. RED: probar hook useUserOrders para historial autenticado.
14. GREEN: implementar useUserOrders.
15. REFACTOR: unificar convenciones de fetch con useRecommendation y useConfirmOrder.
16. RED: probar que al logout se limpian orderStore y recommendationStore.
17. GREEN: implementar limpieza coordinada de stores.
18. REFACTOR: centralizar reset global de sesion.
19. RED: probar que useRecommendation guarda `confirmationToken` al obtener recomendacion.
20. GREEN: adaptar useRecommendation al nuevo contrato.
21. REFACTOR: evitar que los hooks de aplicacion conozcan detalles de transporte HTTP.
22. RED: probar que useConfirmOrder no dispara una segunda confirmacion valida para el mismo intento confirmado.
23. GREEN: adaptar useConfirmOrder para respetar idempotencia y estado previo.
24. REFACTOR: unificar la transicion entre results y confirmation.

## Fase F3 - Infrastructure API
1. RED: probar authApiService para register y login con parsing de respuestas y errores.
2. GREEN: implementar authApiService.
3. REFACTOR: extraer un api client comun con headers base y manejo de 401.
4. RED: probar que orderApiService envia Authorization header cuando hay sesion.
5. GREEN: adaptar orderApiService para trabajar autenticado.
6. REFACTOR: remover conocimiento de storage del adapter HTTP.
7. RED: probar userOrdersApiService para historial.
8. GREEN: implementar userOrdersApiService.
9. REFACTOR: unificar tratamiento de errores HTTP entre servicios.
10. RED: probar que postOrder parsea `confirmationToken`.
11. GREEN: adaptar el adapter de recomendacion al nuevo response.
12. REFACTOR: dejar claro el boundary entre response DTO y modelo interno.
13. RED: probar que confirmOrder envia `confirmationToken`.
14. GREEN: adaptar el adapter de confirmacion al nuevo request.
15. REFACTOR: centralizar contratos comunes del shipment-service.

## Fase F4 - UI Components
1. RED: probar LoginForm con validaciones minimas y submit.
2. GREEN: implementar LoginForm.
3. REFACTOR: reutilizar patrones de OrderForm sin meter logica de negocio en UI.
4. RED: probar RegisterForm con validaciones minimas y mensajes.
5. GREEN: implementar RegisterForm.
6. REFACTOR: extraer componentes compartidos si aparecen duplicados.
7. RED: probar ProtectedRoute para redireccion sin sesion.
8. GREEN: implementar ProtectedRoute.
9. REFACTOR: garantizar que el componente solo dependa de hooks, no de API directa.
10. RED: probar AppHeader autenticado con acciones login, logout e historial.
11. GREEN: adaptar AppHeader.
12. REFACTOR: separar variantes visuales si el header empieza a crecer demasiado.
13. RED: probar lista de pedidos del usuario.
14. GREEN: implementar componente de historial.
15. REFACTOR: consolidar estados vacio, loading y error.
16. RED: probar que el boton de confirmar queda bloqueado cuando el intento ya fue confirmado o esta en loading.
17. GREEN: implementar ese comportamiento en la UI.
18. REFACTOR: garantizar feedback claro al usuario sobre el estado del intento.

## Fase F5 - UI Pages y Routing
1. RED: probar LoginPage y RegisterPage en conjunto con sus hooks.
2. GREEN: implementar ambas pages.
3. REFACTOR: unificar layout de autenticacion.
4. RED: probar que OrderPage, ResultsPage y ConfirmationPage quedan protegidas.
5. GREEN: adaptar el routing principal en main.tsx.
6. REFACTOR: eliminar accesos directos a rutas no autenticadas.
7. RED: probar UserOrdersPage con historico vacio y con pedidos.
8. GREEN: implementar UserOrdersPage.
9. REFACTOR: alinear la navegacion completa post-login y post-confirmacion.
10. RED: probar navegacion atras desde ConfirmationPage y asegurar que no habilita una nueva confirmacion del mismo intento.
11. GREEN: ajustar ResultsPage o la navegacion para reflejar intento ya confirmado.
12. REFACTOR: dejar una experiencia consistente entre refresh, back y confirmacion exitosa.

## Dependencias y orden recomendado
- F0 debe resolverse antes de cerrar el contrato definitivo del shipment-service o en paralelo inmediato.
- F1 bloquea F2.
- F2 desbloquea F3 y parte de F4.
- F3 bloquea el flujo end-to-end.
- F4 y F5 pueden avanzar parcialmente en paralelo una vez existan hooks estables.

## Verificacion frontend
1. Flujo registro -> login -> cotizacion -> recomendacion -> confirmacion -> historial.
2. Redireccion a login si no hay token.
3. Limpieza de stores al logout.
4. Rehidratacion de sesion tras refresh si el token sigue vigente.
5. Un mismo `confirmationToken` no debe producir dos confirmaciones distintas en la experiencia del usuario.
