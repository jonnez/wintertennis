# 🎾 Winter Tennis Planning

Een webapp voor het plannen en beheren van wekelijkse tennis wedstrijden tijdens het winterseizoen. De app gebruikt GitHub als backend om alle data op te slaan in JSON bestanden.

## Features

- **Spelersbeheersysteem**: Beheer een lijst van spelers met hun beschikbaarheid
- **Wekelijkse Planning**: Selecteer 12 spelers voor elke zondag avond
- **Baanschema Generator**: 5 verschillende schema's met automatische loting
- **Uitslag Tracker**: Voer wedstrijd uitslagen in en houd punten bij
- **Ranking Systeem**: Automatische berekening van rankings gebaseerd op prestaties
- **Catering Tracker**: Bijhouden wie wanneer de catering verzorgt
- **GitHub Storage**: Alle data wordt veilig opgeslagen in je GitHub repository

## Technologie

- **Frontend**: React 18 + Material-UI v5
- **Build Tool**: Vite
- **Authenticatie**: GitHub OAuth / Personal Access Token
- **Data Storage**: GitHub Repository (JSON files)
- **Hosting**: GitHub Pages

## Installatie & Development

### Vereisten

- Node.js 20.19.0 of hoger
- npm of yarn
- GitHub account

### Stappen

1. Clone de repository:
```bash
git clone https://github.com/jonnez/wintertennis.git
cd wintertennis
```

2. Installeer dependencies:
```bash
npm install
```

3. Start de development server:
```bash
npm run dev
```

4. Open je browser op `http://localhost:5173`

## GitHub OAuth Setup (Optioneel)

Voor productie gebruik kun je een GitHub OAuth App aanmaken:

1. Ga naar GitHub Settings → Developer settings → OAuth Apps
2. Klik "New OAuth App"
3. Vul in:
   - **Application name**: Winter Tennis
   - **Homepage URL**: `https://jonnez.github.io/wintertennis`
   - **Authorization callback URL**: `https://jonnez.github.io/wintertennis/callback`
4. Kopieer de **Client ID**
5. Update `src/components/Auth/GitHubAuth.jsx` met je Client ID

**Voor development/testing**: Gebruik de "Login met Personal Access Token" optie in de app.

## Personal Access Token Setup

Voor eenvoudiger gebruik (zonder OAuth setup):

1. Ga naar GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klik "Generate new token (classic)"
3. Geef het token een naam (bijv. "Winter Tennis")
4. Selecteer scope: **`repo`** (Full control of private repositories)
5. Klik "Generate token"
6. Kopieer het token (bewaar het veilig!)
7. Log in via de app met "Login met Personal Access Token"

## Data Structuur

### Repository Branches

- `main` - Bevat de webapp code
- `2024`, `2025`, `2026`, etc. - Data branches voor elk seizoen

### Data Files (in seizoen branches)

```
data/
  players.json              # Lijst van alle spelers
  schedule-YYYY-MM-DD.json  # Planning per zondag
  results-YYYY-MM-DD.json   # Uitslagen per zondag
```

#### players.json
```json
{
  "players": [
    {
      "id": "uuid",
      "name": "Speler Naam",
      "frequency": "elke_week" | "even_weken" | "oneven_weken" | "invaller"
    }
  ]
}
```

#### schedule-YYYY-MM-DD.json
```json
{
  "date": "2025-01-12",
  "participants": ["player-id-1", "player-id-2", ...],
  "selectedSchema": "wit" | "geel" | "rood" | "groen" | "zwart",
  "cateringBy": "player-id"
}
```

#### results-YYYY-MM-DD.json
```json
{
  "date": "2025-01-12",
  "matches": [
    {
      "court": 1,
      "team1": {
        "players": ["player-id-1", "player-id-2"],
        "points": 2
      },
      "team2": {
        "players": ["player-id-3", "player-id-4"],
        "points": 0
      }
    }
  ]
}
```

## Demo Data

Het project bevat demo data in `demo-data.json`. Om deze data te gebruiken:

1. Maak een `2024` branch aan in je repository
2. Maak een `data/` directory
3. Kopieer de files uit `demo-data.json` naar de juiste locaties
4. De app zal deze data automatisch laden

## Gebruik

### 1. Spelers Tab
- Voeg spelers toe met hun naam en frequentie
- Bewerk of verwijder spelers
- Spelers kunnen niet verwijderd worden als ze in uitslagen voorkomen

### 2. Deelnemers Tab
- Selecteer een zondag uit de dropdown
- Kies 12 spelers voor die zondag
- Zie de ranking (1-12) gebaseerd op huidige stand
- Vink aan wie de catering verzorgt
- Het 🍴 icon toont hoe vaak iemand al catering heeft gedaan

### 3. Baanschema Tab
- Selecteer een zondag
- Gooi de dobbelsteen voor een random schema
- Of kies handmatig een van de 5 schema's (wit, geel, rood, groen, zwart)
- Elk schema heeft een eigen kleur en pairing
- Sla het gekozen schema op

### 4. Uitslag Tab
- Selecteer een zondag
- Het baanschema wordt automatisch geladen
- Voer punten in (0, 1, of 2) per team
- Totaal per wedstrijd moet 2 zijn (0-2, 1-1, of 2-0)
- Sla de uitslagen op

### 5. Stand Tab
- Bekijk de rankings van alle spelers
- Gesorteerd op gemiddelde punten per wedstrijd
- Spelers die ≥50% van max wedstrijden hebben gespeeld worden **vetgedrukt**

## Baanschema's

De app gebruikt 5 voorgedefinieerde schema's voor 12 spelers op 3 banen:

### Wit (1)
- Baan 1: #1-#4 tegen #2-#3
- Baan 2: #5-#12 tegen #7-#10
- Baan 3: #6-#11 tegen #8-#9

### Geel (2)
- Baan 1: #1-#12 tegen #2-#10
- Baan 2: #3-#11 tegen #4-#8
- Baan 3: #5-#9 tegen #6-#7

### Rood (3)
- Baan 1: #1-#8 tegen #3-#6
- Baan 2: #2-#7 tegen #4-#5
- Baan 3: #9-#12 tegen #10-#11

### Groen (4)
- Baan 1: #1-#10 tegen #4-#7
- Baan 2: #2-#11 tegen #5-#8
- Baan 3: #3-#12 tegen #6-#9

### Zwart (5)
- Baan 1: #1-#9 tegen #3-#7
- Baan 2: #2-#12 tegen #6-#8
- Baan 3: #4-#11 tegen #5-#10

*De nummers verwijzen naar de ranking positie van spelers op basis van hun huidige stand.*

## Deployment naar GitHub Pages

1. Build de productie versie:
```bash
npm run build
```

2. De output staat in de `dist/` folder

3. Deploy naar GitHub Pages:
```bash
# Voeg dist folder toe aan git (normaal ignored)
git add -f dist

# Commit de build
git commit -m "Add build for GitHub Pages"

# Push de dist subfolder naar gh-pages branch
git subtree push --prefix dist origin gh-pages
```

4. Activeer GitHub Pages in repository settings:
   - Ga naar Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `/(root)`
   - Save

5. Je site is nu live op `https://jonnez.github.io/wintertennis`

## Ontwikkeling

### Project Structuur

```
src/
  components/
    Auth/           # Authenticatie componenten
    Layout/         # App layout en navigatie
    Deelnemers/     # Deelnemers selectie
    Baanschema/     # Baanschema generator
    Uitslag/        # Uitslag invoer
    Spelers/        # Spelers beheer
    Stand/          # Rankings weergave
  services/
    github.js       # GitHub API integratie
    dateUtils.js    # Datum helpers
    rankingUtils.js # Ranking berekeningen
    schemaGenerator.js # Baanschema logica
  hooks/
    useGitHub.js    # GitHub data hook
    useSundays.js   # Datum selectie hooks
```

### Belangrijke Functies

- **GitHub API**: Alle CRUD operaties via GitHub REST API
- **Caching**: Resultaten worden gecached om API rate limits te vermijden
- **Validatie**: Input validatie voor punten en deelnemers
- **Responsive**: Werkt op desktop, tablet en mobiel

## Troubleshooting

### "403 Forbidden" bij API calls
- Controleer of je token geldig is
- Controleer of je token `repo` scope heeft
- Check GitHub rate limits (60 requests/hour zonder auth)

### Data wordt niet opgeslagen
- Controleer of de juiste branch bestaat (bijv. `2024`)
- Controleer browser console voor errors
- Controleer of je schrijfrechten hebt op de repository

### App laadt niet
- Controleer of alle dependencies geïnstalleerd zijn (`npm install`)
- Controleer browser console voor JavaScript errors
- Clear browser cache en herlaad

## Licentie

MIT License - zie LICENSE file voor details

## Auteur

Gemaakt voor de Winter Tennis groep

## Bijdragen

Pull requests zijn welkom! Voor grote wijzigingen, open eerst een issue om te bespreken wat je wilt veranderen.
