// ⚠️ FICHIER GÉNÉRÉ — ne pas modifier ici.
// Source : supabase/functions/_shared/contenu-scenario.js
// Régénérer avec : npm run sync:fonctions
/*
  LE SCÉNARIO DE RUPTURE — page 7 du rapport
  Source : rapport-3-specification-test-90-jours.md §13

  « C'est la page qui sera photographiée et partagée. Elle transforme un score
    en récit. » — 300 à 400 mots, générés à partir des réponses.

  RÈGLES DE RÉDACTION IMPÉRATIVES (spec §13.4) :
    ✗ Aucun adjectif dramatique. Pas de « catastrophe », « effondrement », « désastre ».
      La sobriété est ce qui rend le texte crédible et donc effrayant.
    ✗ Aucune faillite. L'entreprise ne meurt pas. Elle s'appauvrit.
      C'est plus réaliste et plus dérangeant.
    ✗ Aucun reproche. Jamais « vous auriez dû ». Uniquement « ce qui se passerait ».
    ✓ Une dernière ligne qui ouvre. Le texte se termine sur une possibilité.

  ⚠️ SUPPRIMÉ DU RAPPORT si le protocole de sécurité est actif (spec §14.2).
  ⚠️ CONTENU À FAIRE VALIDER PAR LE MANAGER (todo.md 6.12).
*/

export const SCENARIO_TITRE = 'Ce qui se passerait'

export const SCENARIO_INTRODUCTION =
  'Vous êtes immobilisé demain, sans possibilité de communiquer, pour quatre-vingt-dix jours. ' +
  'Voici la séquence que vos réponses décrivent.'

/** Les neuf blocs déclenchables (spec §13.2). L'ordre narratif est porté par `ordre`. */
export const SCENARIO_BLOCS = {
  decisions: {
    jours: 'Jours 1 à 5',
    texte:
      'Les premières décisions remontent et restent en attente. Personne ne se déclare bloqué : ' +
      'chacun suppose que quelqu’un d’autre a la réponse. Le travail continue en apparence.',
  },

  paiements: {
    jours: 'Jours 3 à 10',
    texte:
      'Deux règlements fournisseurs ne partent pas. Aucune signature alternative n’existe. L’un ' +
      'des fournisseurs relance, puis passe l’entreprise en paiement comptant. Le besoin en ' +
      'trésorerie augmente d’un coup, sans que personne n’en identifie la cause immédiate.',
  },

  administratif: {
    jours: 'Jours 10 à 25',
    texte:
      'Une échéance administrative n’est pas traitée dans les temps. Le dossier était ' +
      'historiquement suivi par vous, avec un interlocuteur que vous étiez seul à connaître. ' +
      'La régularisation prendra plusieurs semaines et coûtera des pénalités.',
  },

  client_appelle: {
    jours: 'Jours 12 à 20',
    texte:
      'Un de vos principaux clients demande à vous joindre. On lui répond que vous êtes ' +
      'indisponible. Il rappelle deux fois. À la troisième, il contacte un concurrent — non par ' +
      'défiance, mais parce qu’il a un besoin à couvrir.',
  },

  conflit_autorite: {
    jours: 'Jours 20 à 40',
    texte:
      'Un désaccord opérationnel oppose deux responsables. Aucun n’a autorité sur l’autre. Le ' +
      'sujet reste ouvert. Les équipes choisissent leur camp. La productivité baisse sans qu’aucun ' +
      'indicateur ne le montre.',
  },

  savoir_manquant: {
    jours: 'Jours 25 à 45',
    texte:
      'Une opération courante doit être reproduite. Personne ne sait exactement comment elle était ' +
      'faite, et rien n’est écrit. Elle est refaite autrement, plus lentement, avec un résultat ' +
      'que le client remarque.',
  },

  tresorerie: {
    jours: 'Jours 30 à 60',
    texte:
      'La trésorerie est sollicitée pour des besoins qui vous étaient jusqu’ici présentés ' +
      'directement. Le filtre que vous exerciez n’existe plus, et aucune règle écrite ne le ' +
      'remplace. Les sorties se poursuivent sans que personne ne se sente en position de les ' +
      'refuser.',
  },

  cadre_part: {
    jours: 'Jours 45 à 70',
    texte:
      'Un cadre clé reçoit une proposition extérieure. Dans un contexte stable, il l’aurait ' +
      'probablement déclinée. L’incertitude des dernières semaines a levé ses dernières ' +
      'hésitations. Il accepte.',
  },

  client_part: {
    jours: 'Jours 60 à 90',
    texte:
      'Le client dont la relation reposait entièrement sur vous met fin au courant d’affaires. ' +
      'La décision n’est pas brutale : elle a mûri pendant les semaines où personne n’a su quoi ' +
      'lui dire.',
  },
}

/** Clôture — sobre, sans faillite, sur une possibilité (spec §13.4). */
export const SCENARIO_CLOTURE = {
  jours: 'Au jour 90',
  texte:
    'L’entreprise existe toujours. Elle a perdu une part de sa trésorerie, une part de ses ' +
    'relations, et sa capacité à décider vite. Aucun de ces événements n’était prévisible ' +
    'isolément. Tous découlent du même point unique.',
}

export const SCENARIO_MENTION =
  'Ce scénario est généré à partir de vos réponses. Il ne décrit pas une fatalité. ' +
  'Il décrit la séquence logique de ce que vous avez déclaré.'

/**
 * Assemble le scénario à partir des blocs déclenchés par le moteur.
 * @param {Array<{id: string, ordre: number}>} blocsDeclenches
 */
export function assemblerScenario(blocsDeclenches) {
  if (!blocsDeclenches?.length) return null

  const paragraphes = blocsDeclenches
    .map((b) => SCENARIO_BLOCS[b.id])
    .filter(Boolean)
    .map((b) => ({ jours: b.jours, texte: b.texte }))

  return {
    titre: SCENARIO_TITRE,
    introduction: SCENARIO_INTRODUCTION,
    paragraphes: [...paragraphes, SCENARIO_CLOTURE],
    mention: SCENARIO_MENTION,
  }
}
