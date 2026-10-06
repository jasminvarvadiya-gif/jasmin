# Jasmin Varvadiya — Animated Portfolio

This is the latest revised portfolio source: HTML, CSS, JavaScript, local fonts,
project images, portrait, resume, GSAP, ScrollTrigger, SplitText and Lenis.

## Run locally
1. Extract the entire ZIP.
2. Open the jasmin-portfolio folder in VS Code.
3. Use Live Server on index.html.

Alternatively, run `python -m http.server 8000` inside the jasmin-portfolio
folder, then open http://localhost:8000 in your browser.

No npm install or build step is required.

## Folder structure
```
jasmin-portfolio/
  index.html            page markup, text, links
  css/
    style.css           colors, layout, responsive styles
    fonts.css           Manrope @font-face rules
  js/
    app.js              animations and project-switching data
  assets/
    img/                portrait and project screenshots
    fonts/              Manrope .ttf files
    js/                 GSAP, ScrollTrigger, SplitText, Lenis
    docs/               resume.pdf
```

## Edit
- index.html: text, sections, contact details and links.
- css/style.css: colors, layouts, typography and responsive styling.
- js/app.js: animations and project-switching data.
- assets/: images, fonts, animation libraries and resume.

When editing projects, update their cards in index.html and the projects array
in js/app.js. Keep all asset paths relative and preserve the folder structure.

## Deploy
Upload index.html, css/, js/ and assets/ together to a static host.
The directory containing index.html is the website root. There is no backend.
Contact links open the visitor's email application; they do not send emails
from a server. The resume button downloads assets/docs/resume.pdf.

## Included effects
Shrinking header name, rolling and scattered text, smooth scrolling, pinned
services and blue transition, project card rotation, and 3D contact words.
Reduced-motion preferences are supported. Mobile layouts adapt the pinned
services into normal sections.

## Notes
Uses Jasmin's content from the supplied portfolio. The reference's custom
font is approximated with Manrope. This is a recreation, not the original
reference site's source. Browser animation verification remains incomplete.
Third-party libraries retain their embedded copyright and license notices.
