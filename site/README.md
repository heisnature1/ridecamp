# RideCamp homepage (static)

A dependency-free, static homepage in this folder. Its layout and sections follow the homepage of
https://www.spironet.com/: country picker, header navigation, hero, key-figures strip, product specs,
running-cost calculator, network filter, callback form and footer.

This is an original recreation, not a copy of that site:

- No HTML, CSS, JavaScript, images, fonts, logos or written copy were copied from the reference site.
  The hero artwork is an SVG drawn for this project, and the copy is written from scratch.
- The country list and dialling codes are public facts. The brand name, figures and locations are placeholder sample data.
- The contact form is a demo. It sends nothing until you connect it to a backend.

## Run it

There is no build step. Open `index.html` in a browser, or serve the folder:

```bash
cd site
python3 -m http.server 8080 --bind 0.0.0.0
```

Then visit http://localhost:8080.

## Files

| File          | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `index.html`  | Page structure and copy                                                  |
| `styles.css`  | Styling (responsive, respects reduced-motion preferences)               |
| `script.js`   | Country picker, savings calculator, network filter, count-up, form, nav |
| `favicon.svg` | Brand mark used as the favicon                                          |

## Customising

- **Brand and copy:** edit `index.html`.
- **Countries, locations and currencies:** edit the `CONFIG` block at the top of `script.js`.
- **Figures and specs:** edit the stats and spec blocks in `index.html`. The `data-count` attribute
  on each stat is the number the count-up animates to.
- **Callback form:** the submit handler in `script.js` is a placeholder. Send the number to your
  backend there before going live.
