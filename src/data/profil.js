/*
  LES DEUX FORMULAIRES DE CAPTURE
  Source : arbitrage manager (WhatsApp) — fait autorité sur la spec §7.

  Partie 1 : AVANT la question 1, obligatoire.
  Partie 2 : APRÈS la question 18, facultatif.
*/

// ---------------------------------------------------------------------
// PARTIE 1 — obligatoire, avant Q1
// ---------------------------------------------------------------------
export const CHAMPS_PARTIE_1 = [
  {
    id: 'prenom',
    label: 'Prénom',
    type: 'text',
    obligatoire: true,
    autocomplete: 'given-name',
    maxlength: 80,
  },
  {
    id: 'email',
    label: 'Email professionnel',
    type: 'email',
    obligatoire: true,
    autocomplete: 'email',
    maxlength: 254,
  },
  {
    id: 'entreprise',
    label: "Nom de l'entreprise",
    type: 'text',
    obligatoire: true,
    autocomplete: 'organization',
    maxlength: 120,
  },
  {
    id: 'pays',
    label: "Pays d'exercice",
    type: 'select',
    obligatoire: true,
    source: 'pays',
  },
]

// ---------------------------------------------------------------------
// PARTIE 2 — facultatif, après Q18
// Les quatre premiers champs sont les « critères durs » d'éligibilité
// du routage commercial (spec §15.1).
// ---------------------------------------------------------------------
export const CHAMPS_PARTIE_2 = [
  {
    id: 'chiffre_affaires',
    label: 'Chiffre d’affaires annuel',
    type: 'radio',
    critereDur: true,
    options: [
      { valeur: 'moins_100M', libelle: 'Moins de 100 M FCFA' },
      { valeur: '100_300M', libelle: '100 à 300 M FCFA' },
      { valeur: '300M_1Md', libelle: '300 M à 1 Md FCFA' },
      { valeur: '1_5Mds', libelle: '1 à 5 Mds FCFA' },
      { valeur: 'plus_5Mds', libelle: 'Plus de 5 Mds FCFA' },
    ],
  },
  {
    id: 'effectif',
    label: 'Effectif',
    type: 'radio',
    critereDur: true,
    options: [
      { valeur: 'moins_5', libelle: 'Moins de 5' },
      { valeur: '5_9', libelle: '5 à 9' },
      { valeur: '10_24', libelle: '10 à 24' },
      { valeur: '25_49', libelle: '25 à 49' },
      { valeur: '50_plus', libelle: '50 et plus' },
    ],
  },
  {
    id: 'anciennete',
    label: "Ancienneté de l'entreprise",
    type: 'radio',
    critereDur: true,
    options: [
      { valeur: 'moins_3', libelle: 'Moins de 3 ans' },
      { valeur: '3_7', libelle: '3 à 7 ans' },
      { valeur: '8_15', libelle: '8 à 15 ans' },
      { valeur: 'plus_15', libelle: 'Plus de 15 ans' },
    ],
  },
  {
    id: 'rentabilite',
    label: 'Dernier exercice',
    type: 'radio',
    critereDur: true,
    /*
      « Je ne sais pas encore » est une réponse à CONSERVER (spec §7).
      Un dirigeant qui ignore si son exercice précédent est bénéficiaire est
      un signal majeur sur le pilotage comptable et le contrôle interne.
    */
    options: [
      { valeur: 'beneficiaire', libelle: 'Bénéficiaire' },
      { valeur: 'equilibre', libelle: "À l'équilibre" },
      { valeur: 'deficitaire', libelle: 'Déficitaire' },
      { valeur: 'inconnu', libelle: 'Je ne sais pas encore', signalFort: true },
    ],
  },
  {
    id: 'secteur',
    label: "Secteur d'activité",
    type: 'select',
    source: 'secteurs',
  },
  {
    id: 'evenement_recent',
    label: 'Un événement marquant au cours des 24 derniers mois ?',
    type: 'radio',
    /*
      Le champ le plus prédictif de tout le formulaire pour la conversion (spec §7).
      Ce n'est pas la fragilité qui déclenche l'achat, c'est l'événement daté.
    */
    options: [
      { valeur: 'depart_associe', libelle: "Départ ou trahison d'un associé" },
      { valeur: 'perte_client', libelle: "Perte d'un client majeur" },
      { valeur: 'sante', libelle: 'Problème de santé' },
      { valeur: 'tresorerie', libelle: 'Difficulté de trésorerie' },
      { valeur: 'conflit_familial', libelle: "Conflit familial lié à l'entreprise" },
      { valeur: 'aucun', libelle: 'Aucun' },
    ],
  },
]

export const SECTEURS = [
  { valeur: 'commerce', libelle: 'Commerce et distribution' },
  { valeur: 'btp', libelle: 'BTP et immobilier' },
  { valeur: 'industrie', libelle: 'Industrie et manufacture' },
  { valeur: 'agro', libelle: 'Agriculture et agroalimentaire' },
  { valeur: 'transport', libelle: 'Transport et logistique' },
  { valeur: 'services', libelle: 'Services aux entreprises' },
  { valeur: 'conseil', libelle: 'Conseil et professions libérales' },
  { valeur: 'sante', libelle: 'Santé et pharmacie' },
  { valeur: 'education', libelle: 'Éducation et formation' },
  { valeur: 'numerique', libelle: 'Numérique et télécommunications' },
  { valeur: 'finance', libelle: 'Finance, banque et assurance' },
  { valeur: 'hotellerie', libelle: 'Hôtellerie et restauration' },
  { valeur: 'energie', libelle: 'Énergie et mines' },
  { valeur: 'import_export', libelle: 'Import-export' },
  { valeur: 'autre', libelle: 'Autre secteur' },
]

/** Valeurs autorisées, pour la validation serveur (docs/securite.md §5.1). */
export const VALEURS_AUTORISEES = {
  chiffre_affaires: CHAMPS_PARTIE_2[0].options.map((o) => o.valeur),
  effectif: CHAMPS_PARTIE_2[1].options.map((o) => o.valeur),
  anciennete: CHAMPS_PARTIE_2[2].options.map((o) => o.valeur),
  rentabilite: CHAMPS_PARTIE_2[3].options.map((o) => o.valeur),
  secteur: SECTEURS.map((s) => s.valeur),
  evenement_recent: CHAMPS_PARTIE_2[5].options.map((o) => o.valeur),
}
