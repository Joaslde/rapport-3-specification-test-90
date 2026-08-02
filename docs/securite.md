# RÈGLES DE SÉCURITÉ — LE TEST DES 90 JOURS

> Règles à respecter strictement à chaque écriture de code.
> Ce projet collecte des **données personnelles sensibles** (santé mentale, situation financière,
> conflits familiaux). Le niveau d'exigence est celui d'un cabinet, pas celui d'un formulaire marketing.

---

## 1. LE RISQUE SPÉCIFIQUE DE CE PROJET

Ce n'est pas un questionnaire ordinaire. Les données collectées incluent :

| Donnée | Sensibilité |
|---|---|
| Signaux d'épuisement, sommeil, santé (Q15) | **Données de santé — catégorie particulière RGPD** |
| Solitude, absence de confident (Q13) | **Données de santé mentale** |
| Rapport identitaire à l'entreprise (Q16) | Données psychologiques |
| Trésorerie de l'entreprise servant la famille (Q12) | **Financièrement et juridiquement compromettant** |
| Chiffre d'affaires, rentabilité, effectif | Secret des affaires |
| Conflits familiaux liés à l'entreprise | Vie privée familiale |

**Q12 mérite une attention particulière.** Une réponse « Régulièrement, sans traçabilité comptable »
est, selon le droit OHADA, l'aveu d'un fait potentiellement qualifiable. Une fuite de cette donnée
associée à un nom et une entreprise exposerait le répondant à un risque réel.

**Le test promet explicitement au répondant :**
> *« Vos réponses sont confidentielles et ne sont jamais transmises à un tiers. »*
> *« Cinq questions. Elles ne sortiront pas d'ici. »*

Cette promesse est écrite dans l'interface. Elle nous engage.

---

## 2. RÈGLES ABSOLUES

Ces règles ne souffrent aucune exception.

| # | Règle |
|---|---|
| **S1** | **Le scoring est calculé côté serveur uniquement.** Jamais dans le navigateur. |
| **S2** | **Aucune clé secrète dans le code front.** Seule la clé `anon` de Supabase est exposable. |
| **S3** | **Aucun `.env` versionné.** Vérifier le `.gitignore` avant chaque commit. |
| **S4** | **RLS activé sur toutes les tables.** Aucune table sans politique. |
| **S5** | **Aucune lecture publique des réponses.** Même avec la clé anon. |
| **S6** | **Toute entrée est validée côté serveur**, indépendamment de la validation front. |
| **S7** | **Aucune donnée personnelle dans les logs.** Ni email, ni réponses, ni nom d'entreprise. |
| **S8** | **Aucune donnée personnelle en query string.** L'accès au rapport web se fait par token opaque. |
| **S9** | **Aucun service tiers d'analytics** qui recevrait le contenu des réponses. |
| **S10** | **Le barème ne doit pas être reconstituable** depuis le bundle JS. |

---

## 3. ARCHITECTURE DE SÉCURITÉ

### 3.1 Séparation front / serveur

```
NAVIGATEUR                          SUPABASE EDGE FUNCTION
─────────────                       ──────────────────────
Affiche les questions
Collecte les réponses brutes
        │
        │  POST { session_id, reponses: [0,2,1,...] }
        ├──────────────────────────►
        │                            Valide la structure
        │                            Applique le barème (secret)
        │                            Calcule l'Indice 90
        │                            Détermine niveau + archétype
        │                            Détecte les incohérences
        │                            Vérifie le protocole de sécurité
        │                            Écrit en base
        │                            Génère le PDF
        │                            Envoie l'email
        │  { indice90, jours, niveau }
        ◄──────────────────────────┤
Affiche le résultat
```

**Le front ne connaît jamais :** les coefficients, les points par réponse, les formules,
les seuils d'archétype, la condition du protocole de sécurité, la matrice de routage commercial.

Il n'envoie que **l'index de l'option choisie** (0 à 4), pas le nombre de points.

### 3.2 Ce qui reste côté serveur

- Le barème complet (`points` par réponse)
- Les coefficients par question
- Les formules de calcul
- Les seuils des 5 niveaux et des 6 archétypes
- Les 5 règles d'incohérence
- **La condition du protocole de sécurité** — particulièrement : personne ne doit pouvoir
  déduire depuis le front comment déclencher ou éviter ce protocole
- La matrice de routage commercial

---

## 4. SUPABASE — CONFIGURATION

### 4.1 Politiques RLS

| Table | Insertion | Lecture | Modification | Suppression |
|---|---|---|---|---|
| `reponses` | ✅ anon, avec validation | ❌ **aucune** | ❌ | ❌ |
| `contacts` | ✅ anon, avec validation | ❌ **aucune** | ❌ | ❌ |
| `resultats` | ❌ (service_role uniquement) | ⚠️ par token uniquement | ❌ | ❌ |
| `evenements` | ✅ anon | ❌ | ❌ | ❌ |

**Aucune table n'est lisible par la clé anon sans token.** L'accès au rapport web se fait par
un token aléatoire de 32 octets, sans lien avec l'identité, avec expiration.

### 4.2 Règles de schéma

- Clés primaires en `uuid` généré côté serveur — **jamais de `serial` incrémental**
  (un id séquentiel permet d'énumérer les enregistrements)
- Le `session_id` est un uuid généré côté client, sans valeur d'authentification
- Contrainte `CHECK` sur les valeurs de réponse : `BETWEEN 0 AND 4`
- Contrainte `CHECK` sur le nombre de réponses : exactement 18
- Horodatage `created_at` en `timestamptz`, jamais modifiable

### 4.3 Le token d'accès au rapport web

```
token = base64url(random_bytes(32))
```

- Généré côté serveur uniquement
- Aucune information dérivable (pas d'email encodé, pas d'id)
- Expiration : **90 jours** (cohérent avec le produit)
- Un token = un rapport. Aucune énumération possible.
- URL : `domaine.com/rapport?t=<token>` — **jamais l'email en clair dans l'URL**

---

## 5. VALIDATION DES ENTRÉES

### 5.1 Côté serveur — obligatoire

Tout ce qui arrive est hostile jusqu'à preuve du contraire.

| Champ | Validation |
|---|---|
| `session_id` | Format uuid v4 strict |
| `reponses` | Tableau de **exactement 18 entiers**, chacun `0 ≤ n ≤ 4` |
| `prenom` | 1–80 caractères, pas de balise, pas d'URL |
| `email` | Format RFC, 5–254 caractères, domaine avec MX résolvable |
| `entreprise` | 1–120 caractères, pas de balise, pas d'URL |
| `pays` | Valeur appartenant à la liste fermée |
| Profil partie 2 | Chaque champ : valeur appartenant à sa liste fermée, ou `null` |

**Règle :** tout champ à choix multiple est validé contre une **liste fermée côté serveur**.
Jamais de valeur libre acceptée là où une liste existe.

### 5.2 Rejets systématiques

- Emails jetables (liste de domaines connus)
- Champs contenant `<`, `>`, `javascript:`, `data:`
- Champs contenant une URL (signal de spam)
- Payload > 8 Ko

### 5.3 Encodage à la sortie

Les valeurs saisies par l'utilisateur (prénom, entreprise) apparaissent dans le PDF et l'email.
**Elles doivent être échappées à l'insertion** — un nom d'entreprise contenant du HTML ne doit
casser ni le PDF ni l'email.

Vue échappe par défaut dans les templates. **Ne jamais utiliser `v-html`** sur une donnée
provenant du répondant.

---

## 6. PROTECTION CONTRE L'ABUS

### 6.1 Rate limiting

| Action | Limite |
|---|---|
| Soumission d'un test complet | 3 par IP par heure |
| Création de session | 10 par IP par heure |
| Envoi d'email | 1 par adresse par 24 h |
| Écriture d'événement (tracking) | 100 par session |

Dépassement → réponse 429, sans détail sur la limite atteinte.

### 6.2 Anti-bot

- **Honeypot** : un champ masqué en CSS. S'il est rempli → rejet silencieux (réponse 200,
  aucune écriture). Poids : 0 Ko.
- **Contrôle temporel** : un parcours de 18 questions bouclé en moins de 45 secondes est
  automatiquement rejeté — un humain ne peut pas lire les énoncés en moins de temps.
- **Pas de CAPTCHA.** Contraire à l'exigence de sobriété et coûteux en poids de page.

### 6.3 Protection de l'intégrité des données du Baromètre

Le futur Baromètre repose sur la qualité des réponses. Un flux de faux tests le corromprait.

- Marquer (sans supprimer) les sessions suspectes : durée anormale, IP répétée,
  email jetable, réponses toutes identiques
- Un champ `qualite` sur chaque enregistrement, exclu par défaut des statistiques

---

## 7. GESTION DES SECRETS

### 7.1 Répartition

| Secret | Emplacement | Exposable au front ? |
|---|---|---|
| `SUPABASE_URL` | `.env` → build | ✅ oui |
| `SUPABASE_ANON_KEY` | `.env` → build | ✅ oui (protégée par RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secrets Edge Function | ❌ **jamais** |
| `RESEND_API_KEY` | Secrets Edge Function | ❌ **jamais** |

### 7.2 Règles

- `.env` dans `.gitignore` — **vérifier avant chaque commit**
- `.env.example` versionné, **sans aucune valeur réelle**
- Les variables front sont préfixées `VITE_` — **tout ce qui porte ce préfixe finit dans le
  bundle public.** Ne jamais y mettre un secret.
- Les secrets serveur passent par `supabase secrets set`, jamais par un fichier versionné
- Rotation des clés si une fuite est suspectée, sans délai

### 7.3 Contrôle avant tout push

```
1. git diff --staged  →  aucune clé, aucun token, aucun mot de passe
2. .env absent du diff
3. Aucune donnée réelle de test (email, nom d'entreprise) dans le code
```

---

## 8. RGPD ET DONNÉES DE SANTÉ

### 8.1 Base légale

Les réponses de l'Axe 3 relèvent de l'**article 9 RGPD** (catégories particulières).
Base légale retenue : **consentement explicite**.

### 8.2 Obligations

| Obligation | Mise en œuvre |
|---|---|
| Consentement explicite | Case à cocher **non pré-cochée** avant la Partie 1, avec lien vers la politique de confidentialité |
| Information claire | Ce qui est collecté, pourquoi, combien de temps, avec qui c'est partagé (personne) |
| Droit d'accès | Adresse email de contact indiquée dans le rapport et l'email |
| Droit à l'effacement | Procédure documentée, exécutable sous 30 jours |
| Durée de conservation | **36 mois** — au-delà, anonymisation (suppression de l'email et du nom) |
| Minimisation | Ne collecter que ce qui figure dans la spécification. Aucun champ supplémentaire. |
| Chiffrement | TLS en transit. Au repos : chiffrement Supabase par défaut. |

### 8.3 Ce qu'on ne fait pas

- ❌ Aucun partage avec un tiers — la promesse est écrite dans l'interface
- ❌ Aucun pixel de tracking publicitaire sur les pages du test
- ❌ Aucun cookie tiers
- ❌ Aucune revente, aucun enrichissement par un service externe
- ❌ Aucune donnée nominative dans le futur Baromètre — agrégats uniquement

### 8.4 Anonymisation pour le Baromètre

Le Baromètre exploite les réponses. Il doit travailler sur une **vue anonymisée** :
réponses + pays + secteur + tranche de CA + tranche d'effectif.
**Jamais** l'email, le nom, le prénom, le nom de l'entreprise.

---

## 9. LE PROTOCOLE DE SÉCURITÉ (déontologie)

Distinct de la sécurité informatique, mais de même niveau d'exigence.

Voir `docs/projet.md` §9 pour la règle métier complète.

**Contraintes techniques associées :**

| Contrainte | Mise en œuvre |
|---|---|
| La condition de déclenchement ne doit pas être devinable depuis le front | Évaluée uniquement en Edge Function |
| Le drapeau `protocole_actif` ne doit pas être modifiable | Écrit par `service_role` uniquement, colonne non modifiable |
| La désactivation commerciale de 21 jours doit être infalsifiable | Date calculée serveur, stockée, vérifiée à chaque envoi |
| Le scénario de rupture doit être absent du PDF, pas masqué | La section n'est pas générée du tout — pas de texte caché récupérable |

---

## 10. EN-TÊTES HTTP

À configurer sur l'hébergement (Vercel / Netlify) :

```
Content-Security-Policy: default-src 'self';
                         script-src 'self';
                         style-src 'self' 'unsafe-inline';
                         font-src 'self';
                         img-src 'self' data:;
                         connect-src 'self' https://*.supabase.co;
                         frame-ancestors 'none';
                         base-uri 'self';
                         form-action 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
```

**Note :** `frame-ancestors 'none'` empêche l'intégration du test dans une iframe tierce —
protection contre le clickjacking et contre une réutilisation non autorisée de l'outil.

---

## 11. DÉPENDANCES

- **Auditer avant d'ajouter.** Chaque dépendance est une surface d'attaque et du poids.
- `npm audit` avant chaque déploiement — aucune vulnérabilité **haute** ou **critique** tolérée
- Verrouiller les versions (`package-lock.json` versionné)
- Privilégier les solutions natives : la contrainte de 400 Ko et la sécurité vont dans le même sens
- **Aucune dépendance qui appelle un service externe** au runtime côté client

---

## 12. LISTE DE CONTRÔLE AVANT MISE EN LIGNE

- [ ] `.env` absent du dépôt, `.gitignore` vérifié
- [ ] Aucune clé secrète dans le bundle — `grep` sur `dist/`
- [ ] Le barème n'est pas reconstituable depuis le bundle
- [ ] RLS activé et testé sur les 4 tables
- [ ] Tentative de lecture non autorisée → échoue (**preuve à consigner**)
- [ ] Tentative de manipulation du score → échoue (**preuve à consigner**)
- [ ] Rate limiting actif et testé
- [ ] Honeypot fonctionnel
- [ ] En-têtes de sécurité présents — vérifier avec securityheaders.com
- [ ] HTTPS forcé, HSTS actif
- [ ] Consentement RGPD en place, non pré-coché
- [ ] Politique de confidentialité publiée et accessible
- [ ] Aucune donnée personnelle dans les logs
- [ ] `npm audit` — zéro vulnérabilité haute ou critique
- [ ] Le protocole de sécurité déontologique fonctionne (**test avec jeu de réponses déclencheur**)
