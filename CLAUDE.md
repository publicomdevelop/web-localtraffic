# web-localtraffic

Web de LocalTraffic. Este archivo fija cómo se diseña y se programa aquí. Si una regla de un skill (`frontend-design`, `design-taste`) choca con este archivo, manda este archivo.

## Antes de programar: plan de diseño

No escribas código de interfaz sin un plan aprobado. Cada plan incluye:

1. **Paleta** de 4 a 6 colores en hex, con el rol de cada uno (fondo, texto, acento, estados…).
2. **Tipografías**, con el rol de cada una (titulares, texto, datos/UI). Dos familias suelen bastar.
3. **Estructura** de cada página como wireframe ASCII.
4. **La idea memorable**: qué va a hacer que alguien recuerde esta web.

Después, espera mi aprobación. Si cambia algo importante, vuelve a proponer el plan.

## Revisa el plan contra lo genérico

Antes de presentarlo, repasa el plan y descarta si aparece cualquiera de estos tópicos:

- Fondo crema con acento terracota.
- Negro con verde ácido.
- Degradados morados.
- Tarjetas redondeadas idénticas con sombra suave.
- Etiquetas en MAYÚSCULAS encima de cada título.
- Una palabra del titular en otro color.
- Numeración 01 / 02 / 03 cuando no hay una secuencia real.
- Animaciones de aparición en cada sección.

## Criterio visual

- Las decisiones visuales salen del sector, del público y del contenido real del proyecto, no de plantillas ni de tendencias. Justifica cada elección con eso.
- Una sola idea atrevida por página. Todo lo demás, sobrio y bien cuidado.

## Mínimos no negociables

- Responsive hasta móvil (revisa a 375 px de ancho, sin scroll horizontal).
- Foco visible con teclado en todo elemento interactivo.
- Respeta `prefers-reduced-motion`.
- Buen contraste: WCAG AA como mínimo (4.5:1 texto normal, 3:1 texto grande).

## Animación

- Se permite animación abundante, pero solo si explica los datos (capas del mapa, gráficos que se dibujan, flujos). Nada de efectos genéricos de aparición en cada sección.
- Usa GSAP (ScrollTrigger) para lo orquestado con el scroll; CSS para lo pequeño.
- Siempre con alternativa para `prefers-reduced-motion`: la página debe entenderse entera con todo quieto.

## Textos

- Claros y concretos, sin relleno de marketing.
- Di qué hace, para quién y con qué datos, en lugar de adjetivos.

## Entorno

- En este Mac no hay Node/npm local: las builds se verifican en Vercel. Por eso no se puede ejecutar `scripts/preflight.mjs` del skill `design-taste`; aplica su checklist (`reference/pre-flight.md`) a mano.

## Decisiones aprobadas (sept. 2026)

- Paleta: Noche `#0E0B1C`, Capa `#18142C`, Azul localtraffic `#3340F5`, Azul señal `#8A92FF`, Texto `#ECEDF7`, Consumo `#FF6B3D` (solo capa de consumo).
- Tipografías: Outfit (titulares y texto) e IBM Plex Mono (cifras y etiquetas).
- Idea central: la ciudad ilustrada de noche (`lib/city/`): perfil del residente, perfil del visitante y origen del consumidor. El consumo se pinta por zonas de código postal, nunca por calle.
- Posicionamiento: Inteligencia Humana (IH): interpretamos los datos. No usar la palabra "consultoría" en la web ni presentarnos como herramienta. Servicios: Tailored, Focus y On Demand. Los datos también sirven para activar campañas.
- Contenido: no nombrar clientes ni sectores concretos como destinatarios; no listar datasets de forma explícita; no mencionar bancos ni proveedores; no indicar granularidad de los datos (la transaccionalidad es por CP); nada de precios. Castellano e inglés.
- Formulario de demo: `/api/demo` envía con Resend (`RESEND_API_KEY` en Vercel) a `hola@localtraffic.es` (o `DEMO_TO_EMAIL`).
- Estructura multipágina: `/`, `/enfoque`, `/servicios`, `/servicios/[slug]` (datos en `lib/services.ts`), `/campanas`, `/contacto`. Nada de one page.
- Mapas: rejilla recta en perspectiva isométrica con edificios extruidos (sin anillo ni diagonal, sin ondulaciones); el área de influencia del hero es un círculo sobre el suelo (elipse en pantalla, `inGroundCircle`).
- Navegación: megamenú en Servicios, transición de cortina entre páginas (`app/template.tsx`), redes: Instagram y LinkedIn (`components/Social.tsx`).
- Ritmo entre secciones: alternar `band--layer`, `band--grid`, `Marquee` y `CtaBand` (azul) para que el scroll no sea plano.

## SEO, GEO y buscadores de IA

- Metadatos por página con `pageMeta()` (`lib/seo.ts`): título, descripción, canonical y Open Graph. Cada página nueva debe usarlo.
- Datos estructurados (JSON-LD): Organization + WebSite en el layout, BreadcrumbList en `PageHero`, Service en cada servicio y FAQPage en `/enfoque`.
- `app/sitemap.ts`, `app/robots.ts` (permite a los rastreadores de IA), `app/opengraph-image.tsx` y `public/llms.txt` (resumen para asistentes de IA: actualizarlo si cambian servicios o contacto).
- La web es `noindex` mientras `SITE_INDEXABLE` no sea `true` en Vercel. Activarlo solo cuando `localtraffic.es` apunte a este proyecto. `NEXT_PUBLIC_SITE_URL` por defecto es `https://www.localtraffic.es` (Vercel redirige el dominio sin www a www).

## Idiomas

- Castellano en las URL originales (`app/(es)/…`) e inglés en `/en/…` (`app/(en)/en/…`). Cada grupo tiene su propio layout raíz con `<html lang>`.
- El contenido de las páginas vive en `components/pages/*Page.tsx` y recibe `lang`. Los componentes de cliente leen el idioma de la URL con `useLang()`.
- Rutas y equivalencias entre idiomas en `lib/i18n.ts` (`ROUTES`, `route()`, `counterpart()`); metadatos con hreflang en `lib/pageMeta.ts`.
- Cada texto nuevo se añade en los dos idiomas (objetos `COPY = { es, en }`). Inglés británico.

## Cookies y analítica

- Google Analytics 4 (`GA_ID` en `lib/site.ts`, `G-GPP24MSVBB`) solo se carga tras aceptar el banner (`components/CookieBanner.tsx`, `components/Analytics.tsx`, `lib/consent.ts`). No añadir scripts de terceros que pongan cookies sin pasar por ese consentimiento.
- Si se añade cualquier cookie o herramienta nueva, actualizar la tabla de la Política de cookies y la de privacidad (`components/pages/LegalPage.tsx`).
- Dirección para Google: Carrer Sant Antoni 2, 08800 Vilanova i la Geltrú (oficina, no la de facturación).

## Tema claro / oscuro

- La web arranca en oscuro; el conmutador (`components/ThemeToggle.tsx`, abajo a la derecha) permite pasar a claro y se recuerda por navegador (`lt:theme`).
- No escribir colores fijos en CSS: usar los tokens de `:root` (`--ink`, `--ink-rgb`, `--layer`, `--night-rgb`, `--line`…), que cambian con `[data-theme="light"]`.
- Mapas, ilustraciones y el bloque azul se quedan oscuros en ambos modos (ámbito oscuro en `globals.css`: `.map`, `.story__sticky`, `.mega__thumb`).

## Demo con ubicación (Mapbox)

- `NEXT_PUBLIC_MAPBOX_TOKEN` (token público `pk.` restringido a nuestros dominios) en Vercel.
- Barra flotante `components/DemoDock.tsx` + selector `components/LocationPicker.tsx` (autocompletar Geocoding v6, modos a pie/coche 10-15-20 min o CP/municipio). Al pedir demo vuela a un panel con mapa y `DemoFormBody`.
- `/api/map` genera la imagen estática con la isócrona real (se usa en el panel y en los correos, así el token no viaja en emails). La API de demo recibe `direccion, lng, lat, cp, municipio, modo, minutos, admin` (`lib/location.ts`).
- La confirmación al cliente no repite la dirección como texto (evita usar el formulario para enviar spam).
