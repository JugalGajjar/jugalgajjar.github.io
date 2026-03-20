# Jugal Gajjar - Personal Portfolio

A retro Super Mario Bros-themed personal portfolio website!

**Live Site:** [jugalgajjar.github.io](https://jugalgajjar.github.io)

---

## Theme & Design

The portfolio features a **Super Mario Bros NES-inspired** aesthetic:

- **Pixel-perfect background scene** - Hand-drawn CSS pixel art: brick ground (SVG tiles), green pipes (hard-stop color bands), clouds with faces, green hills with spots, bouncing question blocks, and floating coins
- **NES HUD score bar** - Name, visitor count (coin counter), world indicator, and real-time clock
- **Press Start 2P pixel font** throughout with lighter weight body text for readability
- **Game UI panels** - Dark content panels with gold borders, traffic light window controls (close/minimize/fullscreen), and Finder-style navigation
- **Interactive animations** - Scroll reveal, coin burst on button clicks, cloud/block hover effects, startup screen, and floating coin particles
- **Key term highlighting** - Important facts highlighted in bluish-white for readability
- **Fully responsive** - Single-column on mobile with hamburger menu

---

## Features

### Mario - AI Portfolio Chatbot

A `?` block chatbot named **Mario** that answers any question about Jugal's portfolio:

- **Powered by Groq LLaMA 3.1 8B** via a Cloudflare Worker proxy
- **Strict portfolio-only enforcement** - Only answers questions about Jugal's work
- **Conversation memory** - Maintains context for natural follow-ups
- **Offline fallback** - TF-IDF keyword-matching chatbot if the API is unavailable

### Content Pages

| Page | Description |
|------|-------------|
| **Home** | Hero section, about summary, recent projects, publications, experiences, contact |
| **Projects** | All projects in 2-column grid with descriptions, technologies, and links |
| **Publications** | All publications grouped by type (Conference, Preprints, Journal) in 2-column cards |
| **Experiences** | Professional roles with detailed bullet points |
| **About** | 6 facets cards, professional background, and personal journey |
| **Contact** | 5 contact cards (Email, LinkedIn, Medium, GitHub, Google Scholar) |
| **Resume/CV** | Quick overview with embedded PDF viewer and download |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Font | Press Start 2P (Google Fonts) |
| Pixel Art | Hand-drawn CSS `box-shadow` sprites, inline SVG tiles |
| Chatbot LLM | Groq API (LLaMA 3.1 8B Instant) |
| API Proxy | Cloudflare Workers (serverless, free tier) |
| Chatbot Fallback | Client-side TF-IDF retrieval engine |
| Hosting | GitHub Pages |

---

## Architecture

```
User visits jugalgajjar.github.io
    │
    ├── Static site served by GitHub Pages
    │     │
    │     ├── Mario theme (CSS pixel art, animations)
    │     ├── Content pages (HTML)
    │     └── chatbot.js (frontend)
    │
    └── User asks Mario a question
          │
          ├── chatbot.js sends POST to Cloudflare Worker
          │                    │
          │                    ├── Calls Groq API (LLaMA 3.1 8B)
          │                    └── Returns answer
          │
          └── If worker unavailable → TF-IDF fallback (offline)
```

---

## Contact

- Email: [jugal.gajjar@gwu.edu](mailto:jugal.gajjar@gwu.edu)
- LinkedIn: [linkedin.com/in/jugalgajjar](https://www.linkedin.com/in/jugalgajjar/)
- GitHub: [github.com/JugalGajjar](https://github.com/JugalGajjar)

---

&copy; 2025 Jugal Gajjar. All rights reserved.