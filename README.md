# General Aspect Prototype

Static HTML prototype for validating the visual direction before building the WordPress theme.
This version uses the exported `Frames` as layout reference and the real logo/cursor assets.

## Local Preview

Open:

```txt
http://localhost:4173/
```

The current local server is serving this folder:

```txt
/Users/aerolab/Documents/Codex/General Aspects/prototype
```

## WordPress Mapping

- `index.html` -> front page template.
- `work.html` -> project index template.
- `about.html` -> about template.
- `contact.html` -> contact template.
- `project-akaba.html` / `project-parking-pizza.html` -> single project templates.
- `assets/css/styles.css` -> theme stylesheet source.
- `assets/js/main.js` -> theme interaction source.
- `assets/images/` -> optimized preview assets from the Figma extraction.

Suggested CMS structure:

- Custom post type: `project`.
- ACF fields: location, year, category, hero image, gallery, description, services, order.
- Flexible sections for Home: hero, intro statement, selected projects, studio block, process, contact band.

The custom cursor is implemented in CSS/JS as a black vertical rectangle matching the logo mark.
