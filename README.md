# shmsathish.github.io

Personal site of Shyam Sathish Kumar. Plain HTML, CSS and a little JavaScript, hosted on GitHub Pages at https://shmsathish.site (custom domain, set by the CNAME file).

## Preview locally

```sh
cd ~/shmsathish.github.io
python3 -m http.server 8000
```

Then open http://localhost:8000. Press Ctrl+C to stop the server.

## Add photos

Images live in `assets/images/`.

| File | Used for | Suggested size |
| --- | --- | --- |
| `glider.jpg` | Underwater glider card (see the comment above that card in `index.html`) | 1200×750 |
| `handwriting-robot.jpg` | Handwriting robots card (already in place) | square |
| `og-image.jpg` | Link preview on LinkedIn, WhatsApp etc. (already in place) | exactly 1200×630 |

Keep each image under about 300 KB so the page stays fast (https://squoosh.app is free and works well).

## CV

Put your CV at `assets/cv.pdf`, then in `index.html` remove `hidden` from the "Download CV" button.

## Publish a change

```sh
git add .
git commit -m "Describe the change"
git push
```

GitHub Pages updates the live site within a minute or two.
