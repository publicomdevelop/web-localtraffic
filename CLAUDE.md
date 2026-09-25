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

- Usa GSAP o Motion solo cuando aporte algo.
- Mejor un único momento orquestado que muchos efectos sueltos.
- Siempre con alternativa para `prefers-reduced-motion`.

## Textos

- Claros y concretos, sin relleno de marketing.
- Di qué hace, para quién y con qué datos, en lugar de adjetivos.

## Entorno

- En este Mac no hay Node/npm local: las builds se verifican en Vercel. Por eso no se puede ejecutar `scripts/preflight.mjs` del skill `design-taste`; aplica su checklist (`reference/pre-flight.md`) a mano.
