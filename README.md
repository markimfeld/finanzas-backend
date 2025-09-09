# App de finanzas

# ✅ Ya implementado (muy bien estructurado):

- [x] Creación de usuarios con validación Zod + DTO.
- [x] Login con generación de JWT + Refresh Token.
- [x] Logout con invalidación segura.
- [x] Refresh Token flow funcional y validado.
- [x] Control de acceso por roles (RBAC) centralizado con archivo de permisos.
- [x] Validaciones avanzadas en actualización de usuarios (email único, solo admins cambian roles).
- [x] DTOs de respuesta para evitar exponer datos sensibles.
- [x] Tipado estricto (interfaces, types, DTOs).
- [x] Mensajes centralizados en messages.ts.
- [x] Manejo de errores customizados (HttpError, BadRequestError, etc.).
- [x] Cambiar contraseña.
- [x] Olvidé mi contraseña.
- [x] Obtener user by ID.
- [x] Desactivar usuario.
- [x] Auditoría.
- [x] Actualizar configuración de perfil (avatar, bio, etc.).

# 🧪 Otros detalles a considerar

### Tests unitarios e integración (ideal para services y rutas críticas como login).

### Rate limiting en login para evitar fuerza bruta.

### Bloqueo de cuenta tras varios intentos fallidos (opcional, si buscás seguridad avanzada).

### Verificación de email (si tu sistema lo requiere).

# 🧾 Módulo: Presupuestos (budgets)

## ✅ Funcionalidades básicas

- [x] Crear presupuesto.
      Monto total.
      Categoría.
      Fecha de inicio y fin.
      Asociado a usuario autenticado.

- [x] Obtener todos los presupuestos del usuario
      Listado paginado.
      Filtros por categoría, fechas, etc. (opcional).

- [x] Obtener un presupuesto específico por ID
      Solo si pertenece al usuario autenticado.

- [x] Actualizar presupuesto
      Editar monto, categoría o fechas.
      Validaciones necesarias (fechas válidas, montos positivos, etc.).

- [x] Eliminar presupuesto
      Eliminación lógica (soft delete) o física según decisión del sistema.

- [x] Validaciones de negocio
      Fechas coherentes (startDate < endDate)
      No permitir presupuestos superpuestos en misma categoría y período (opcional).
      Monto mayor a cero.

- [x] Autorización
      Solo el usuario dueño del presupuesto puede ver, editar o eliminar.

# 🧾 Módulo: Cuentas (accounts)

## ✅ Funcionalidades básicas

- [x] Crear cuenta.
      name: nombre de la cuenta (ej: "Caja de ahorro", "Cuenta sueldo", "MercadoPago").
      type: tipo de cuenta (bank, cash, digital_wallet, etc.).
      balance: número inicial.
      userId: referencia al usuario dueño.

- [x] Actualizar cuenta.
- [x] Lista cuentas.
- [x] Eliminar cuenta.

# 🧾 Módulo: Transacciones (transactions)

## ✅ Funcionalidades básicas

- [x] Crear transación.
      description: descripcion de la operacion (ej: "carga de nafta").
      type: tipo de transaccion ("income", "expense").
      amount: monto de la transación.
      userId: referencia al usuario dueño.

- [x] Actualizar transación.
- [x] Lista transacciones.
- [x] Eliminar transación.

# 🧾 Módulo: Inversiones (investments)

## ✅ Funcionalidades básicas

- [x] Crear investment.
- [x] Actualizar investment.
- [x] Lista investments.
- [x] Eliminar investment.

# 🧾 Módulo: Transacciones de inversión (investment transactions)

## ✅ Funcionalidades básicas

- [x] Crear investment transaction.
- [x] Actualizar investment. transaction.
- [x] Lista investment transactions.
- [x] Eliminar investment transaction.
