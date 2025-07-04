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


# 🧠 Sugerencias para completar/fortalecer módulo de usuarios:
- [x] 🔐 Cambiar contraseña (Change Password)
Ruta protegida.
Requiere contraseña actual + nueva.
Solo el propio usuario puede hacerlo.
Validar fuerza de la contraseña.

- [x] 📤 Olvidé mi contraseña / Reset Password (opcional)
Envío de token temporal por email.
Flujo de actualización de contraseña con token.
Requiere integración con email, pero es muy común.

- [x] 👁️ Get user by ID (detalles de usuario individual)
Permitido para uno mismo o admin.
Útil si tenés un perfil de usuario detallado.

- [x] 🧼 Soft delete / desactivar usuario (opcional)
Marcar un usuario como inactivo en vez de borrarlo.
Útil si no querés perder registros históricos.

- [ ] 📊 Auditoría (a futuro)
Registrar qué usuario hizo qué acción (crear, editar, etc.).
Puede hacerse con middleware que loguea la actividad.

- [ ] ⚙️ Actualizar configuración de perfil (avatar, bio, etc.)
Si tu app tiene información adicional del usuario, podés permitir editar esos datos desde un endpoint de perfil.


# 🧪 Otros detalles a considerar
### Tests unitarios e integración (ideal para services y rutas críticas como login).
### Rate limiting en login para evitar fuerza bruta.
### Bloqueo de cuenta tras varios intentos fallidos (opcional, si buscás seguridad avanzada).
### Verificación de email (si tu sistema lo requiere).