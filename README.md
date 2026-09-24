# Depósito Principal – versión web compartida

Esta versión está preparada para Cloudflare Pages + Pages Functions.

## Qué hace
- URL pública para ver el layout.
- Cualquier persona con el link puede cargar una nueva LX02.
- La nueva LX02 queda guardada centralmente y la ven todos.
- Guarda una copia de la LX02 anterior (`lx02:previous`) como respaldo simple.
- Panel de administración con contraseña.
- Desde administración se configura la letra de `Material utilización limitada`.
- La contraseña nunca se guarda dentro del HTML.

## Infraestructura
- Cloudflare Pages: publica la web.
- Pages Functions: login, configuración y almacenamiento.
- Workers KV: guarda la LX02 actual, la anterior y la configuración.

## Configuración en Cloudflare
1. Crear un proyecto de Pages con este repositorio/carpeta.
2. Configurar el directorio de salida como `public`.
3. Crear un namespace de Workers KV.
4. Vincularlo al proyecto con el nombre exacto `APP_KV`.
5. Crear estas variables/secretos del proyecto:
   - `ADMIN_PASSWORD`: contraseña elegida para el panel.
   - `SESSION_SECRET`: una cadena larga y aleatoria (idealmente 32+ caracteres).
6. Desplegar.

## Seguridad
La carga de LX02 está pública porque así fue definido para esta versión.
Eso significa que cualquier persona que tenga el link puede reemplazar los datos actuales.
Si se desea, se puede proteger también la carga de LX02 con contraseña o con usuarios corporativos.

## Regla de estados
Prioridad de una ubicación:
1. `S` → rojo
2. `Q` → naranja
3. letra configurada como limitada → amarillo
4. material sin esas diferenciaciones → verde
5. sin registros → blanco
