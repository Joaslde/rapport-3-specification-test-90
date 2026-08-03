/*
  GÉNÉRATION DU RAPPORT PDF — 8 pages A4
  Source : rapport-3-specification-test-90-jours.md §12 et §16.3

  Librairie : pdf-lib. Choisie parce qu'elle tourne sous Deno sans dépendance
  native, contrairement à Puppeteer qui exigerait un navigateur complet.

  CHARTE (docs/design-pattern.md, spec §16.3) :
    - deux couleurs + trois gris, AUCUN rouge, AUCUN vert
    - serif pour les titres, sans-serif pour le corps
    - trois jauges linéaires + un radar à trois branches. RIEN DE PLUS.
    - aucune image décorative

  Les jauges sont MONOCHROMES : un score de 18 et un score de 84 utilisent
  exactement la même couleur. Seule la longueur du remplissage diffère.
  C'est ce qui empêche la couleur de porter le jugement à la place du texte.
*/

import { PDFDocument, StandardFonts, rgb, degrees } from 'https://esm.sh/pdf-lib@1.17.1'

// --- Palette (docs/design-pattern.md §3) ----------------------------
const ENCRE = rgb(0.106, 0.165, 0.227) // #1B2A3A
const LAITON = rgb(0.604, 0.482, 0.31) // #9A7B4F
const PAPIER = rgb(0.98, 0.976, 0.969) // #FAF9F7
const TRAIT = rgb(0.867, 0.851, 0.827) // #DDD9D3
const GRIS = rgb(0.42, 0.447, 0.502) // #6B7280

// --- Géométrie A4 ---------------------------------------------------
const A4 = [595.28, 841.89]
const MARGE_X = 64
const MARGE_HAUT = 72
const MARGE_BAS = 72
const LARGEUR_UTILE = A4[0] - MARGE_X * 2

export class RapportPDF {
  constructor(doc, polices) {
    this.doc = doc
    this.f = polices
    this.page = null
    this.y = 0
    this.numero = 0
  }

  static async creer() {
    const doc = await PDFDocument.create()
    doc.setTitle('Le Test des 90 Jours — votre Indice 90')
    doc.setProducer('Le Test des 90 Jours')
    doc.setCreator('Le Test des 90 Jours')

    /*
      Serif pour les titres, sans-serif pour le corps (spec §16.3).
      Les 14 polices standard PDF évitent d'embarquer un fichier de police :
      le rapport reste léger et s'ouvre partout sans substitution.
      Attention aux noms exacts : c'est TimesRomanBold, pas TimesBold.
    */
    const polices = {
      titre: await doc.embedFont(StandardFonts.TimesRoman),
      titreGras: await doc.embedFont(StandardFonts.TimesRomanBold),
      corps: await doc.embedFont(StandardFonts.Helvetica),
      corpsGras: await doc.embedFont(StandardFonts.HelveticaBold),
      corpsItal: await doc.embedFont(StandardFonts.HelveticaOblique),
    }
    return new RapportPDF(doc, polices)
  }

  // -------------------------------------------------------------------
  // Mise en page
  // -------------------------------------------------------------------

  nouvellePage({ pied = true } = {}) {
    this.page = this.doc.addPage(A4)
    this.page.drawRectangle({ x: 0, y: 0, width: A4[0], height: A4[1], color: PAPIER })
    this.y = A4[1] - MARGE_HAUT
    this.numero += 1
    if (pied) this.piedDePage()
    return this.page
  }

  piedDePage() {
    const p = this.page
    p.drawLine({
      start: { x: MARGE_X, y: MARGE_BAS - 22 },
      end: { x: A4[0] - MARGE_X, y: MARGE_BAS - 22 },
      thickness: 0.5,
      color: TRAIT,
    })
    p.drawText('Le Test des 90 Jours', {
      x: MARGE_X,
      y: MARGE_BAS - 36,
      size: 7.5,
      font: this.f.corps,
      color: GRIS,
    })
    const n = String(this.numero)
    p.drawText(n, {
      x: A4[0] - MARGE_X - this.f.corps.widthOfTextAtSize(n, 7.5),
      y: MARGE_BAS - 36,
      size: 7.5,
      font: this.f.corps,
      color: GRIS,
    })
  }

  /** Découpe un texte en lignes tenant dans la largeur donnée. */
  lignes(texte, font, taille, largeur = LARGEUR_UTILE) {
    const out = []
    for (const paragraphe of String(texte).split('\n')) {
      if (!paragraphe.trim()) {
        out.push('')
        continue
      }
      let ligne = ''
      for (const mot of paragraphe.split(' ')) {
        const essai = ligne ? `${ligne} ${mot}` : mot
        if (font.widthOfTextAtSize(essai, taille) > largeur) {
          if (ligne) out.push(ligne)
          ligne = mot
        } else {
          ligne = essai
        }
      }
      if (ligne) out.push(ligne)
    }
    return out
  }

  /** Écrit un paragraphe et fait descendre le curseur. */
  texte(contenu, opts = {}) {
    const {
      font = this.f.corps,
      taille = 10,
      couleur = ENCRE,
      interligne = 1.55,
      x = MARGE_X,
      largeur = LARGEUR_UTILE,
      espaceApres = 0,
    } = opts

    const pas = taille * interligne
    for (const ligne of this.lignes(contenu, font, taille, largeur)) {
      if (ligne) this.page.drawText(ligne, { x, y: this.y, size: taille, font, color: couleur })
      this.y -= pas
    }
    this.y -= espaceApres
  }

  /** Sur-titre en capitales espacées — le repère de section. */
  surTitre(contenu) {
    const t = String(contenu).toUpperCase()
    let x = MARGE_X
    for (const c of t) {
      this.page.drawText(c, { x, y: this.y, size: 7.5, font: this.f.corpsGras, color: GRIS })
      x += this.f.corpsGras.widthOfTextAtSize(c, 7.5) + 1.4
    }
    this.y -= 22
  }

  titre(contenu, taille = 21) {
    this.texte(contenu, { font: this.f.titreGras, taille, interligne: 1.22, couleur: ENCRE })
    this.y -= 6
  }

  /** Filet d'accent laiton — le seul usage de la couleur d'accent. */
  filetAccent(largeur = 44) {
    this.page.drawLine({
      start: { x: MARGE_X, y: this.y + 4 },
      end: { x: MARGE_X + largeur, y: this.y + 4 },
      thickness: 1.5,
      color: LAITON,
    })
    this.y -= 20
  }

  filet(couleur = TRAIT) {
    this.page.drawLine({
      start: { x: MARGE_X, y: this.y + 6 },
      end: { x: A4[0] - MARGE_X, y: this.y + 6 },
      thickness: 0.5,
      color: couleur,
    })
    this.y -= 18
  }

  /** Bloc encadré à gauche par un filet — citation, mise en exergue. */
  blocFilet(contenu, { accent = false, taille = 10 } = {}) {
    const depart = this.y + 10
    const lignes = this.lignes(contenu, this.f.corps, taille, LARGEUR_UTILE - 18)
    this.texte(contenu, { x: MARGE_X + 18, largeur: LARGEUR_UTILE - 18, taille })
    const hauteur = lignes.length * taille * 1.55
    this.page.drawLine({
      start: { x: MARGE_X, y: depart },
      end: { x: MARGE_X, y: depart - hauteur + 4 },
      thickness: accent ? 1.5 : 1,
      color: accent ? LAITON : TRAIT,
    })
  }

  /** Bloc sur fond sourd — encadré de sécurité, orientation. */
  blocFond(titre, contenu, { taille = 9.5 } = {}) {
    const lignesTitre = titre ? 1 : 0
    const lignes = this.lignes(contenu, this.f.corps, taille, LARGEUR_UTILE - 40)
    const hauteur = (lignes.length + lignesTitre) * taille * 1.55 + 34

    this.page.drawRectangle({
      x: MARGE_X,
      y: this.y - hauteur + taille * 1.55 + 8,
      width: LARGEUR_UTILE,
      height: hauteur,
      color: rgb(0.945, 0.941, 0.933),
    })

    this.y -= 16
    if (titre) {
      this.texte(titre, { x: MARGE_X + 20, font: this.f.corpsGras, taille: 9, couleur: ENCRE })
      this.y -= 2
    }
    this.texte(contenu, { x: MARGE_X + 20, largeur: LARGEUR_UTILE - 40, taille, couleur: ENCRE })
    this.y -= 18
  }

  /**
   * Jauge linéaire (spec §16.3). MONOCHROME quel que soit le score.
   * Une seule graduation visible : le seuil de 50.
   */
  jauge(libelle, sousTitre, score, poids) {
    this.texte(libelle, { font: this.f.titreGras, taille: 12, interligne: 1.2 })
    this.texte(`${sousTitre} · pondération ${poids}`, {
      taille: 8.5,
      couleur: GRIS,
      interligne: 1.3,
    })
    this.y -= 6

    const larg = LARGEUR_UTILE - 58
    const yb = this.y
    this.page.drawRectangle({ x: MARGE_X, y: yb, width: larg, height: 8, color: TRAIT })
    this.page.drawRectangle({
      x: MARGE_X,
      y: yb,
      width: Math.max(0, (larg * score) / 100),
      height: 8,
      color: ENCRE,
    })
    // Seuil de 50 — la seule graduation.
    this.page.drawLine({
      start: { x: MARGE_X + larg / 2, y: yb - 3 },
      end: { x: MARGE_X + larg / 2, y: yb + 11 },
      thickness: 0.75,
      color: GRIS,
    })
    this.page.drawText(`${score}`, {
      x: MARGE_X + larg + 12,
      y: yb,
      size: 13,
      font: this.f.titreGras,
      color: ENCRE,
    })
    this.y -= 30
  }

  /** Radar à trois branches (spec §16.3). Aucune couleur, aucune légende. */
  radar(scores, { cx = A4[0] / 2, cy, rayon = 74 } = {}) {
    const p = this.page
    const angles = [90, 210, 330].map((d) => (d * Math.PI) / 180)

    // Grille : cercles concentriques à 25 / 50 / 75 / 100.
    for (const niveau of [0.25, 0.5, 0.75, 1]) {
      const pts = angles.map((a) => ({
        x: cx + Math.cos(a) * rayon * niveau,
        y: cy + Math.sin(a) * rayon * niveau,
      }))
      for (let i = 0; i < 3; i++) {
        const q = pts[(i + 1) % 3]
        p.drawLine({
          start: pts[i],
          end: q,
          thickness: 0.4,
          color: TRAIT,
        })
      }
    }

    // Axes.
    angles.forEach((a) => {
      p.drawLine({
        start: { x: cx, y: cy },
        end: { x: cx + Math.cos(a) * rayon, y: cy + Math.sin(a) * rayon },
        thickness: 0.4,
        color: TRAIT,
      })
    })

    // Le tracé des scores.
    const pts = angles.map((a, i) => ({
      x: cx + Math.cos(a) * rayon * (scores[i] / 100),
      y: cy + Math.sin(a) * rayon * (scores[i] / 100),
    }))
    for (let i = 0; i < 3; i++) {
      p.drawLine({
        start: pts[i],
        end: pts[(i + 1) % 3],
        thickness: 1.5,
        color: ENCRE,
      })
    }

    // Libellés courts, sans légende séparée.
    const noms = ['Entreprise', 'Entourage', 'Vous']
    angles.forEach((a, i) => {
      const lx = cx + Math.cos(a) * (rayon + 18)
      const ly = cy + Math.sin(a) * (rayon + 18)
      const l = this.f.corps.widthOfTextAtSize(noms[i], 8)
      p.drawText(noms[i], { x: lx - l / 2, y: ly - 3, size: 8, font: this.f.corps, color: GRIS })
    })
  }

  /** Bandeau « document provisoire » — tant que la signature n'est pas définitive. */
  filigraneProvisoire() {
    this.page.drawText('DOCUMENT PROVISOIRE', {
      x: 150,
      y: 380,
      size: 34,
      font: this.f.corpsGras,
      color: rgb(0.906, 0.898, 0.886),
      rotate: degrees(38),
    })
  }

  async octets() {
    return await this.doc.save()
  }
}

// =====================================================================
// RENDU DES 8 PAGES
// =====================================================================

export async function genererPDF(rapport) {
  const r = await RapportPDF.creer()
  const provisoire = rapport.pages.at(-1)?.signature?.provisoire

  for (const page of rapport.pages) {
    switch (page.type) {
      case 'couverture':
        rendreCouverture(r, page, provisoire)
        break
      case 'verdict':
        rendreVerdict(r, page)
        break
      case 'axes':
        rendreAxes(r, page)
        break
      case 'forces':
        rendreForces(r, page)
        break
      case 'fragilites':
        rendreFragilites(r, page)
        break
      case 'point_critique':
        rendrePointCritique(r, page)
        break
      case 'scenario':
        rendreScenario(r, page)
        break
      case 'suite':
        rendreSuite(r, page)
        break
    }
  }

  return await r.octets()
}

/*
  Page 1 — « Indice 90 en très grand. Nombre de jours en dessous.
             Une seule phrase. Rien d'autre. Aucune image décorative. »
*/
function rendreCouverture(r, p, provisoire) {
  r.nouvellePage({ pied: false })
  if (provisoire) r.filigraneProvisoire()

  r.y = A4[1] - 150
  r.surTitre('Le Test des 90 Jours')

  const date = new Date(p.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  r.texte(`${p.prenom} · ${p.entreprise}`, { taille: 11, couleur: GRIS })
  r.texte(date, { taille: 9, couleur: GRIS })

  r.y -= 80
  r.texte('INDICE 90', { font: r.f.corpsGras, taille: 8, couleur: GRIS })
  r.y -= 14

  const s = String(p.indice90)
  r.page.drawText(s, { x: MARGE_X, y: r.y - 66, size: 92, font: r.f.titreGras, color: ENCRE })
  const larg = r.f.titreGras.widthOfTextAtSize(s, 92)
  r.page.drawText('/ 100', {
    x: MARGE_X + larg + 14,
    y: r.y - 66,
    size: 20,
    font: r.f.titre,
    color: GRIS,
  })
  r.y -= 104

  r.filetAccent(56)
  r.y -= 8
  r.texte(p.phrase, { font: r.f.titreGras, taille: 19, interligne: 1.3 })

  r.y -= 26
  r.texte(
    'Le seuil au-delà duquel une entreprise est considérée comme transférable est de 90 jours.',
    { taille: 9.5, couleur: GRIS },
  )
}

function rendreVerdict(r, p) {
  r.nouvellePage()
  r.surTitre('Page 2 — Le verdict')

  // L'encadré de sécurité passe AVANT tout le reste (spec §14.2).
  if (p.encadreSecurite) {
    r.blocFond(p.encadreSecurite.titre, p.encadreSecurite.texte)
    r.y -= 10
  }

  r.titre(p.niveau.nom, 20)
  r.filetAccent()
  r.texte(p.niveau.formulation, { taille: 10.5, couleur: GRIS, espaceApres: 20 })

  r.texte('ARCHÉTYPE', { font: r.f.corpsGras, taille: 7.5, couleur: GRIS })
  r.y -= 4
  r.texte(p.archetype.nom, { font: r.f.titreGras, taille: 13, espaceApres: 16 })

  r.texte(p.verdict, { taille: 10, interligne: 1.62 })

  if (p.incoherences) {
    r.y -= 12
    r.filet()
    r.texte(p.incoherences.titre, { font: r.f.titreGras, taille: 12, espaceApres: 10 })
    r.texte(p.incoherences.introduction, { taille: 9.5, couleur: GRIS, espaceApres: 12 })
    for (const m of p.incoherences.messages) {
      r.blocFilet(m, { accent: true, taille: 9.5 })
      r.y -= 10
    }
    r.texte(p.incoherences.cloture, { taille: 9.5, font: r.f.corpsGras, espaceApres: 4 })
  }
}

function rendreAxes(r, p) {
  r.nouvellePage()
  r.surTitre('Page 3 — Les trois axes')
  r.titre('La lecture par axe', 20)
  r.filetAccent()
  r.y -= 6

  for (const a of p.axes) {
    r.jauge(a.titre, a.sousTitre, a.score, a.poids)
  }

  r.y -= 10
  r.radar(
    p.axes.map((a) => a.score),
    { cy: r.y - 84 },
  )
  r.y -= 200

  // Règle absolue : ne jamais inventer de benchmark (spec §17.1).
  if (p.benchmark) {
    r.filet()
    r.texte(p.benchmark, { taille: 9.5, couleur: GRIS })
  }
}

function rendreForces(r, p) {
  r.nouvellePage()
  r.surTitre('Page 4')
  r.titre(p.titre, 20)
  r.filetAccent()
  r.texte(p.introduction, { taille: 9.5, couleur: GRIS, espaceApres: 22 })

  for (const e of p.elements) {
    r.texte(`${e.libelle}  ·  ${e.score}/100`, {
      font: r.f.titreGras,
      taille: 12,
      espaceApres: 8,
    })
    if (e.etablie) {
      r.texte(e.acquis, { taille: 9.5, espaceApres: 8 })
      r.texte(`Le risque : ${e.risque}`, { taille: 9.5, couleur: GRIS, espaceApres: 18 })
    } else {
      r.texte(`Premier levier : ${e.levier}`, { taille: 9.5, couleur: GRIS, espaceApres: 18 })
    }
  }
}

function rendreFragilites(r, p) {
  r.nouvellePage()
  r.surTitre('Page 5')
  r.titre(p.titre, 20)
  r.filetAccent()
  r.y -= 6

  for (const e of p.elements) {
    r.texte(`${e.libelle}  ·  ${e.score}/100`, {
      font: r.f.titreGras,
      taille: 12,
      espaceApres: 8,
    })
    r.texte(e.description, { taille: 9.5, espaceApres: 8 })
    r.texte(`À 12-24 mois : ${e.consequence}`, { taille: 9.5, couleur: GRIS, espaceApres: 8 })
    r.texte(`Premier levier : ${e.levier}`, { taille: 9.5, font: r.f.corpsGras, espaceApres: 18 })
  }
}

function rendrePointCritique(r, p) {
  r.nouvellePage()
  r.surTitre('Page 6 — Le point critique')
  r.titre(p.libelle, 22)
  r.filetAccent()
  r.texte(`${p.score} / 100`, { font: r.f.titreGras, taille: 15, couleur: GRIS, espaceApres: 24 })

  r.texte(p.description, { taille: 10.5, interligne: 1.6, espaceApres: 18 })
  r.filet()
  r.texte('Pourquoi celle-là', { font: r.f.corpsGras, taille: 9, couleur: GRIS, espaceApres: 8 })
  r.texte(p.pourquoi, { taille: 10.5, interligne: 1.6, espaceApres: 22 })

  r.blocFond('Premier levier', p.levier, { taille: 10 })
}

function rendreScenario(r, p) {
  r.nouvellePage()
  r.surTitre('Page 7')
  r.titre(p.titre, 22)
  r.filetAccent()
  r.texte(p.introduction, { taille: 10, couleur: GRIS, espaceApres: 20 })

  for (const par of p.paragraphes) {
    // Une nouvelle page si le bloc ne tient plus.
    if (r.y < MARGE_BAS + 90) {
      r.nouvellePage()
      r.y -= 8
    }
    r.texte(par.jours, { font: r.f.corpsGras, taille: 9, couleur: LAITON, espaceApres: 4 })
    r.texte(par.texte, { taille: 9.5, interligne: 1.6, espaceApres: 14 })
  }

  r.y -= 6
  r.filet()
  r.texte(p.mention, { taille: 8.5, font: r.f.corpsItal, couleur: GRIS })
}

function rendreSuite(r, p) {
  r.nouvellePage()
  r.surTitre('Page 8')
  r.titre(p.titre, 20)
  r.filetAccent()
  r.texte(p.introduction, { taille: 9.5, couleur: GRIS, espaceApres: 22 })

  p.actions.forEach((a, i) => {
    r.texte(`${i + 1}.  ${a.titre}`, { font: r.f.titreGras, taille: 12, espaceApres: 8 })
    r.texte(a.texte, { taille: 9.5, x: MARGE_X + 18, largeur: LARGEUR_UTILE - 18, espaceApres: 18 })
  })

  /*
    Règle de proportion (spec §12.2) : l'orientation commerciale vient
    EN BAS DE PAGE SEULEMENT, et occupe une demi-page au maximum.
    Elle est absente si le protocole de sécurité est actif.
  */
  if (p.orientation) {
    r.y = Math.min(r.y, MARGE_BAS + 150)
    r.filet()
    r.texte(p.orientation.texte, { taille: 9.5, couleur: GRIS, espaceApres: 22 })
  }

  r.y = Math.max(r.y, MARGE_BAS + 40)
  r.texte(p.signature.nom, { font: r.f.titreGras, taille: 10 })
  r.texte(p.signature.fonction, { taille: 9, couleur: GRIS })
  if (p.signature.provisoire) {
    r.y -= 6
    r.texte(p.signature.mention, { taille: 7.5, font: r.f.corpsItal, couleur: GRIS })
  }
}
