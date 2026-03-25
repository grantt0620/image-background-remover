# Image Background Remover

Free AI-powered image background remover built with Next.js, Tailwind CSS, and Remove.bg API.

## Features

- 🖼️ Upload JPG, PNG, WEBP (max 10MB)
- ✂️ AI background removal via Remove.bg
- 👁️ Live preview with background color toggle
- ⬇️ Download transparent PNG
- 🚀 Edge runtime (Cloudflare Workers compatible)
- 🔒 No storage — images processed in memory only

## Setup

1. Clone and install:
```bash
npm install
```

2. Get Remove.bg API key:
   - Sign up at https://remove.bg/api
   - Copy your API key

3. Create `.env.local`:
```bash
cp .env.local.example .env.local
# Edit .env.local and add your key
```

4. Run dev server:
```bash
npm run dev
```

5. Open http://localhost:3000

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Set environment variable: `REMOVE_BG_API_KEY`
4. Deploy

## License

MIT
