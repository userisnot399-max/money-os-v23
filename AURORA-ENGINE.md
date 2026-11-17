# Money OS V23.1 — Aurora experience

## Architecture

- `src/components/AuroraCanvas.jsx` owns one persistent WebGL canvas at the application root. Its fragment shader draws layered, noise-distorted aurora ribbons in emerald, cyan, violet and magenta. It is not remounted during route changes.
- `src/components/CinematicIntro.jsx` runs a short first-visit brand reveal and exposes a Skip control. Completion is remembered in local storage so repeat visits enter immediately.
- `src/components/Icon.jsx` provides consistent inline SVG navigation and transaction glyphs. Income uses an upward-right arrow, expenses a downward-right arrow, and transfers use a two-way exchange glyph.
- `src/styles.css` contains the shared dark-glass material, responsive layouts, focus states, route transitions and intro choreography.
- `src/App.jsx` continues to own the existing Money OS screens, Supabase authentication, local cache and `personal_state` sync logic.

## Rendering and performance safeguards

- The renderer requests WebGL with `powerPreference: low-power` and caps device-pixel ratio (1.15 on narrow screens, 1.5 elsewhere) to limit fill-rate cost.
- The animation pauses drawing while the document is hidden and observes canvas size changes with `ResizeObserver`.
- `prefers-reduced-motion` freezes the shader and disables the cinematic/route motion.
- A static CSS aurora backdrop remains available if WebGL cannot be created or the shader cannot compile.
- The canvas is a single fixed root layer, so navigation does not reset the aurora.

## Deployment notes

This is a source update for the existing V23 Netlify site. Preserve `public/config.js` and the current Supabase project values. Do not replace the V22 site or change Supabase's Site URL during this visual update. Netlify should rebuild from the connected Git repository using:

- Build command: `npm run build`
- Publish directory: `dist`
- Node: 20.19+ (Node 22 recommended)

## Verification status

The JSX/JavaScript source was transpiled for syntax validation. A full Vite production build and physical iPhone/Android frame-rate test were not completed in this environment; verify the deploy preview on real devices before promoting it.
