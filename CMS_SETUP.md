# Netlify + Decap CMS Setup

## What is ready

- Admin panel: `/admin/`
- Decap CMS config: `admin/config.yml`
- Student source files: `data/students/*.json`
- Generated student file for website: `data/students.json`
- Build script: `scripts/build-data.mjs`
- Netlify build config: `netlify.toml`

## How student data works

Each student is edited as a separate JSON file inside:

```text
data/students/
```

Example:

```text
data/students/adib1.json
```

During Netlify deploy, this command runs:

```text
npm run build
```

It combines all student files into:

```text
data/students.json
```

The website reads `data/students.json`.

## Netlify setup

1. Push this full project to GitHub.
2. In Netlify, create a new site from that GitHub repository.
3. Netlify should detect `netlify.toml`.
4. Build command should be:

```text
npm run build
```

5. Publish directory should be:

```text
.
```

6. Enable Identity in Netlify.
7. Enable Git Gateway in Identity services.
8. Invite your email from Identity users.
9. Open:

```text
https://your-site.netlify.app/admin/
```

## Upload paths

Student uploads go to:

```text
assets/uploads/students/student-id/
```

General uploads go to:

```text
assets/uploads/
```

## Important note about exact PDF names

The CMS keeps upload links in each student JSON file. The website uses those links directly.

If you need generated copies with exact names like:

```text
pdfs/adib1-11-ct1.pdf
```

that can be added in the build script later, but the current setup already supports PDF upload and display from the admin panel.
