export type BriefingLink = {
  id: string;
  label: string;
  url: string;
};

export type BriefingEntry =
  | { id: string; label: string; kind: 'link'; url: string }
  | { id: string; label: string; kind: 'submenu'; children: BriefingLink[] };

export const AWOS_LINKS: BriefingLink[] = [
  { id: 'awos-skmd', label: 'AWOS - SKMD', url: 'http://leadscabecera.aerocivil.gov.co:1103/MainScreen.htm' },
  { id: 'awos-skar', label: 'AWOS - SKAR', url: 'http://leadscabecera.aerocivil.gov.co:167/MainScreen.htm' },
  { id: 'awos-skbg', label: 'AWOS - SKBG', url: 'http://leadscabecera.aerocivil.gov.co:24103/screens/WEB_Mainscreen' },
  { id: 'awos-skbq', label: 'AWOS - SKBQ', url: 'http://leadscabecera.aerocivil.gov.co:3028/MainScreen.htm' },
  { id: 'awos-skcg', label: 'AWOS - SKCG', url: 'http://leadscabecera.aerocivil.gov.co:3115/MainScreen.htm' },
  { id: 'awos-skcl', label: 'AWOS - SKCL', url: 'http://leadscabecera.aerocivil.gov.co:1529/MainScreen.htm' },
  { id: 'awos-skcz', label: 'AWOS - SKCZ', url: 'http://leadscabecera.aerocivil.gov.co:9104/screens/WEB_Mainscreen' },
  { id: 'awos-skej', label: 'AWOS - SKEJ', url: 'http://leadscabecera.aerocivil.gov.co:2211/MainScreen.htm' },
  { id: 'awos-skgi', label: 'AWOS - SKGI', url: 'http://leadscabecera.aerocivil.gov.co:5155/screens/WEB_Mainscreen' },
  { id: 'awos-skgo', label: 'AWOS - SKGO', url: 'http://leadscabecera.aerocivil.gov.co:10282/screens/WEB_Mainscreen' },
  { id: 'awos-skib', label: 'AWOS - SKIB', url: 'http://leadscabecera.aerocivil.gov.co:4200/MainScreen.htm' },
  { id: 'awos-skmr', label: 'AWOS - SKMR', url: 'http://leadscabecera.aerocivil.gov.co:1212/MainScreen.htm' },
  { id: 'awos-skmz', label: 'AWOS - SKMZ', url: 'http://leadscabecera.aerocivil.gov.co:9918/MainScreen.htm' },
  { id: 'awos-sknv', label: 'AWOS - SKNV', url: 'http://leadscabecera.aerocivil.gov.co:719/MainScreen.htm' },
  { id: 'awos-skpe', label: 'AWOS - SKPE', url: 'http://leadscabecera.aerocivil.gov.co:1713/MainScreen.htm' },
  { id: 'awos-skrg', label: 'AWOS - SKRG', url: 'http://leadscabecera.aerocivil.gov.co:10215/screens/WEB_Mainscreen' },
  { id: 'awos-sksm', label: 'AWOS - SKSM', url: 'http://leadscabecera.aerocivil.gov.co:3312/MainScreen.htm' },
  { id: 'awos-sktl', label: 'AWOS - SKTL', url: 'http://leadscabecera.aerocivil.gov.co:416/screens/WEB_Mainscreen' },
  { id: 'awos-skqu', label: 'AWOS - SKQU', url: 'http://leadscabecera.aerocivil.gov.co:9452/screens/WEB_Mainscreen' },
  { id: 'awos-skbo', label: 'AWOS – SKBO', url: 'http://leadscabecera.aerocivil.gov.co/screens/WEB_Mainscreen' },
];

export const BRIEFING_TOOL_ENTRIES: BriefingEntry[] = [
  {
    id: 'efpl',
    label: 'EFPL - AERONÁUTICA CIVIL',
    kind: 'link',
    url: 'https://e-fpl.aerocivil.gov.co/PVA/faces/principal.jspx?_adf.ctrl-state=14ffnb887x_1&_afrLoop=13978490801382060&_afrWindowMode=0&_afrWindowId=null',
  },
  {
    id: 'notams-a',
    label: 'NOTAMS A - ORDENADO AERÓDROMO',
    kind: 'link',
    url: 'https://www.aerocivil.gov.co/loader.php?lServicio=Tools2&lTipo=descargas&lFuncion=visorpdf&file=https%3A%2F%2Fwww.aerocivil.gov.co%2Floader.php%3FlServicio%3DTools2%26lTipo%3Ddescargas%26lFuncion%3DexposeDocument%26idFile%3D11947%26tmp%3D09b7a3df377b78a7ee23f5bb95d76544%26urlDeleteFunction%3Dhttps%253A%252F%252Fwww.aerocivil.gov.co%252Floader.php%253FlServicio%253DTools2%2526lTipo%253Ddescargas%2526lFuncion%253DdeleteTemporalFile%2526tmp%253D09b7a3df377b78a7ee23f5bb95d76544&pdf=1&tmp=09b7a3df377b78a7ee23f5bb95d76544&fileItem=12062',
  },
  {
    id: 'notams-b',
    label: 'NOTAMS B - ORDENADO AERÓDROMO',
    kind: 'link',
    url: 'https://www.aerocivil.gov.co/loader.php?lServicio=Tools2&lTipo=descargas&lFuncion=visorpdf&file=https%3A%2F%2Fwww.aerocivil.gov.co%2Floader.php%3FlServicio%3DTools2%26lTipo%3Ddescargas%26lFuncion%3DexposeDocument%26idFile%3D11947%26tmp%3D09b7a3df377b78a7ee23f5bb95d76544%26urlDeleteFunction%3Dhttps%253A%252F%252Fwww.aerocivil.gov.co%252Floader.php%253FlServicio%253DTools2%2526lTipo%253Ddescargas%2526lFuncion%253DdeleteTemporalFile%2526tmp%253D09b7a3df377b78a7ee23f5bb95d76544&pdf=1&tmp=09b7a3df377b78a7ee23f5bb95d76544&fileItem=12064',
  },
  {
    id: 'notams-cd',
    label: 'NOTAMS C / D - ORDENADO AERÓDROMO',
    kind: 'link',
    url: 'https://www.aerocivil.gov.co/loader.php?lServicio=Tools2&lTipo=descargas&lFuncion=visorpdf&file=https%3A%2F%2Fwww.aerocivil.gov.co%2Floader.php%3FlServicio%3DTools2%26lTipo%3Ddescargas%26lFuncion%3DexposeDocument%26idFile%3D11947%26tmp%3D09b7a3df377b78a7ee23f5bb95d76544%26urlDeleteFunction%3Dhttps%253A%252F%252Fwww.aerocivil.gov.co%252Floader.php%253FlServicio%253DTools2%2526lTipo%253Ddescargas%2526lFuncion%253DdeleteTemporalFile%2526tmp%253D09b7a3df377b78a7ee23f5bb95d76544&pdf=1&tmp=09b7a3df377b78a7ee23f5bb95d76544&fileItem=12066',
  },
  {
    id: 'metar',
    label: 'METAR',
    kind: 'link',
    url: 'http://meteorologia.aerocivil.gov.co/wxwatch/table?list_id=1',
  },
  {
    id: 'satelite',
    label: 'IMAGEN DE SATÉLITE – AEROCIVIL',
    kind: 'link',
    url: 'http://meteorologia.aerocivil.gov.co/satellite_image',
  },
  {
    id: 'simfac',
    label: 'SIMFAC - METEOROLOGÍA',
    kind: 'link',
    url: 'https://simfac.fac.mil.co/modules_simfac/tiempoactual/TiempoActualv3.php',
  },
  {
    id: 'skmd-siata',
    label: 'SKMD - SIATA – METEOROLOGÍA',
    kind: 'link',
    url: 'https://siata.gov.co/siata_nuevo/',
  },
  {
    id: 'windy',
    label: 'WINDY – METEOROLOGÍA',
    kind: 'link',
    url: 'https://www.windy.com/',
  },
  {
    id: 'awos',
    label: 'AWOS – METEOROLOGÍA',
    kind: 'submenu',
    children: AWOS_LINKS,
  },
  {
    id: 'taf',
    label: 'TAF – METEOROLOGÍA',
    kind: 'link',
    url: 'http://meteorologia.aerocivil.gov.co/wxwatch/taf?list_id=1',
  },
  {
    id: 'windy-camaras',
    label: 'WINDY - CÁMARAS – MEDELLÍN',
    kind: 'link',
    url: 'https://escueladeaviacionflying.edu.co/briefing-tool/windy-camaras-medellin/',
  },
  {
    id: 'rac',
    label: 'RAC - AEROCIVIL – CONSULTA',
    kind: 'link',
    url: 'https://www.aerocivil.gov.co/normatividad/13-reglamentos-aeronauticos-de-colombia-rac',
  },
  {
    id: 'comms',
    label: 'COMMS - FRECUENCIAS – ATCOLOMBIA',
    kind: 'link',
    url: 'https://www.atcolombia.co/',
  },
];
