import type { en } from "./en";

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> };

export const es: DeepString<typeof en> = {
  navbar: {
    features: "Funciones",
    howItWorks: "C\u00f3mo Funciona",
    activities: "Actividades",
    download: "Descargar",
    downloadApp: "Descargar App",
  },

  hero: {
    badge: "Ya Disponible",
    titleLine1: "La Aventura Fitness",
    titleLine2: "de tu Gato",
    titleLine3: "Comienza\u00a0Aqu\u00ed",
    subtitle:
      "Registra sesiones de juego, descubre las actividades favoritas de tu gato y celebra cada logro. Porque un gato sano es un gato feliz.",
    downloadIos: "Descargar para iOS",
    androidComingSoon: "Android Pr\u00f3ximamente",
    activities: "Actividades",
    dayStreak: "D\u00edas Seguidos",
    heroAlt: "Adorable gato naranja saltando la cuerda \u2014 mascota de MyFitnessPaw",
  },

  features: {
    badge: "Funciones",
    title: "Todo lo que tu gato necesita",
    titleHighlight: "para mantenerse activo",
    trackTitle: "Registra Sesiones de Juego",
    trackDesc:
      "Graba sesiones en tiempo real con el temporizador o reg\u00edstralas manualmente. Elige entre 9 tipos de actividad \u00fanicos para gatos.",
    insightsTitle: "Estad\u00edsticas Inteligentes",
    insightsDesc:
      "Gr\u00e1ficos semanales, actividades favoritas, desgloses por gato y seguimiento de rachas. Observa c\u00f3mo se desarrolla la historia fitness de tu gato.",
    profilesTitle: "Perfiles de Gatos",
    profilesDesc:
      "Gestiona m\u00faltiples gatos con perfiles detallados \u2014 raza, peso, nivel de energ\u00eda y metas diarias personalizadas para cada amigo peludo.",
    safetyTitle: "Seguridad Primero",
    safetyDesc:
      "Alertas basadas en peso, l\u00edmites de tiempo autom\u00e1ticos y sugerencias de descanso mantienen el juego seguro. Porque nos importa el bienestar de tu gato.",
    altJumping: "Gato saltando la cuerda",
    altTreadmill: "Gato en cinta de correr",
    altDumbbells: "Gato levantando pesas",
    altAbs: "Gato haciendo abdominales",
  },

  howItWorks: {
    badge: "C\u00f3mo Funciona",
    title: "Tres pasos para un",
    titleHighlight: "gato m\u00e1s sano",
    step1Title: "A\u00f1ade tu Gato",
    step1Desc:
      "Crea un perfil con el nombre, raza, peso y nivel de energ\u00eda de tu gato. Establece metas de actividad diarias personalizadas.",
    step2Title: "Empieza a Jugar",
    step2Desc:
      "Presiona grabar en el temporizador en vivo o registra sesiones manualmente. Elige entre 9 tipos de actividad divertidos, desde juego con varita hasta escalada.",
    step3Title: "Sigue el Progreso",
    step3Desc:
      "Observa las estad\u00edsticas llegar \u2014 gr\u00e1ficos semanales, rachas, calor\u00edas quemadas y las formas favoritas de jugar de tu gato.",
  },

  activities: {
    badge: "Actividades",
    title: "9 formas de mantener a tu gato",
    titleHighlight: "en movimiento",
    subtitle:
      "Desde punteros l\u00e1ser hasta alimentadores de rompecabezas, registra cada tipo de sesi\u00f3n de juego que tu gato disfruta.",
    wandPlay: "Juego con Varita",
    chaseFetch: "Perseguir / Buscar",
    laserPointer: "Puntero L\u00e1ser",
    puzzleFeeder: "Comedero Puzzle",
    kickerToy: "Juguete Pateador",
    hideAmbush: "Esconder y Emboscar",
    climbing: "Escalada",
    catnip: "Hierba Gatera",
    freeRoam: "Paseo Libre",
  },

  stats: {
    title: "La confianza de los padres gatunos",
    titleHighlight: "en todas partes",
    sessionsTracked: "Sesiones Registradas",
    happyCats: "Gatos Felices",
    minutesOfPlay: "Minutos de Juego",
    caloriesBurned: "Calor\u00edas Quemadas",
  },

  downloadCta: {
    badge: "Descarga Gratuita",
    title: "\u00danete a la Manada",
    subtitle:
      "Descarga MyFitnessPaw hoy y comienza a rastrear el fitness de tu gato. Es gratis, divertido, y tu gato te lo agradecer\u00e1 con ronroneos extra.",
    downloadIos: "Descargar para iOS",
    androidComingSoon: "Android Pr\u00f3ximamente",
    imageAlt: "Dos gatos jugando juntos con estambre y pesas",
  },

  footer: {
    tagline:
      "La forma divertida de mantener a tu gato activo, sano y feliz.",
    privacyPolicy: "Pol\u00edtica de Privacidad",
    termsOfService: "T\u00e9rminos de Servicio",
    contact: "Contacto",
    copyright: "MyFitnessPaw. Todos los derechos reservados.",
    madeWith: "Hecho con \ud83d\udc3e para amantes de los gatos",
  },

  legal: {
    trackJourney: "Rastrea el fitness de tu gato",
    termsOfService: "T\u00e9rminos de Servicio",
    privacyPolicy: "Pol\u00edtica de Privacidad",
  },

  terms: {
    title: "T\u00e9rminos de Servicio",
    lastUpdated: "\u00daltima Actualizaci\u00f3n: 24 de febrero de 2026",
    s1Title: "1. Aceptaci\u00f3n de los T\u00e9rminos",
    s1Text: "Bienvenido a MyFitnessPaw. Al acceder o utilizar nuestra aplicaci\u00f3n y servicios, usted acepta estar sujeto a estos T\u00e9rminos de Servicio (\u201cT\u00e9rminos\u201d). Si no est\u00e1 de acuerdo con estos T\u00e9rminos, por favor no utilice nuestros servicios.",
    s2Title: "2. Cambios en los T\u00e9rminos",
    s2Text: "Podemos modificar estos T\u00e9rminos en cualquier momento. Le notificaremos de cualquier cambio publicando los nuevos T\u00e9rminos en esta p\u00e1gina y actualizando la fecha de \u201c\u00daltima Actualizaci\u00f3n\u201d. Su uso continuado del servicio despu\u00e9s de dichos cambios constituye su aceptaci\u00f3n de los nuevos T\u00e9rminos.",
    s3Title: "3. Pol\u00edtica de Privacidad",
    s3Text1: "Su uso de MyFitnessPaw tambi\u00e9n se rige por nuestra",
    s3Link: "Pol\u00edtica de Privacidad",
    s3Text2: ", la cual se incorpora a estos T\u00e9rminos por referencia.",
    s4Title: "4. Cuentas de Usuario",
    s4Text1:
      "4.1. Para utilizar ciertas funciones de nuestro servicio, debe crear una cuenta. Usted acepta proporcionar informaci\u00f3n precisa, actual y completa durante el proceso de registro.",
    s4Text2:
      "4.2. Usted es responsable de proteger la contrase\u00f1a que utiliza para acceder al servicio y de cualquier actividad o acci\u00f3n bajo su cuenta.",
    s4Text3:
      "4.3. Usted acepta no revelar su contrase\u00f1a a terceros. Debe notificarnos inmediatamente al tener conocimiento de cualquier violaci\u00f3n de seguridad o uso no autorizado de su cuenta.",
    s5Title: "5. Contenido del Usuario",
    s5Text1:
      "5.1. Nuestro servicio le permite publicar, vincular, almacenar, compartir y poner a disposici\u00f3n cierta informaci\u00f3n, texto, gr\u00e1ficos, videos u otro material (\u201cContenido\u201d). Usted es responsable del Contenido que publica, incluyendo su legalidad, fiabilidad e idoneidad.",
    s5Text2:
      "5.2. Al publicar Contenido, nos otorga el derecho de usar, modificar, ejecutar p\u00fablicamente, mostrar p\u00fablicamente, reproducir y distribuir dicho Contenido en y a trav\u00e9s de nuestro servicio. Usted conserva todos sus derechos sobre cualquier Contenido que env\u00ede, publique o muestre y es responsable de proteger esos derechos.",
    s5Text3:
      "5.3. Usted declara y garantiza que: (i) el Contenido es suyo o tiene derecho a usarlo y otorgarnos los derechos y licencia seg\u00fan lo dispuesto en estos T\u00e9rminos, y (ii) la publicaci\u00f3n de su Contenido no viola los derechos de privacidad, publicidad, derechos de autor, derechos contractuales ni ning\u00fan otro derecho de cualquier persona.",
    s6Title: "6. Usos Prohibidos",
    s6Intro: "Usted acepta no utilizar el servicio:",
    s6Item1:
      "De cualquier manera que viole cualquier ley o regulaci\u00f3n nacional o internacional aplicable.",
    s6Item2:
      "Para transmitir o procurar el env\u00edo de cualquier material publicitario o promocional, incluyendo cualquier \u201ccorreo basura\u201d, \u201ccadena de correo\u201d, \u201cspam\u201d o cualquier otra solicitud similar.",
    s6Item3:
      "Para hacerse pasar o intentar hacerse pasar por MyFitnessPaw, un empleado de MyFitnessPaw, otro usuario o cualquier otra persona o entidad.",
    s6Item4:
      "De cualquier manera que infrinja los derechos de otros, o de cualquier manera que sea ilegal, amenazante, fraudulenta o da\u00f1ina, o en relaci\u00f3n con cualquier prop\u00f3sito o actividad il\u00edcita, ilegal, fraudulenta o da\u00f1ina.",
    s7Title: "7. Propiedad Intelectual",
    s7Text:
      "El servicio y su contenido original (excluyendo el Contenido proporcionado por los usuarios), funciones y funcionalidad son y seguir\u00e1n siendo propiedad exclusiva de MyFitnessPaw y sus licenciantes. El servicio est\u00e1 protegido por derechos de autor, marcas registradas y otras leyes. Nuestras marcas registradas y imagen comercial no pueden usarse en relaci\u00f3n con ning\u00fan producto o servicio sin el consentimiento previo por escrito de MyFitnessPaw.",
    s8Title: "8. Terminaci\u00f3n",
    s8Text:
      "Podemos terminar o suspender su cuenta inmediatamente, sin previo aviso ni responsabilidad, por cualquier motivo, incluyendo sin limitaci\u00f3n si usted incumple los T\u00e9rminos. Tras la terminaci\u00f3n, su derecho a usar el servicio cesar\u00e1 inmediatamente.",
    s9Title: "9. Limitaci\u00f3n de Responsabilidad",
    s9Text:
      "En ning\u00fan caso MyFitnessPaw, ni sus directores, empleados, socios, agentes, proveedores o afiliados, ser\u00e1n responsables de da\u00f1os indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo sin limitaci\u00f3n, p\u00e9rdida de beneficios, datos, uso, buena voluntad u otras p\u00e9rdidas intangibles, resultantes de su acceso o uso o incapacidad de acceder o usar el servicio.",
    s10Title: "10. Descargo de Responsabilidad",
    s10Text:
      "Su uso del servicio es bajo su propio riesgo. El servicio se proporciona \u201cTAL CUAL\u201d y \u201cSEG\u00daN DISPONIBILIDAD\u201d. El servicio se proporciona sin garant\u00edas de ning\u00fan tipo, ya sean expresas o impl\u00edcitas, incluyendo, pero no limitado a, garant\u00edas impl\u00edcitas de comerciabilidad, idoneidad para un prop\u00f3sito particular, no infracci\u00f3n o curso de ejecuci\u00f3n.",
    s11Title: "11. Ley Aplicable",
    s11Text:
      "Estos T\u00e9rminos se regir\u00e1n e interpretar\u00e1n de acuerdo con las leyes de Florida, Estados Unidos, sin tener en cuenta sus disposiciones sobre conflictos de leyes.",
    s12Title: "12. Cambios en el Servicio",
    s12Text:
      "Nos reservamos el derecho de retirar o modificar nuestro servicio, y cualquier servicio o material que proporcionemos a trav\u00e9s del servicio, a nuestra sola discreci\u00f3n sin previo aviso. No seremos responsables si por cualquier raz\u00f3n todo o parte del servicio no est\u00e1 disponible en cualquier momento o por cualquier per\u00edodo.",
    s13Title: "13. Cont\u00e1ctenos",
    s13Text: "Si tiene alguna pregunta sobre estos T\u00e9rminos, cont\u00e1ctenos en",
  },

  privacy: {
    title: "Pol\u00edtica de Privacidad",
    lastUpdated: "\u00daltima Actualizaci\u00f3n: 24 de febrero de 2026",
    intro1:
      "Esta Pol\u00edtica de Privacidad describe nuestras pol\u00edticas y procedimientos sobre la recolecci\u00f3n, uso y divulgaci\u00f3n de su informaci\u00f3n cuando utiliza el Servicio y le informa sobre sus derechos de privacidad y c\u00f3mo la ley le protege.",
    intro2:
      "Utilizamos sus Datos Personales para proporcionar y mejorar el Servicio. Al usar el Servicio, usted acepta la recolecci\u00f3n y uso de informaci\u00f3n de acuerdo con esta Pol\u00edtica de Privacidad.",

    interpretationTitle: "Interpretaci\u00f3n y Definiciones",
    interpretationSubtitle: "Interpretaci\u00f3n",
    interpretationText:
      "Las palabras cuya letra inicial est\u00e1 en may\u00fascula tienen significados definidos bajo las siguientes condiciones. Las siguientes definiciones tendr\u00e1n el mismo significado independientemente de si aparecen en singular o en plural.",
    definitionsSubtitle: "Definiciones",
    definitionsIntro: "A los efectos de esta Pol\u00edtica de Privacidad:",
    defAccount:
      "significa una cuenta \u00fanica creada para que Usted acceda a nuestro Servicio o partes de nuestro Servicio.",
    defAffiliate:
      "significa una entidad que controla, es controlada por o est\u00e1 bajo control com\u00fan con una parte, donde \u201ccontrol\u201d significa la propiedad del 50% o m\u00e1s de las acciones, participaci\u00f3n accionaria u otros valores con derecho a voto para la elecci\u00f3n de directores u otra autoridad de gesti\u00f3n.",
    defApplication:
      "se refiere a MyFitnessPaw, el programa de software proporcionado por la Compa\u00f1\u00eda.",
    defCompany:
      "(referida como \u201cla Compa\u00f1\u00eda\u201d, \u201cNosotros\u201d, \u201cNos\u201d o \u201cNuestro\u201d en este Acuerdo) se refiere a MyFitnessPaw.",
    defCountry: "se refiere a: Florida, Estados Unidos",
    defDevice:
      "significa cualquier dispositivo que pueda acceder al Servicio, como una computadora, un tel\u00e9fono celular o una tableta digital.",
    defPersonalData:
      "es cualquier informaci\u00f3n que se relaciona con un individuo identificado o identificable.",
    defService: "se refiere a la Aplicaci\u00f3n.",
    defServiceProvider:
      "significa cualquier persona f\u00edsica o jur\u00eddica que procesa los datos en nombre de la Compa\u00f1\u00eda. Se refiere a empresas o individuos terceros empleados por la Compa\u00f1\u00eda para facilitar el Servicio, proporcionar el Servicio en nombre de la Compa\u00f1\u00eda, realizar servicios relacionados con el Servicio o ayudar a la Compa\u00f1\u00eda a analizar c\u00f3mo se utiliza el Servicio.",
    defUsageData:
      "se refiere a datos recopilados autom\u00e1ticamente, ya sea generados por el uso del Servicio o por la infraestructura del Servicio en s\u00ed (por ejemplo, la duraci\u00f3n de una visita a una p\u00e1gina).",
    defYou:
      "significa el individuo que accede o utiliza el Servicio, o la empresa u otra entidad legal en nombre de la cual dicho individuo accede o utiliza el Servicio, seg\u00fan corresponda.",

    collectingTitle: "Recolecci\u00f3n y Uso de sus Datos Personales",
    typesCollectedSubtitle: "Tipos de Datos Recopilados",
    personalDataSubtitle: "Datos Personales",
    personalDataText:
      "Al utilizar Nuestro Servicio, podemos pedirle que nos proporcione cierta informaci\u00f3n de identificaci\u00f3n personal que puede usarse para contactarlo o identificarlo. La informaci\u00f3n de identificaci\u00f3n personal puede incluir, pero no se limita a:",
    personalDataItem1: "Direcci\u00f3n de correo electr\u00f3nico",
    personalDataItem2: "Datos de Uso",

    usageDataSubtitle: "Datos de Uso",
    usageDataText1:
      "Los Datos de Uso se recopilan autom\u00e1ticamente al utilizar el Servicio.",
    usageDataText2:
      "Los Datos de Uso pueden incluir informaci\u00f3n como la direcci\u00f3n de Protocolo de Internet de su Dispositivo (por ejemplo, direcci\u00f3n IP), tipo de navegador, versi\u00f3n del navegador, las p\u00e1ginas de nuestro Servicio que visita, la fecha y hora de su visita, el tiempo dedicado a esas p\u00e1ginas, identificadores \u00fanicos de dispositivo y otros datos de diagn\u00f3stico.",
    usageDataText3:
      "Cuando accede al Servicio a trav\u00e9s de un dispositivo m\u00f3vil, podemos recopilar cierta informaci\u00f3n autom\u00e1ticamente, incluyendo, pero no limitado a, el tipo de dispositivo m\u00f3vil que utiliza, el ID \u00fanico de su dispositivo m\u00f3vil, la direcci\u00f3n IP de su dispositivo m\u00f3vil, su sistema operativo m\u00f3vil, el tipo de navegador de Internet m\u00f3vil que utiliza, identificadores \u00fanicos de dispositivo y otros datos de diagn\u00f3stico.",
    usageDataText4:
      "Tambi\u00e9n podemos recopilar informaci\u00f3n que su navegador env\u00eda cada vez que visita nuestro Servicio o cuando accede al Servicio a trav\u00e9s de un dispositivo m\u00f3vil.",

    appInfoSubtitle: "Informaci\u00f3n Recopilada al Usar la Aplicaci\u00f3n",
    appInfoText1:
      "Al usar Nuestra Aplicaci\u00f3n, para proporcionar funciones de Nuestra Aplicaci\u00f3n, podemos recopilar, con su permiso previo:",
    appInfoItem1:
      "Im\u00e1genes y otra informaci\u00f3n de la c\u00e1mara y biblioteca de fotos de su Dispositivo",
    appInfoText2:
      "Utilizamos esta informaci\u00f3n para proporcionar funciones de Nuestro Servicio, para mejorar y personalizar Nuestro Servicio. La informaci\u00f3n puede cargarse en los servidores de la Compa\u00f1\u00eda y/o en el servidor de un Proveedor de Servicios o puede simplemente almacenarse en su dispositivo.",
    appInfoText3:
      "Puede habilitar o deshabilitar el acceso a esta informaci\u00f3n en cualquier momento, a trav\u00e9s de la configuraci\u00f3n de su Dispositivo.",

    useTitle: "Uso de sus Datos Personales",
    useIntro:
      "La Compa\u00f1\u00eda puede usar Datos Personales para los siguientes prop\u00f3sitos:",
    useProvide:
      "incluyendo el monitoreo del uso de nuestro Servicio.",
    useProvideLabel: "Para proporcionar y mantener nuestro Servicio",
    useManage:
      "para gestionar Su registro como usuario del Servicio. Los Datos Personales que proporcione pueden darle acceso a diferentes funcionalidades del Servicio disponibles para Usted como usuario registrado.",
    useManageLabel: "Para gestionar Su Cuenta",
    useContract:
      "el desarrollo, cumplimiento y ejecuci\u00f3n del contrato de compra de los productos, art\u00edculos o servicios que haya adquirido o de cualquier otro contrato con Nosotros a trav\u00e9s del Servicio.",
    useContractLabel: "Para la ejecuci\u00f3n de un contrato",
    useContact:
      "Para contactarle por correo electr\u00f3nico, llamadas telef\u00f3nicas, SMS u otras formas equivalentes de comunicaci\u00f3n electr\u00f3nica, como notificaciones push de una aplicaci\u00f3n m\u00f3vil sobre actualizaciones o comunicaciones informativas relacionadas con las funcionalidades, productos o servicios contratados, incluidas las actualizaciones de seguridad, cuando sea necesario o razonable para su implementaci\u00f3n.",
    useContactLabel: "Para contactarle",
    useProvideInfo:
      "con noticias, ofertas especiales e informaci\u00f3n general sobre otros bienes, servicios y eventos que ofrecemos que sean similares a los que ya ha comprado o consultado, a menos que haya optado por no recibir dicha informaci\u00f3n.",
    useProvideInfoLabel: "Para proporcionarle",
    useRequests: "Para atender y gestionar Sus solicitudes hacia Nosotros.",
    useRequestsLabel: "Para gestionar Sus solicitudes",
    useTransfers:
      "Podemos usar Su informaci\u00f3n para evaluar o llevar a cabo una fusi\u00f3n, desinversi\u00f3n, reestructuraci\u00f3n, reorganizaci\u00f3n, disoluci\u00f3n u otra venta o transferencia de algunos o todos Nuestros activos, ya sea como empresa en funcionamiento o como parte de un procedimiento de quiebra, liquidaci\u00f3n o similar, en el que los Datos Personales que poseemos sobre los usuarios de nuestro Servicio se encuentran entre los activos transferidos.",
    useTransfersLabel: "Para transferencias comerciales",
    useOther:
      "Podemos usar Su informaci\u00f3n para otros fines, como an\u00e1lisis de datos, identificaci\u00f3n de tendencias de uso, determinaci\u00f3n de la efectividad de nuestras campa\u00f1as promocionales y para evaluar y mejorar nuestro Servicio, productos, servicios, marketing y su experiencia.",
    useOtherLabel: "Para otros fines",

    sharingTitle: "Compartir Su Informaci\u00f3n Personal",
    sharingIntro:
      "Podemos compartir Su informaci\u00f3n personal en las siguientes situaciones:",
    shareProviders:
      "Podemos compartir Su informaci\u00f3n personal con Proveedores de Servicios para monitorear y analizar el uso de nuestro Servicio, para contactarle.",
    shareProvidersLabel: "Con Proveedores de Servicios",
    shareTransfers:
      "Podemos compartir o transferir Su informaci\u00f3n personal en relaci\u00f3n con, o durante las negociaciones de, cualquier fusi\u00f3n, venta de activos de la Compa\u00f1\u00eda, financiamiento o adquisici\u00f3n de todo o parte de Nuestro negocio por otra empresa.",
    shareTransfersLabel: "Para transferencias comerciales",
    shareAffiliates:
      "Podemos compartir Su informaci\u00f3n con Nuestras afiliadas, en cuyo caso exigiremos que dichas afiliadas respeten esta Pol\u00edtica de Privacidad. Las afiliadas incluyen Nuestra empresa matriz y cualquier otra subsidiaria, socios de empresas conjuntas u otras empresas que controlemos o que est\u00e9n bajo control com\u00fan con Nosotros.",
    shareAffiliatesLabel: "Con Afiliadas",
    sharePartners:
      "Podemos compartir Su informaci\u00f3n con Nuestros socios comerciales para ofrecerle ciertos productos, servicios o promociones.",
    sharePartnersLabel: "Con socios comerciales",
    shareUsers:
      "cuando comparte informaci\u00f3n personal o interact\u00faa en las \u00e1reas p\u00fablicas con otros usuarios, dicha informaci\u00f3n puede ser vista por todos los usuarios y puede distribuirse p\u00fablicamente fuera.",
    shareUsersLabel: "Con otros usuarios",
    shareConsent:
      "Podemos divulgar Su informaci\u00f3n personal para cualquier otro prop\u00f3sito con Su consentimiento.",
    shareConsentLabel: "Con Su consentimiento",

    retentionTitle: "Retenci\u00f3n de sus Datos Personales",
    retentionText1:
      "La Compa\u00f1\u00eda retendr\u00e1 Sus Datos Personales solo durante el tiempo que sea necesario para los fines establecidos en esta Pol\u00edtica de Privacidad. Retendremos y usaremos Sus Datos Personales en la medida necesaria para cumplir con nuestras obligaciones legales (por ejemplo, si estamos obligados a retener sus datos para cumplir con las leyes aplicables), resolver disputas y hacer cumplir nuestros acuerdos y pol\u00edticas legales.",
    retentionText2:
      "La Compa\u00f1\u00eda tambi\u00e9n retendr\u00e1 los Datos de Uso para fines de an\u00e1lisis interno. Los Datos de Uso generalmente se retienen por un per\u00edodo de tiempo m\u00e1s corto, excepto cuando estos datos se utilizan para fortalecer la seguridad o mejorar la funcionalidad de Nuestro Servicio, o estamos legalmente obligados a retener estos datos por per\u00edodos de tiempo m\u00e1s largos.",

    transferTitle: "Transferencia de sus Datos Personales",
    transferText1:
      "Su informaci\u00f3n, incluidos los Datos Personales, se procesa en las oficinas operativas de la Compa\u00f1\u00eda y en cualquier otro lugar donde se encuentren las partes involucradas en el procesamiento. Esto significa que esta informaci\u00f3n puede transferirse a \u2014 y mantenerse en \u2014 computadoras ubicadas fuera de su estado, provincia, pa\u00eds u otra jurisdicci\u00f3n gubernamental donde las leyes de protecci\u00f3n de datos pueden diferir de las de su jurisdicci\u00f3n.",
    transferText2:
      "Su consentimiento a esta Pol\u00edtica de Privacidad seguido de Su env\u00edo de dicha informaci\u00f3n representa Su acuerdo con esa transferencia.",
    transferText3:
      "La Compa\u00f1\u00eda tomar\u00e1 todas las medidas razonablemente necesarias para garantizar que Sus datos se traten de forma segura y de acuerdo con esta Pol\u00edtica de Privacidad y no se realizar\u00e1 ninguna transferencia de Sus Datos Personales a una organizaci\u00f3n o un pa\u00eds a menos que existan controles adecuados, incluida la seguridad de Sus datos y otra informaci\u00f3n personal.",

    deleteTitle: "Eliminar sus Datos Personales",
    deleteText1:
      "Usted tiene derecho a eliminar o solicitar que le ayudemos a eliminar los Datos Personales que hemos recopilado sobre Usted.",
    deleteText2:
      "Nuestro Servicio puede darle la capacidad de eliminar cierta informaci\u00f3n sobre Usted dentro del Servicio.",
    deleteText3:
      "Puede actualizar, enmendar o eliminar Su informaci\u00f3n en cualquier momento iniciando sesi\u00f3n en Su Cuenta, si tiene una, y visitando la secci\u00f3n de configuraci\u00f3n de cuenta que le permite gestionar Su informaci\u00f3n personal. Tambi\u00e9n puede contactarnos para solicitar acceso, correcci\u00f3n o eliminaci\u00f3n de cualquier informaci\u00f3n personal que nos haya proporcionado.",
    deleteText4:
      "Sin embargo, tenga en cuenta que podemos necesitar retener cierta informaci\u00f3n cuando tengamos una obligaci\u00f3n legal o base leg\u00edtima para hacerlo.",

    disclosureTitle: "Divulgaci\u00f3n de sus Datos Personales",
    businessTransactionsSubtitle: "Transacciones Comerciales",
    businessTransactionsText:
      "Si la Compa\u00f1\u00eda est\u00e1 involucrada en una fusi\u00f3n, adquisici\u00f3n o venta de activos, Sus Datos Personales pueden ser transferidos. Le proporcionaremos un aviso antes de que Sus Datos Personales sean transferidos y queden sujetos a una Pol\u00edtica de Privacidad diferente.",
    lawEnforcementSubtitle: "Cumplimiento de la ley",
    lawEnforcementText:
      "Bajo ciertas circunstancias, la Compa\u00f1\u00eda puede estar obligada a divulgar Sus Datos Personales si as\u00ed lo requiere la ley o en respuesta a solicitudes v\u00e1lidas de autoridades p\u00fablicas (por ejemplo, un tribunal o una agencia gubernamental).",
    otherLegalSubtitle: "Otros requisitos legales",
    otherLegalIntro:
      "La Compa\u00f1\u00eda puede divulgar Sus Datos Personales de buena fe creyendo que dicha acci\u00f3n es necesaria para:",
    otherLegalItem1: "Cumplir con una obligaci\u00f3n legal",
    otherLegalItem2:
      "Proteger y defender los derechos o propiedad de la Compa\u00f1\u00eda",
    otherLegalItem3:
      "Prevenir o investigar posibles irregularidades en relaci\u00f3n con el Servicio",
    otherLegalItem4:
      "Proteger la seguridad personal de los Usuarios del Servicio o del p\u00fablico",
    otherLegalItem5: "Proteger contra responsabilidad legal",

    securityTitle: "Seguridad de sus Datos Personales",
    securityText:
      "La seguridad de Sus Datos Personales es importante para Nosotros, pero recuerde que ning\u00fan m\u00e9todo de transmisi\u00f3n por Internet o m\u00e9todo de almacenamiento electr\u00f3nico es 100% seguro. Si bien nos esforzamos por utilizar medios comercialmente aceptables para proteger Sus Datos Personales, no podemos garantizar su seguridad absoluta.",

    childrenTitle: "Privacidad de los Ni\u00f1os",
    childrenText1:
      "Nuestro Servicio no est\u00e1 dirigido a menores de 13 a\u00f1os. No recopilamos deliberadamente informaci\u00f3n de identificaci\u00f3n personal de menores de 13 a\u00f1os. Si Usted es padre o tutor y sabe que Su hijo nos ha proporcionado Datos Personales, cont\u00e1ctenos. Si nos damos cuenta de que hemos recopilado Datos Personales de menores de 13 a\u00f1os sin verificaci\u00f3n del consentimiento de los padres, tomamos medidas para eliminar esa informaci\u00f3n de Nuestros servidores.",
    childrenText2:
      "Si necesitamos basarnos en el consentimiento como base legal para procesar Su informaci\u00f3n y Su pa\u00eds requiere el consentimiento de un padre, podemos requerir el consentimiento de Sus padres antes de recopilar y usar esa informaci\u00f3n.",

    linksTitle: "Enlaces a Otros Sitios Web",
    linksText1:
      "Nuestro Servicio puede contener enlaces a otros sitios web que no son operados por Nosotros. Si hace clic en un enlace de terceros, ser\u00e1 dirigido al sitio de ese tercero. Le recomendamos encarecidamente que revise la Pol\u00edtica de Privacidad de cada sitio que visite.",
    linksText2:
      "No tenemos control sobre y no asumimos responsabilidad por el contenido, pol\u00edticas de privacidad o pr\u00e1cticas de sitios o servicios de terceros.",

    changesToPolicyTitle: "Cambios en esta Pol\u00edtica de Privacidad",
    changesToPolicyText1:
      "Podemos actualizar Nuestra Pol\u00edtica de Privacidad de vez en cuando. Le notificaremos de cualquier cambio publicando la nueva Pol\u00edtica de Privacidad en esta p\u00e1gina.",
    changesToPolicyText2:
      "Le informaremos por correo electr\u00f3nico y/o un aviso destacado en Nuestro Servicio, antes de que el cambio entre en vigencia y actualizaremos la fecha de \u201c\u00daltima actualizaci\u00f3n\u201d en la parte superior de esta Pol\u00edtica de Privacidad.",
    changesToPolicyText3:
      "Se le aconseja revisar esta Pol\u00edtica de Privacidad peri\u00f3dicamente para cualquier cambio. Los cambios en esta Pol\u00edtica de Privacidad son efectivos cuando se publican en esta p\u00e1gina.",

    contactTitle: "Cont\u00e1ctenos",
    contactText:
      "Si tiene alguna pregunta sobre esta Pol\u00edtica de Privacidad, puede contactarnos:",
    contactByEmail: "Por correo electr\u00f3nico:",
  },
};
