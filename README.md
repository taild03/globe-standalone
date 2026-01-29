# Globe Standalone - Pure 3D Canvas

A standalone 3D Globe renderer built with React + Three.js + Vite.  
**Zero UI - Just the Globe.**

## Features

- 🌍 Pure 3D Earth with rotating globe
- 🎨 Animated flying arcs between cities
- 💡 Light pillars and wave effects
- 📦 Embeddable via iframe
- 🚀 Static hosting ready

## Technology Stack

- **React 18** - Minimal wrapper
- **Three.js 0.182** - 3D engine
- **GSAP** - Scale-in animation
- **TypeScript** - Type safety
- **Vite** - Build tool

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

## Production Build

```bash
npx vite build
```

Outputs to `dist/` folder (~1.16 MB).

## What's Included

### GlobeCanvas.tsx (50 lines)

**ONLY renders:**

- Single `<div>` container (100vw × 100vh)
- Three.js `World` instance mounted inside
- Background gradient

**NO UI elements:**

- ❌ No metrics cards
- ❌ No text overlays
- ❌ No SVG decorations
- ❌ No layout wrappers
- ❌ No sections

### App.tsx (9 lines)

```tsx
import GlobeCanvas from "./GlobeCanvas";

function App() {
  return <GlobeCanvas />;
}
```

That's it. Pure globe, nothing else.

## Project Structure

```
globe-standalone/
├── src/
│   ├── GlobeCanvas.tsx    # Pure canvas wrapper (50 lines)
│   ├── App.tsx            # Minimal root (9 lines)
│   ├── index.css          # Basic reset (18 lines)
│   ├── core/              # Three.js engine
│   │   ├── World.ts       # Main orchestrator
│   │   ├── Earth.ts       # Earth mesh & animations
│   │   ├── Basic.ts       # Scene, Camera, Renderer
│   │   ├── Resources.ts   # Texture loader
│   │   ├── Sizes.ts       # Resize handler
│   │   └── Data.ts        # Geographic data (cities)
│   ├── utils/             # Helper functions
│   │   ├── common.ts      # Mesh creators
│   │   ├── arc.ts         # Flying arc math
│   │   ├── LabelFactory.ts # Text labels (Canvas API)
│   │   ├── Assets.ts      # Texture paths
│   │   └── types.ts       # TypeScript types
│   ├── shaders/           # GLSL shaders
│   │   ├── earthVertex.ts
│   │   └── earthFragment.ts
│   └── assets/images/earth/  # 8 textures (1.15 MB)
├── dist/                  # Production build
└── package.json
```

## Configuration

### Geographic Data

Edit `src/core/Data.ts`:

```typescript
export default [
  {
    startArray: { name: "Hanoi", N: 21.0285, E: 105.8542 },
    endArray: [
      { name: "Seoul", N: 37.5665, E: 126.978 },
      { name: "Berlin", N: 52.52, E: 13.405 },
      // ... more cities
    ],
  },
];
```

### Globe Configuration

Edit `src/core/World.ts` Earth initialization:

```typescript
this.earth = new Earth({
  data: Data,
  dom: this.option.dom,
  textures: this.resources.textures,
  earth: {
    radius: 50, // Change globe size
    rotateSpeed: 0.002, // Rotation speed
    isRotation: true, // Auto-rotate
  },
  // ... more options
});
```

### Colors/Theme

Edit values in:

- `World.ts` - Configuration passed to Earth
- `GlobeCanvas.tsx` - Background gradient

## Embedding

### As Iframe

```html
<iframe
  src="https://your-deployment.pages.dev"
  width="800"
  height="600"
  frameborder="0"
  allow="accelerometer; gyroscope"
></iframe>
```

### As React Component

Copy `src/` directory into your project:

```tsx
import GlobeCanvas from "./path/to/GlobeCanvas";

function MyApp() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <GlobeCanvas />
    </div>
  );
}
```

## Deployment

### Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name=globe-3d
```

### Other Platforms

Upload `dist/` folder to:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static host

## Performance

- **Bundle Size:** ~822 KB (JS) + 1.15 MB (textures)
- **Gzipped:** ~235 KB (JS)
- **FPS:** 60fps on modern hardware
- **Initial Load:** Immediate (no lazy loading)

## Key Characteristics

### Pure Canvas Renderer

- ✅ Single `<div>` container
- ✅ No UI overlays
- ✅ No layout logic
- ✅ Embeddable anywhere
- ✅ iframe-friendly

### No Dependencies On

- ❌ Tailwind CSS
- ❌ React Router
- ❌ Scroll libraries
- ❌ UI component libraries
- ❌ Font libraries

### Immediate Initialization

- ❌ No lazy loading
- ❌ No IntersectionObserver delays
- ❌ No requestIdleCallback delays
- ✅ Globe starts on mount

## Build Output

```
dist/
├── index.html                   463 bytes
├── assets/
│   ├── index-DBELX5gi.css       0.31 KB (minimal reset)
│   ├── index-CQtISpsu.js        194.87 KB (React + app)
│   ├── World-ChKwWW07.js        627.30 KB (Three.js + Globe)
│   ├── earth-Dnn8xamy.jpg       1.05 MB
│   ├── glow-C3LQWEwD.png        30 KB
│   ├── redCircle-CMlqDPR-.png   43 KB
│   ├── label-Bw8EM3gb.png       13 KB
│   ├── gradient-VZaBwB1E.png    5.6 KB
│   └── light_column-BrWlWg-H.png 4.7 KB
```

**Total:** ~1.16 MB

## Use Cases

- Embeddable globe widget
- Dashboard visualization
- Iframe content
- Full-page globe experience
- Kiosk displays
- Interactive installations

## License

MIT

---

## What This Is NOT

- ❌ Not a UI library
- ❌ Not a section component
- ❌ Not a metrics dashboard
- ❌ Not a layout system

## What This IS

- ✅ Pure 3D globe renderer
- ✅ Embeddable canvas
- ✅ Standalone static app
- ✅ iframe-ready

**Goal:** Provide ONLY the globe. Nothing more.
