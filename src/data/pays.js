/*
  PAYS ET LOCALISATION MONÉTAIRE
  Source : spec §16.4 — FCFA (UEMOA/CEMAC) · MAD (Maroc) · € (diaspora)

  Le montant de Q2 est localisé dynamiquement selon le pays déclaré
  (spec §6, note sous Q2) : 3 300 000 FCFA = 5 000 € = ~55 000 MAD.
*/

export const DEVISES = {
  XOF: { code: 'XOF', libelle: 'FCFA', montantQ2: '3 300 000 FCFA' },
  XAF: { code: 'XAF', libelle: 'FCFA', montantQ2: '3 300 000 FCFA' },
  MAD: { code: 'MAD', libelle: 'MAD', montantQ2: '55 000 MAD' },
  EUR: { code: 'EUR', libelle: '€', montantQ2: '5 000 €' },
}

/*
  Zone UEMOA : Bénin, Burkina, Côte d'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal, Togo
  Zone CEMAC : Cameroun, Centrafrique, Congo, Gabon, Guinée équatoriale, Tchad
*/
export const PAYS = [
  // UEMOA
  { code: 'CI', nom: "Côte d'Ivoire", devise: 'XOF' },
  { code: 'SN', nom: 'Sénégal', devise: 'XOF' },
  { code: 'BJ', nom: 'Bénin', devise: 'XOF' },
  { code: 'BF', nom: 'Burkina Faso', devise: 'XOF' },
  { code: 'ML', nom: 'Mali', devise: 'XOF' },
  { code: 'NE', nom: 'Niger', devise: 'XOF' },
  { code: 'TG', nom: 'Togo', devise: 'XOF' },
  { code: 'GW', nom: 'Guinée-Bissau', devise: 'XOF' },

  // CEMAC
  { code: 'CM', nom: 'Cameroun', devise: 'XAF' },
  { code: 'GA', nom: 'Gabon', devise: 'XAF' },
  { code: 'CG', nom: 'Congo', devise: 'XAF' },
  { code: 'TD', nom: 'Tchad', devise: 'XAF' },
  { code: 'CF', nom: 'République centrafricaine', devise: 'XAF' },
  { code: 'GQ', nom: 'Guinée équatoriale', devise: 'XAF' },

  // Autres pays d'Afrique francophone
  { code: 'CD', nom: 'République démocratique du Congo', devise: 'EUR' },
  { code: 'GN', nom: 'Guinée', devise: 'EUR' },
  { code: 'MG', nom: 'Madagascar', devise: 'EUR' },
  { code: 'MR', nom: 'Mauritanie', devise: 'EUR' },
  { code: 'DJ', nom: 'Djibouti', devise: 'EUR' },
  { code: 'RW', nom: 'Rwanda', devise: 'EUR' },
  { code: 'BI', nom: 'Burundi', devise: 'EUR' },

  // Maghreb
  { code: 'MA', nom: 'Maroc', devise: 'MAD' },
  { code: 'TN', nom: 'Tunisie', devise: 'EUR' },
  { code: 'DZ', nom: 'Algérie', devise: 'EUR' },

  // Diaspora
  { code: 'FR', nom: 'France', devise: 'EUR' },
  { code: 'BE', nom: 'Belgique', devise: 'EUR' },
  { code: 'CH', nom: 'Suisse', devise: 'EUR' },
  { code: 'CA', nom: 'Canada', devise: 'EUR' },
  { code: 'AUTRE', nom: 'Autre pays', devise: 'EUR' },
]

/** Devise associée à un code pays. Défaut : euro (diaspora). */
export function deviseDuPays(codePays) {
  const pays = PAYS.find((p) => p.code === codePays)
  return DEVISES[pays?.devise ?? 'EUR']
}

/** Montant localisé à injecter dans l'énoncé de Q2. */
export function montantQ2(codePays) {
  return deviseDuPays(codePays).montantQ2
}
