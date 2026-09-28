import type { ArtKind } from "@/components/illustrations/SolutionArt";
import type { Lang } from "@/lib/i18n";

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

const SERVICES_ES: ServiceInfo[] = [
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

const SERVICES_EN: ServiceInfo[] = [
  {
    slug: "tailored",
    name: "Tailored",
    tagline: "A precise snapshot of one location.",
    intro:
      "What happens around a specific point over a specific period: who lives there, who visits, how long they stay and where the spending comes from.",
    body:
      "You choose a point, its catchment area (on foot, by car, by radius or by administrative area) and a period. We tell you who lives there, who comes and where the spending comes from.",
    useful: "Deciding on an opening, assessing a site or planning a campaign.",
    example: "A picture of a shopping neighbourhood during one specific month.",
    art: "tailored",
    steps: [
      { title: "You choose the location", body: "An address, a shop or a point on the map." },
      { title: "We define the catchment area", body: "On foot, by car, by radius or by administrative area." },
      { title: "We set the period", body: "The month or season you want to understand." },
      { title: "We analyse and interpret", body: "We combine the sources and look for what really matters." },
      { title: "You get the report", body: "With the data and our reading of what it means." },
    ],
    includes: [
      { title: "Resident profile", body: "Population, age, disposable income and what households spend on." },
      { title: "Visitor profile", body: "Visits, busiest days and hours, length of stay and profile." },
      { title: "Consumer origin", body: "Which areas bring in the spending and how much each one weighs." },
      { title: "Surroundings", body: "Activity and points of interest around the location." },
      { title: "Human Intelligence", body: "Conclusions and recommendations from our team." },
    ],
    when: [
      "Before opening or moving a shop.",
      "To compare one location with another.",
      "To plan a campaign in a specific area.",
      "To understand what happened in a given period.",
    ],
  },
  {
    slug: "focus",
    name: "Focus",
    tagline: "How an area evolves, month by month.",
    intro:
      "We follow one or more shopping areas for a year and explain every month what has changed, in which area and why.",
    body:
      "We define one or more shopping areas and follow them through the year: visits, visitor profile, opening hours and where spending comes from, with a report every month.",
    useful: "Seeing the effect of what you do and spotting changes in time.",
    example: "Monthly tracking of six shopping streets in the same town, compared with each other.",
    art: "focus",
    steps: [
      { title: "We draw the areas", body: "Each shopping area, drawn to measure." },
      { title: "We measure every month", body: "The same indicators month after month, so they can be compared." },
      { title: "We compare", body: "Areas with each other, and each area with its previous months." },
      { title: "We explain it", body: "What went up, what went down and why that may be." },
    ],
    includes: [
      { title: "Visit trends", body: "Month by month and by day of the week." },
      { title: "Visitor profile", body: "Age, income and length of visit." },
      { title: "Timing", body: "How visits spread across hours and days." },
      { title: "Origin", body: "Where visitors come from and how far away they live." },
      { title: "Area comparison", body: "Every area in a single view." },
      { title: "Human Intelligence", body: "A monthly reading of what is going on." },
    ],
    when: [
      "To keep a finger on the pulse of a shopping street or centre.",
      "To measure the effect of actions sustained over time.",
      "To spot changes before they show up in sales.",
      "To compare areas with each other using the same criteria.",
    ],
  },
  {
    slug: "on-demand",
    name: "On Demand",
    tagline: "A tailor-made analysis for a specific question.",
    intro:
      "When the question doesn't fit a standard report: we design the analysis from scratch, with whatever period, areas and data it needs.",
    body:
      "Period, areas and data to measure, including your own if you want to combine them with ours. For questions that don't fit a standard report.",
    useful: "Measuring the impact of roadworks, an event or a change in mobility.",
    example: "The impact of a pedestrian zone on foot and road traffic, two and a half years after it opened.",
    art: "pedestrian",
    steps: [
      { title: "You ask the question", body: "What you need to know and which decision depends on it." },
      { title: "We design the analysis", body: "Areas, periods and comparisons built around that question." },
      { title: "We combine the data", body: "Ours and, if you want, yours too." },
      { title: "We present conclusions", body: "What happened, why, and what we recommend you do." },
    ],
    includes: [
      { title: "Area and period to measure", body: "Any shape of area and any time window." },
      { title: "Everything in Tailored and Focus", body: "Resident, visitor and consumer, as a snapshot or over time." },
      { title: "Your own data", body: "Combined with ours in the same analysis." },
      { title: "Custom indicators", body: "Indices built around your goals." },
      { title: "Human Intelligence", body: "All our experience on the ground." },
    ],
    when: [
      "To measure the impact of roadworks or pedestrianisation.",
      "To assess an event or a season.",
      "To compare scenarios before deciding.",
      "For any question that doesn't have a ready-made report.",
    ],
  },
];

export const SERVICES = SERVICES_ES;
export const servicesFor = (lang: Lang) => (lang === "en" ? SERVICES_EN : SERVICES_ES);
export const getService = (slug: string, lang: Lang = "es") => servicesFor(lang).find((s) => s.slug === slug);

/** The line in `includes` that stands for Human Intelligence, highlighted in the UI. */
export const IH_TITLES = ["Inteligencia Humana", "Human Intelligence"];
