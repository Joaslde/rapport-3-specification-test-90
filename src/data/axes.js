/*
  LES 3 AXES ET LES 15 SOUS-DIMENSIONS
  Source : rapport-3-specification-test-90-jours.md §5
  Ne pas modifier sans validation du manager.
*/

export const AXES = [
  {
    id: 'A1',
    numero: 1,
    titre: "L'entreprise sans vous",
    sousTitre: 'dépendance opérationnelle',
    poids: 0.4,
    maxBrut: 36,
  },
  {
    id: 'A2',
    numero: 2,
    titre: 'Ceux qui vous entourent',
    sousTitre: "solidité de l'entourage",
    poids: 0.35,
    maxBrut: 32,
  },
  {
    id: 'A3',
    numero: 3,
    titre: 'Vous',
    sousTitre: 'état du dirigeant',
    poids: 0.25,
    maxBrut: 24,
  },
]

export const SOUS_DIMENSIONS = [
  { id: '1.1', axe: 'A1', libelle: 'Concentration décisionnelle' },
  { id: '1.2', axe: 'A1', libelle: 'Concentration relationnelle' },
  { id: '1.3', axe: 'A1', libelle: 'Codification et procédures' },
  { id: '1.4', axe: 'A1', libelle: 'Trésorerie et pouvoir de signature' },
  { id: '1.5', axe: 'A1', libelle: 'Résistance à la rupture' },

  { id: '2.1', axe: 'A2', libelle: "Existence d'un second" },
  { id: '2.2', axe: 'A2', libelle: "Qualité de l'équipe de direction" },
  { id: '2.3', axe: 'A2', libelle: 'Contre-pouvoir et accès à la vérité' },
  { id: '2.4', axe: 'A2', libelle: 'Frontière famille / entreprise' },
  { id: '2.5', axe: 'A2', libelle: 'Conseil et appui externes' },

  { id: '3.1', axe: 'A3', libelle: 'Charge et récupération' },
  { id: '3.2', axe: 'A3', libelle: 'Solitude décisionnelle' },
  { id: '3.3', axe: 'A3', libelle: 'Signaux physiques' },
  { id: '3.4', axe: 'A3', libelle: 'Clarté de trajectoire' },
  { id: '3.5', axe: 'A3', libelle: "Identité et rapport à l'entreprise" },
]

/*
  Les 3 écrans de transition. Textes exacts de la spec §6.
  Chaque transition délivre une donnée sourcée : c'est là que se construit la crédibilité.
*/
export const TRANSITIONS = [
  {
    avantQuestion: 1,
    section: 1,
    titre: "L'entreprise sans vous",
    texte:
      'Sept questions. Elles portent sur des faits, pas sur des intentions. ' +
      "Répondez à ce qui se passe réellement, pas à ce qui devrait se passer.",
  },
  {
    avantQuestion: 8,
    section: 2,
    titre: 'Ceux qui vous entourent',
    texte:
      "Une étude de l'AFD sur les défauts de PME en Afrique subsaharienne identifie le manque " +
      'de structuration et de compétences managériales parmi les premières causes de défaillance — ' +
      'avant les problèmes de marché. Six questions sur votre entourage.',
  },
  {
    avantQuestion: 14,
    section: 3,
    titre: 'Vous',
    texte:
      "72 % des fondateurs déclarent un impact de leur activité sur leur santé mentale. " +
      "23 % en parlent à un professionnel. Cinq questions. Elles ne sortiront pas d'ici.",
  },
]
