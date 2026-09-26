# Ladies Living Legacy — Event Website

A one-page static event site. It uses plain HTML, CSS and JavaScript, with no build step and no backend, and it works on GitHub Pages.

```
/
├── index.html          ← page content (days, FAQ, text)
├── style.css           ← all styling (colours in :root at the top)
├── script.js           ← EVENT_CONFIG at the top (form URL, dates, contacts)
├── .nojekyll           ← tells GitHub Pages to serve files as-is
├── README.md
└── assets/
    ├── images/
    │   └── logo.svg    ← placeholder emblem, replace with your logo
    └── icons/          ← (icons are built into index.html as an SVG sprite)
```

## 1. Add your Google Form (one place only)

Open `script.js`. At the very top, find:

```js
googleFormUrl: "PASTE_GOOGLE_FORM_URL_HERE",
```

1. In Google Forms click **Send**, then click the link icon 🔗.
2. **Untick "Shorten URL"** and copy the long link (`https://docs.google.com/forms/d/e/.../viewform`).
3. Paste it between the quotes.

After that:
- every **Register** / **Book your spot** button opens the form in a new tab
- the form is embedded automatically in the **Save your place** section.

Optional: `googleFormEmbedUrl` lets you embed a different address. Replace `YOUR_GOOGLE_FORM_EMBED_URL` with the `src="..."` value from Send → `< >`. Set it to `""` if you don't want the form embedded.

## 2. Change event details

These are all in `EVENT_CONFIG` in `script.js`: name, dates, venue, location, fee and email.
The countdown uses `startDate` (format `YYYY-MM-DD`).

To change the day-by-day program, FAQ answers or longer paragraphs, edit `index.html`. Each section is marked with a comment banner. The sunrise timeline is built automatically from the day list.

To change colours and fonts, edit the variables in `:root` at the top of `style.css`.

## 3. Replace images

- **Logo:** overwrite `assets/images/logo.svg` with your file under the same name. If your logo is a PNG, save it as `assets/images/logo.png` and change `src="assets/images/logo.svg"` in `index.html` (the hero `<img>` and the `<link rel="icon">`). A square image works best, because it is shown as a circle.
- **Social share image (optional):** add a 1200×630 `assets/images/og-image.jpg`, then uncomment the `og:image` and `og:url` lines in the `<head>` of `index.html` and fill in your GitHub Pages address.
- File names are case-sensitive on GitHub Pages: `Logo.PNG` is not the same as `logo.png`.

## 4. Publish on GitHub Pages

1. Create a new **public** repository on github.com (e.g. `ladies-living-legacy`).
2. Click **Add file → Upload files** and drag in everything from this folder, **including** `assets/` and `.nojekyll`. Then **Commit**.
3. Go to **Settings → Pages**. Under "Build and deployment", set Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**, then **Save**.
4. After 1–2 minutes the site is live at `https://USERNAME.github.io/REPOSITORY/`.

All paths are relative, so no other configuration is needed.

## 5. Live-site checklist

- [ ] Page loads with no broken images (logo shows in the hero and the browser tab)
- [ ] The countdown shows the right number of days
- [ ] Header links scroll smoothly to The journey / Stay and fees / Good to know
- [ ] On a phone the ☰ button opens and closes the menu, and tapping a link closes it
- [ ] Clicking a numbered stop on the sunrise jumps to that day
- [ ] FAQ questions open and close
- [ ] Every Register button opens **your** Google Form, and the embedded form shows in "Save your place"
- [ ] Submit a test response and confirm it arrives in Google Forms
- [ ] The email link in the footer is correct
- [ ] No sideways scrolling on a phone (rotate to landscape too)
- [ ] Browser console (F12) shows no red errors
