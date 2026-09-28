import PageHero from "@/components/PageHero";
import { COMPANY, CONTACT } from "@/lib/site";
import { route, type Lang } from "@/lib/i18n";

// Adapted from the legal texts of publicom.cat (same company, Publicom All Line,
// S.L.U.) to what this site actually does: a demo form sent through Vercel and
// Resend, no cookies, only sessionStorage for the zone typed in the ask bar.

type Section = { title: string; paragraphs?: string[]; list?: string[] };
type Doc = { title: string; lede: string; updated: string; sections: Section[]; note?: string };

const address = `${COMPANY.street} (${COMPANY.building}), ${COMPANY.postalCode} ${COMPANY.city} (${COMPANY.region})`;

const LEGAL: Record<Lang, Doc> = {
  es: {
    title: "Aviso legal",
    lede: "Quién está detrás de localtraffic y en qué condiciones puedes usar esta web.",
    updated: "Última actualización: 28 de septiembre de 2026",
    sections: [
      {
        title: "Información general",
        paragraphs: [
          "En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), te informamos de que el sitio web www.localtraffic.es (en adelante, el Sitio Web) y la marca localtraffic son titularidad de:",
        ],
        list: [
          `Titular: ${COMPANY.legalName}`,
          `NIF: ${COMPANY.taxId}`,
          `Inscripción: ${COMPANY.registry}`,
          `Representante: ${COMPANY.representative}`,
          `Domicilio: ${address}`,
          `Teléfono: ${COMPANY.phone}`,
          `Email: ${CONTACT.email}`,
        ],
      },
      {
        title: "Condiciones de uso",
        paragraphs: [
          "Estas condiciones regulan el acceso y el uso del Sitio Web, sus contenidos y sus servicios. Navegar por el Sitio Web te da la condición de usuario e implica que aceptas estas condiciones y sus modificaciones posteriores, por lo que te recomendamos leerlas cada vez que lo visites.",
          "El acceso es libre y gratuito, salvo el coste de la conexión a internet de tu proveedor. Consultar los contenidos no requiere registro.",
          "Te comprometes a hacer un uso correcto del Sitio Web, conforme a la ley, a la moral y al orden público, y a que la información que nos facilites en los formularios sea veraz. El simple acceso al Sitio Web no supone ninguna relación comercial con nosotros.",
          "Podemos modificar en cualquier momento, sin aviso previo, la presentación, la configuración y los contenidos del Sitio Web, así como interrumpir o cancelar cualquiera de sus elementos.",
        ],
      },
      {
        title: "Exclusión de garantías y responsabilidad",
        paragraphs: [
          "Hacemos todo lo posible para que el Sitio Web funcione correctamente, pero no garantizamos que el acceso sea ininterrumpido ni que esté libre de errores, ni respondemos de los daños que puedan derivarse del acceso o del uso del Sitio Web, incluidos los causados en los sistemas informáticos del usuario, ni de caídas o fallos de las telecomunicaciones.",
          "Las cifras que aparecen en los mapas, ilustraciones y ejemplos del Sitio Web son datos de ejemplo sobre una ciudad ilustrada y no corresponden a ninguna zona ni cliente reales.",
        ],
      },
      {
        title: "Enlaces",
        paragraphs: [
          "El Sitio Web puede incluir enlaces a sitios de terceros, como la plataforma de clientes localtraffic.app, Instagram o LinkedIn. No somos responsables de sus contenidos ni de sus políticas, que se rigen por sus propias condiciones.",
          "Si enlazas el Sitio Web desde otra web, no puedes reproducir sus contenidos sin autorización, hacer afirmaciones falsas o inexactas sobre él, ni dar a entender una relación con localtraffic que no exista.",
        ],
      },
      {
        title: "Propiedad intelectual e industrial",
        paragraphs: [
          `${COMPANY.legalName}, por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial del Sitio Web y de sus elementos: textos, imágenes, ilustraciones, mapas, diseño, código, marcas y logotipos, incluida la marca localtraffic.`,
          "Queda prohibida la reproducción, distribución o comunicación pública, total o parcial, de estos contenidos con fines comerciales sin autorización. Puedes visualizarlos, imprimirlos o guardarlos para tu uso personal. Si crees que algún contenido vulnera tus derechos, escríbenos a los datos de contacto indicados arriba.",
        ],
      },
      {
        title: "Legislación aplicable y jurisdicción",
        paragraphs: [
          "La relación entre el usuario y el titular del Sitio Web se rige por la legislación española. Cualquier controversia se someterá a los juzgados y tribunales que correspondan conforme a derecho.",
        ],
      },
    ],
  },
  en: {
    title: "Legal notice",
    lede: "Who is behind localtraffic and the terms on which you can use this website.",
    updated: "Last updated: 28 September 2026",
    note: "This is a translation for information purposes. The Spanish version prevails in case of discrepancy.",
    sections: [
      {
        title: "General information",
        paragraphs: [
          "In accordance with Spanish Law 34/2002 of 11 July on Information Society Services and Electronic Commerce (LSSI-CE), the website www.localtraffic.es (the Website) and the localtraffic brand are owned by:",
        ],
        list: [
          `Owner: ${COMPANY.legalName}`,
          `Tax ID (NIF): ${COMPANY.taxId}`,
          `Registration: ${COMPANY.registry}`,
          `Representative: ${COMPANY.representative}`,
          `Address: ${address}, Spain`,
          `Phone: +34 ${COMPANY.phone}`,
          `Email: ${CONTACT.email}`,
        ],
      },
      {
        title: "Terms of use",
        paragraphs: [
          "These terms govern access to and use of the Website, its content and its services. Browsing the Website makes you a user and means you accept these terms and any later changes, so we recommend reading them on each visit.",
          "Access is free of charge, apart from the cost of your own internet connection. No registration is needed to view the content.",
          "You agree to use the Website lawfully and properly, and to provide truthful information in any form. Simply visiting the Website does not create any commercial relationship with us.",
          "We may change the presentation, configuration and content of the Website at any time without notice, and suspend or discontinue any part of it.",
        ],
      },
      {
        title: "Disclaimer and liability",
        paragraphs: [
          "We do our best to keep the Website working properly, but we do not guarantee uninterrupted or error-free access, and we are not liable for any damage arising from access to or use of the Website, including damage to users' computer systems or failures in telecommunications.",
          "Figures shown in the Website's maps, illustrations and examples are sample data about an illustrated city and do not refer to any real area or client.",
        ],
      },
      {
        title: "Links",
        paragraphs: [
          "The Website may link to third-party sites, such as the localtraffic.app client platform, Instagram or LinkedIn. We are not responsible for their content or policies, which are governed by their own terms.",
          "If you link to the Website from another site, you may not reproduce its content without permission, make false or inaccurate statements about it, or suggest a relationship with localtraffic that does not exist.",
        ],
      },
      {
        title: "Intellectual and industrial property",
        paragraphs: [
          `${COMPANY.legalName}, directly or as assignee, holds all intellectual and industrial property rights in the Website and its elements: texts, images, illustrations, maps, design, code, trade marks and logos, including the localtraffic brand.`,
          "Reproducing, distributing or publicly communicating this content, in whole or in part, for commercial purposes without permission is prohibited. You may view, print or save it for your personal use. If you believe any content infringes your rights, please contact us using the details above.",
        ],
      },
      {
        title: "Governing law and jurisdiction",
        paragraphs: [
          "The relationship between users and the owner of the Website is governed by Spanish law. Any dispute will be submitted to the competent courts in accordance with the law.",
        ],
      },
    ],
  },
};

const PRIVACY: Record<Lang, Doc> = {
  es: {
    title: "Política de privacidad",
    lede: "Qué datos recogemos en esta web, para qué los usamos y cómo puedes ejercer tus derechos.",
    updated: "Última actualización: 28 de septiembre de 2026",
    sections: [
      {
        title: "Responsable del tratamiento",
        list: [
          `${COMPANY.legalName} (marca localtraffic)`,
          `NIF: ${COMPANY.taxId}`,
          `Domicilio: ${address}`,
          `Teléfono: ${COMPANY.phone}`,
          `Email para protección de datos: ${COMPANY.privacyEmail}`,
        ],
        paragraphs: [
          "Esta política se ajusta al Reglamento (UE) 2016/679 (RGPD), a la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD) y a la Ley 34/2002 (LSSI-CE).",
        ],
      },
      {
        title: "Qué datos tratamos",
        paragraphs: [
          "Solo tratamos los datos que nos das tú. Si rellenas el formulario de demo: nombre, empresa o entidad, email, teléfono (opcional), la zona que te interesa y el servicio que te interesa. Si nos escribes por email o nos llamas, los datos que incluyas en tu mensaje. No tratamos categorías especiales de datos.",
          "Los datos que mostramos en la web sobre zonas, visitantes o consumo son agregados y anónimos y no permiten identificar a ninguna persona.",
        ],
      },
      {
        title: "Para qué los usamos",
        paragraphs: [
          "Para atender tu solicitud de demo o tu consulta, contactar contigo y, si lo pides, preparar una propuesta. No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos, y no los usamos para enviarte comunicaciones comerciales si no nos lo pides.",
        ],
      },
      {
        title: "Base legal",
        paragraphs: [
          "Tu consentimiento al enviarnos el formulario o escribirnos, y la aplicación de medidas precontractuales a petición tuya (artículo 6.1.a y 6.1.b del RGPD). Puedes retirar tu consentimiento en cualquier momento, sin que afecte a la licitud del tratamiento anterior.",
        ],
      },
      {
        title: "Cuánto tiempo los conservamos",
        paragraphs: ["Durante 24 meses desde tu último contacto con nosotros, o hasta que nos pidas que los suprimamos."],
      },
      {
        title: "Quién más accede a tus datos",
        paragraphs: [
          "No cedemos tus datos a terceros salvo obligación legal. Para que la web y el formulario funcionen, dos proveedores los tratan por cuenta nuestra, como encargados del tratamiento:",
        ],
        list: [
          "Vercel Inc., que aloja la web.",
          "Resend, que envía a nuestro buzón el correo con tu solicitud.",
        ],
      },
      {
        title: "Transferencias internacionales",
        paragraphs: [
          "Estos proveedores pueden tratar datos fuera del Espacio Económico Europeo, en Estados Unidos. En ese caso lo hacen con garantías adecuadas, como el Marco de Privacidad de Datos UE-EE. UU. o las cláusulas contractuales tipo aprobadas por la Comisión Europea.",
        ],
      },
      {
        title: "Tus derechos",
        paragraphs: [
          "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, y retirar tu consentimiento, escribiendo a " +
            COMPANY.privacyEmail +
            " o por correo postal a nuestro domicilio, con la referencia «RGPD-localtraffic.es». Indica qué derecho quieres ejercer y acredita tu identidad.",
          "Si consideras que no hemos tratado bien tus datos, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
      {
        title: "Seguridad",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos. La web funciona con conexión cifrada (HTTPS). Si se produjera una brecha de seguridad con riesgo alto para tus derechos, te lo comunicaríamos sin dilación.",
        ],
      },
      {
        title: "Menores",
        paragraphs: [
          "Solo los mayores de 14 años pueden darnos su consentimiento. Si eres menor de 14 años, necesitamos el consentimiento de tus padres o tutores.",
        ],
      },
      {
        title: "Cookies y almacenamiento local",
        paragraphs: [
          "Esta web no utiliza cookies propias ni de terceros para análisis ni publicidad. Las fuentes tipográficas se sirven desde nuestro propio dominio.",
          "Solo guardamos temporalmente en tu navegador (almacenamiento de sesión) la zona que escribes en la barra «¿Qué zona quieres analizar?», para rellenar con ella el formulario de demo. Se borra al usarla o al cerrar la pestaña. Al ser necesario para una función que tú pides, no requiere consentimiento.",
          "Si en el futuro añadimos herramientas de medición, te pediremos permiso antes de activarlas.",
        ],
      },
      {
        title: "Enlaces a otros sitios",
        paragraphs: [
          "La plataforma de clientes localtraffic.app, Instagram y LinkedIn tienen sus propias políticas de privacidad, de las que no somos responsables.",
        ],
      },
      {
        title: "Cambios en esta política",
        paragraphs: [
          "Podemos actualizar esta política para adaptarla a cambios legales o de la web. Publicaremos aquí cualquier cambio con su fecha.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    lede: "What data we collect on this website, what we use it for and how you can exercise your rights.",
    updated: "Last updated: 28 September 2026",
    note: "This is a translation for information purposes. The Spanish version prevails in case of discrepancy.",
    sections: [
      {
        title: "Data controller",
        list: [
          `${COMPANY.legalName} (localtraffic brand)`,
          `Tax ID (NIF): ${COMPANY.taxId}`,
          `Address: ${address}, Spain`,
          `Phone: +34 ${COMPANY.phone}`,
          `Data protection email: ${COMPANY.privacyEmail}`,
        ],
        paragraphs: [
          "This policy complies with Regulation (EU) 2016/679 (GDPR), Spanish Organic Law 3/2018 on Personal Data Protection and Digital Rights (LOPDGDD) and Spanish Law 34/2002 (LSSI-CE).",
        ],
      },
      {
        title: "What data we process",
        paragraphs: [
          "We only process the data you give us. If you fill in the demo form: name, company or organisation, email, phone (optional), the area you are interested in and the service you are interested in. If you email or call us, whatever data you include in your message. We do not process special categories of data.",
          "The data we show on the website about areas, visitors or spending is aggregated and anonymous and cannot identify anyone.",
        ],
      },
      {
        title: "What we use it for",
        paragraphs: [
          "To handle your demo request or enquiry, get in touch with you and, if you ask, prepare a proposal. We make no automated decisions and build no profiles with your data, and we don't use it to send you marketing unless you ask us to.",
        ],
      },
      {
        title: "Legal basis",
        paragraphs: [
          "Your consent when you send us the form or write to us, and taking steps at your request before entering into a contract (Article 6(1)(a) and 6(1)(b) GDPR). You can withdraw your consent at any time, without affecting the lawfulness of earlier processing.",
        ],
      },
      {
        title: "How long we keep it",
        paragraphs: ["For 24 months from your last contact with us, or until you ask us to delete it."],
      },
      {
        title: "Who else can access your data",
        paragraphs: [
          "We do not share your data with third parties unless required by law. To run the website and the form, two providers process it on our behalf as data processors:",
        ],
        list: ["Vercel Inc., which hosts the website.", "Resend, which delivers the email with your request to our inbox."],
      },
      {
        title: "International transfers",
        paragraphs: [
          "These providers may process data outside the European Economic Area, in the United States. When they do, it is under appropriate safeguards such as the EU–US Data Privacy Framework or the European Commission's standard contractual clauses.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "You can exercise your rights of access, rectification, erasure, objection, restriction of processing and portability, and withdraw your consent, by writing to " +
            COMPANY.privacyEmail +
            " or by post to our address, quoting «RGPD-localtraffic.es». Tell us which right you want to exercise and prove your identity.",
          "If you believe we have not handled your data properly, you can lodge a complaint with the Spanish Data Protection Agency (www.aepd.es).",
        ],
      },
      {
        title: "Security",
        paragraphs: [
          "We apply appropriate technical and organisational measures to protect your data. The website uses an encrypted connection (HTTPS). If a security breach posed a high risk to your rights, we would tell you without undue delay.",
        ],
      },
      {
        title: "Minors",
        paragraphs: [
          "Only people aged 14 or over can give us their consent. If you are under 14, we need the consent of your parents or guardians.",
        ],
      },
      {
        title: "Cookies and local storage",
        paragraphs: [
          "This website does not use its own or third-party cookies for analytics or advertising. Fonts are served from our own domain.",
          "We only store temporarily in your browser (session storage) the area you type into the «Which area do you want to analyse?» bar, to fill it into the demo form. It is deleted once used or when you close the tab. As it is needed for a feature you ask for, it does not require consent.",
          "If we add measurement tools in the future, we will ask for your permission before turning them on.",
        ],
      },
      {
        title: "Links to other sites",
        paragraphs: [
          "The localtraffic.app client platform, Instagram and LinkedIn have their own privacy policies, for which we are not responsible.",
        ],
      },
      {
        title: "Changes to this policy",
        paragraphs: [
          "We may update this policy to reflect legal changes or changes to the website. We will publish any change here with its date.",
        ],
      },
    ],
  },
};

export default function LegalPage({ kind, lang }: { kind: "legal" | "privacy"; lang: Lang }) {
  const doc = (kind === "legal" ? LEGAL : PRIVACY)[lang];
  return (
    <>
      <PageHero
        lang={lang}
        title={doc.title}
        lede={doc.lede}
        crumbs={[
          { href: route("home", lang), label: lang === "en" ? "Home" : "Inicio" },
          { href: route(kind, lang), label: doc.title },
        ]}
      />
      <section className="section legal">
        <div className="wrap legal__inner">
          <p className="legal__updated mono">{doc.updated}</p>
          {doc.note && <p className="legal__note">{doc.note}</p>}
          {doc.sections.map((s) => (
            <section key={s.title} className="legal__section">
              <h2>{s.title}</h2>
              {s.paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
