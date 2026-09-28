import type { ArtKind } from "@/components/illustrations/SolutionArt";

export type ServiceInfo = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  body: string;
  useful: string;
  example: string;
  art: ArtKind;
  steps: { title: string; body: string }[];
  includes: { title: string; body: string }[];
  when: string[];
};

export const SERVICES: ServiceInfo[] = [
  {
    slug: "tailored",
    name: "Tailored",
    tagline: "Una foto precisa de una ubicación.",
    intro:
      "Qué pasa alrededor de un punto concreto durante un periodo concreto: quién vive, quién viene, cuánto se queda y de dónde sale el gasto.",
    body:
      "Eliges un punto, su área de influencia (a pie, en coche, por radio o por área administrativa) y un periodo. Te contamos quién vive, quién viene y de dónde sale el gasto.",
    useful: "Decidir una apertura, valorar un local o preparar una campaña.",
    example: "Radiografía de un barrio comercial durante un mes concreto.",
    art: "tailored",
    steps: [
      { title: "Eliges la ubicación", body: "Una dirección, un local o un punto en el mapa." },
      { title: "Definimos el área de influencia", body: "A pie, en coche, por radio o por área administrativa." },
      { title: "Fijamos el periodo", body: "El mes o la temporada que quieres entender." },
      { title: "Analizamos e interpretamos", body: "Cruzamos las fuentes y buscamos lo que de verdad importa." },
      { title: "Recibes el informe", body: "Con los datos y con nuestra lectura de qué significan." },
    ],
    includes: [
      { title: "Perfil del residente", body: "Población, edad, renta disponible y en qué gastan los hogares." },
      { title: "Perfil del visitante", body: "Visitas, días y horas de más afluencia, tiempo de estancia y perfil." },
      { title: "Origen del consumidor", body: "Qué áreas aportan el gasto y cuánto pesa cada una." },
      { title: "Entorno", body: "Actividad y puntos de interés que rodean la ubicación." },
      { title: "Inteligencia Humana", body: "Conclusiones y recomendaciones de nuestro equipo." },
    ],
    when: [
      "Antes de abrir o trasladar un local.",
      "Para comparar una ubicación con otra.",
      "Para preparar una campaña en una zona concreta.",
      "Para entender qué pasó en un periodo determinado.",
    ],
  },
  {
    slug: "focus",
    name: "Focus",
    tagline: "La evolución de una zona, mes a mes.",
    intro:
      "Seguimos una o varias áreas comerciales durante un año y te explicamos cada mes qué ha cambiado, en qué zona y por qué.",
    body:
      "Definimos una o varias áreas comerciales y las seguimos durante el año: visitas, perfil del visitante, horarios y origen del gasto, con un informe cada mes.",
    useful: "Ver el efecto de lo que haces y detectar cambios a tiempo.",
    example: "Seguimiento mensual de seis ejes comerciales de un mismo municipio, comparados entre sí.",
    art: "focus",
    steps: [
      { title: "Delimitamos las áreas", body: "Dibujamos cada zona comercial a medida." },
      { title: "Medimos cada mes", body: "Los mismos indicadores, mes tras mes, para que sean comparables." },
      { title: "Comparamos", body: "Zonas entre sí y cada zona con sus meses anteriores." },
      { title: "Te lo explicamos", body: "Qué ha subido, qué ha bajado y a qué puede deberse." },
    ],
    includes: [
      { title: "Evolución de las visitas", body: "Mes a mes y por día de la semana." },
      { title: "Perfil del visitante", body: "Edad, renta y duración de la visita." },
      { title: "Horarios", body: "Cómo se reparten las visitas por horas y días." },
      { title: "Origen", body: "Desde dónde llegan los visitantes y a qué distancia viven." },
      { title: "Comparativa entre zonas", body: "Todas las áreas en una misma vista." },
      { title: "Inteligencia Humana", body: "Una lectura mensual de lo que está pasando." },
    ],
    when: [
      "Para seguir el pulso de un eje o un centro comercial.",
      "Para medir el efecto de acciones sostenidas en el tiempo.",
      "Para detectar cambios antes de que se noten en caja.",
      "Para comparar zonas entre sí con el mismo criterio.",
    ],
  },
  {
    slug: "on-demand",
    name: "On Demand",
    tagline: "Un análisis a medida para una pregunta concreta.",
    intro:
      "Cuando la pregunta no cabe en un informe estándar: diseñamos el análisis desde cero, con el periodo, las zonas y los datos que haga falta.",
    body:
      "Periodo, zonas y datos a medida, incluidos los tuyos si quieres cruzarlos con los nuestros. Para preguntas que no caben en un informe estándar.",
    useful: "Medir el impacto de una obra, un evento o un cambio en la movilidad.",
    example: "Impacto de una zona peatonal en el tráfico peatonal y rodado, dos años y medio después de implantarla.",
    art: "pedestrian",
    steps: [
      { title: "Nos planteas la pregunta", body: "Qué necesitas saber y qué decisión depende de ello." },
      { title: "Diseñamos el análisis", body: "Zonas, periodos y comparativas pensados para esa pregunta." },
      { title: "Cruzamos los datos", body: "Los nuestros y, si quieres, también los tuyos." },
      { title: "Presentamos conclusiones", body: "Qué ha pasado, por qué y qué recomendamos hacer." },
    ],
    includes: [
      { title: "Área y periodo a medida", body: "Cualquier forma de zona y cualquier ventana de tiempo." },
      { title: "Todo lo de Tailored y Focus", body: "Residente, visitante y consumidor, en foto fija o en evolución." },
      { title: "Tus propios datos", body: "Los cruzamos con los nuestros en el mismo análisis." },
      { title: "Indicadores a medida", body: "Índices construidos según tus objetivos." },
      { title: "Inteligencia Humana", body: "Toda nuestra experiencia sobre el terreno." },
    ],
    when: [
      "Para medir el impacto de una obra o una peatonalización.",
      "Para evaluar un evento o una temporada.",
      "Para comparar escenarios antes de decidir.",
      "Para cualquier pregunta que no tenga un informe hecho.",
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
