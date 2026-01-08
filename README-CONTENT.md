# 🚀 Vollautomatisches Content Management

## Wie es funktioniert

### 1. Blog Post schreiben
```bash
# Erstelle eine neue Datei in content/blog/
content/blog/2024-07-05-dein-titel.md
```

**Frontmatter Template:**
```markdown
---
title: "Dein Titel"
country: "Thailand"
city: "Bangkok" 
date: "2024-07-05"
gallery: "thailand/bangkok"
tags: ["food", "travel"]
featured: true
---

# Dein Content hier...
```

### 2. Bilder hochladen
```bash
# Kopiere Bilder in entsprechende Ordner
content/gallery/thailand/bangkok/foto1.jpg
content/gallery/thailand/bangkok/foto2.jpg
```

### 3. Fertig!
```bash
git add .
git commit -m "Neuer Blog Post: Thailand Adventures"
git push
```

## Was automatisch passiert

✅ **GitHub Actions** zählt Posts und Bilder  
✅ **Weltkarte** zeigt automatisch aktualisierte Zahlen  
✅ **Popup** zeigt: "12 Posts • 48 Bilder"  
✅ **Blog Index** wird generiert  
✅ **Gallery Index** wird erstellt  

## Manuelle Updates (optional)

```bash
# Statistiken lokal testen
npm run update-content

# Oder direkt:
node scripts/generate-content-stats.js
```

## Ordnerstruktur

```
content/
├── blog/
│   ├── 2024-01-15-bangkok-street-food.md
│   └── 2024-02-01-medellin-nomad.md
├── gallery/
│   ├── thailand/
│   │   └── bangkok/
│   │       ├── foto1.jpg
│   │       └── foto2.jpg
│   └── colombia/
│       └── medellin/
│           └── city-view.jpg
└── data/ (auto-generiert)
    ├── countries.json
    ├── blog-index.json
    └── gallery-index.json
```

## 🎯 Workflow Summary

1. **Schreibe** Markdown-Datei
2. **Lade** Bilder hoch  
3. **Push** zu GitHub
4. **Fertig!** 🎉

Alles andere passiert automatisch!