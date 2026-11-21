# Villa Peñas · Catálogo de paquetes y extras

Examen práctico de **Programación III** — Universidad Nacional, Sede Regional Chorotega.
Desarrollo de una interfaz que consume una API REST pública.

- **Estudiante:** Deiby Emmanuel Brenes Sandino
- **Tecnologías:** React 19 + TypeScript + Vite 8
- **API:** https://villa-penas-production.up.railway.app (documentación Swagger en `/api/docs`)
- **Repositorio:** https://github.com/Brenes-DEV/villa-penas-app

Aplicación web para que un cliente de Villa Peñas (espacio para eventos en Chirco, Santa Cruz,
Guanacaste) explore los **paquetes** disponibles, vea **todo lo que incluye** cada uno y revise los
**productos adicionales** que puede sumar a su evento. Toda la información viene en tiempo real de
la API; no hay datos escritos a mano en el código.

---

## 1. Cómo ejecutar el proyecto

**Requisitos:** Node.js 20.19 o superior (probado con Node 24) y conexión a Internet.

```bash
npm install
npm run dev
```

Abrir **http://localhost:5173** en el navegador.

> El servidor está fijado al puerto 5173 (`vite.config.ts`) porque es el origen que la API tiene
> autorizado por CORS. Si el puerto está ocupado, Vite avisa en lugar de cambiarse a otro.

Otros comandos:

| Comando         | Qué hace                                                  |
| --------------- | --------------------------------------------------------- |
| `npm run build` | Revisa los tipos con TypeScript y genera la versión final |
| `npm run lint`  | Revisa el código con Oxlint                               |

> **Nota para Visual Studio 2026:** la terminal integrada cierra el servidor de Vite apenas arranca.
> Ejecutar `npm run dev` en una ventana de PowerShell aparte (en la carpeta del proyecto).

---

## 2. Ficha de análisis de los servicios

Base URL: `https://villa-penas-production.up.railway.app` (sin prefijo `/api`).

| Recurso / operación GET                             | Datos relevantes                                                                                                                                                                              | Uso dentro de la interfaz                                                                                                                            |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.** `GET /public/paquetes`                       | Arreglo de paquetes activos: `id`, `nombre`, `descripcion`, `precioColones` y `paquetesServicios[]` (cada uno con `orden` y el `servicio` incluido: `nombre`, `descripcion`)                  | Lista de tarjetas con **búsqueda** por nombre, descripción o servicio. Cada tarjeta muestra precio, descripción y los primeros 3 servicios incluidos |
| **2.** `GET /public/paquetes/{id}`                  | Un paquete activo con todos sus servicios. Si no existe responde **404**                                                                                                                      | **Vista detallada** "Todo lo que incluye", que se abre al seleccionar un paquete; lista todos los servicios ordenados por `orden`                    |
| **3.** `GET /public/opciones-productos-adicionales` | Arreglo de opciones activas: `nombre`, `descripcion`, `unidadMedida`, `cantidadIncluida`, `cantidadPersonas`, `precioVentaColones` y el `productoAdicional` al que pertenece (`id`, `nombre`) | Catálogo de **extras** con **búsqueda** y **filtro por producto** (Palomitas de maíz, Algodón de azúcar, Fuente de chocolate, etc.)                  |

### Atributos que no se usan

Se descartaron `activo`, `fechaCreacion`, `fechaActualizacion`, `paqueteId`, `servicioId` y
`productoAdicionalId` como dato visible, porque son de control interno y no le aportan al cliente.
`productoAdicionalId` sí se usa por dentro para el filtro.

### Justificación de la elección

1. **Son públicos de verdad.** En Swagger aparecen en las secciones _"Paquetes públicos"_ y
   _"Opciones de productos adicionales públicas"_ **sin candado** (sin `access-token`), y se comprobó
   en el navegador que responden **200** sin credenciales.
2. **Devuelven JSON con datos útiles** para un cliente: precios, servicios y opciones reales.
3. **Se complementan entre sí:** la lista lleva al detalle (endpoint 1 → 2) y los extras completan
   el armado de un evento, igual que el flujo de cotización de la página oficial.

### Endpoints descartados

| Endpoint                                                    | Motivo                                                                                                                                                                             |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /public/instagram`                                     | Falló al consultarlo. La documentación indica que puede responder **502** o **503** (servicio no configurado). La sección de Instagram de la página oficial también mostraba error |
| `GET /public/paquetes/reporte/pdf` y similares              | Devuelven un **PDF**, no JSON                                                                                                                                                      |
| `/paquetes`, `/servicios`, `/reservaciones`, `/pagos`, etc. | Requieren **token** (`access-token`). El examen prohíbe usar credenciales                                                                                                          |
| Cualquier `POST`, `PATCH` o `DELETE`                        | Requieren token y modificarían datos. El examen solo pide consultas GET                                                                                                            |

---

## 3. Funcionalidades

- **Búsqueda** de paquetes por nombre, descripción o servicio incluido (ej. "piscina"). No distingue
  tildes ni mayúsculas.
- **Vista detallada** de un paquete con todos sus servicios (endpoint 2).
- **Búsqueda y filtro por producto** en los productos adicionales, con un selector propio accesible
  con teclado.
- **Pestañas** para cambiar entre paquetes y productos adicionales.
- **Estados manejados:**
  - **Cargando:** indicador animado mientras llega la respuesta.
  - **Error:** mensaje claro y botón **"Intentar de nuevo"** (sin conexión, 404 o error del servidor).
  - **Sin resultados:** mensaje y botón **"Limpiar filtros"** cuando la búsqueda no encuentra nada.
- **Cancelación de peticiones** con `AbortController`: si el usuario cambia de paquete o de pestaña
  antes de que llegue la respuesta, la petición anterior se cancela.
- Diseño adaptable a celular, con foco visible para teclado y respeto a la preferencia de
  "reducir movimiento".

---

## 4. Organización del código

```
src/
├── types/villa.ts            Tipos TypeScript basados en las respuestas reales de la API
├── services/villaApi.ts      Capa de consumo: las 3 funciones GET y el manejo de errores HTTP
├── hooks/useApi.ts           Hook reutilizable: estados de carga y error, reintento y cancelación
├── utils/formato.ts          Formato de colones y normalización de texto para la búsqueda
├── components/
│   ├── Estados.tsx           Cargando, MensajeError y SinResultados (reutilizados en toda la app)
│   ├── Buscador.tsx          Campo de búsqueda reutilizable
│   ├── Selector.tsx          Lista desplegable propia, accesible con teclado
│   ├── IntroSeccion.tsx      Encabezado de sección ("01 / Paquetes")
│   ├── PaqueteCard.tsx       Tarjeta de un paquete
│   ├── PaquetesLista.tsx     Endpoint 1 + búsqueda
│   ├── PaqueteDetalle.tsx    Endpoint 2 + vista detallada
│   ├── OpcionCard.tsx        Tarjeta de un producto adicional
│   └── ExtrasCatalogo.tsx    Endpoint 3 + búsqueda y filtro
├── App.tsx                   Estructura general y navegación entre pestañas
└── index.css                 Estilos
```

Los componentes **no llaman a `fetch` directamente**: usan las funciones de `services/villaApi.ts`
a través del hook `useApi`. Así la lógica de consumo queda separada de la interfaz.

---

## 5. Cómo se comprobaron los resultados

1. **Swagger:** se revisó la documentación para identificar qué endpoints no requieren token.
2. **Pestaña Red (Network) del navegador:** en cada endpoint se verificó la URL, el método **GET**,
   el código **200 OK**, el encabezado `Origin: http://localhost:5173` y la respuesta JSON.
   La columna _Iniciador_ muestra que cada petición sale de `villaApi.ts`.
3. **Comparación con la página oficial** (eventosvillapenas.com): los nombres y precios de los
   paquetes (₡60 000 y ₡80 000) y los productos adicionales coinciden.
4. **Prueba de estados:**
   - Error: se activó el modo **"Sin conexión"** en la pestaña Red y se recargó.
   - Sin resultados: se buscó un texto inexistente (ej. `xyz`).
   - Detalle inexistente: el servicio traduce el **404** a un mensaje claro.
5. **Revisión del código:** `npx tsc -b`, `npm run lint` y `npm run build` terminan sin errores.

> En modo desarrollo aparece una petición **(cancelada)** antes de la exitosa. Es normal: React
> (`StrictMode`) ejecuta los efectos dos veces y el hook `useApi` cancela la primera con
> `AbortController`. En la versión final (`npm run build`) solo se hace una petición.

---

## 6. Limitaciones encontradas

- **`/public/instagram` no responde** (error del servicio externo), por eso no se usó.
- **Swagger no documenta la forma de las respuestas** de los endpoints públicos ni la URL base
  (`servers` está vacío). Hubo que inspeccionar las respuestas reales para definir los tipos, y
  confirmar que la URL base **no** lleva `/api` (con `/api/public/...` la consulta falla).
- **Depende de Internet y de Railway:** si el servidor de la API cae, la app muestra el estado de
  error con la opción de reintentar.
- **CORS:** la API solo responde al navegador desde los orígenes autorizados (`localhost:5173`).
  Por eso el puerto quedó fijo.
- **Problemas del entorno con Visual Studio 2026** y cómo se resolvieron:
  - La terminal integrada cierra Vite: se usa PowerShell aparte.
  - Vite fallaba con `EBUSY` por la carpeta `.vs`: se excluyó en `vite.config.ts` (`watch.ignored`)
    y en `.gitignore`.
  - El compilador nativo de TypeScript (versión preliminar) marca errores falsos en `.tsx` y
    desacomodaba el JSX al pegar: se desactivó "Dar formato al pegar". La compilación real
    (`tsc -b`) no tiene errores.

---

## 7. Evidencias

Capturas en la carpeta [`evidencias/`](evidencias):

| Archivo                                | Contenido                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `01-interfaz-filtro-extras.png`        | Interfaz funcionando: catálogo de extras con el selector de producto abierto     |
| `02-network-paquetes.png`              | `GET /public/paquetes`: URL, método GET, 200 OK y `Access-Control-Allow-Origin`  |
| `02b-network-paquetes-datos.png`       | `GET /public/paquetes`: respuesta JSON con los 2 paquetes                        |
| `03-network-detalle.png`               | `GET /public/paquetes/1`: URL, método GET y 200 OK, con el detalle en pantalla   |
| `03b-network-detalle-datos.png`        | `GET /public/paquetes/1`: respuesta JSON junto a la vista detallada              |
| `04-network-extras.png`                | `GET /public/opciones-productos-adicionales`: URL, GET, 200 OK y CORS            |
| `04b-network-extras-datos.png`         | `GET /public/opciones-productos-adicionales`: respuesta JSON con las 10 opciones |
| `05-estado-sin-resultados.png`         | Estado sin resultados en paquetes (búsqueda `xyz`)                               |
| `05b-estado-sin-resultados-extras.png` | Estado sin resultados en productos adicionales                                   |

> En las capturas de Network aparece una petición **(cancelada)** antes de cada petición exitosa:
> es la cancelación intencional explicada en la sección 5.

---

## 8. Créditos de diseño

- **Identidad de marca:** página oficial de Villa Peñas (eventosvillapenas.com): colores crema y
  café, títulos en serif, textos, logo y dirección.
- **Paletas de color:** referencias del diseñador **@marcelodesignxh** (Instagram): verde bosque y
  dorado, turquesa y durazno, y blanco `#FCFEFF`.
- **Estilo de burbujas de vidrio:** inspirado en el estilo _Liquid Glass_ de Apple, hecho con CSS
  (`backdrop-filter`, bordes con luz y sombras).
- **Tipografías (Google Fonts):** Newsreader (títulos), Geist y Geist Mono (texto y etiquetas).
