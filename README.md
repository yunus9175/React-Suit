# React Suite – Todo, Shopping, Calculator

A multi-feature React + TypeScript app built with Vite. It includes:

- Todo App: add, edit, complete/undo, delete with validation and styling
- Calculator: animated, responsive calculator with error feedback
- Shopping: product grid, cart with increment/decrement/remove/clear using Redux Toolkit
- Navbar: sticky, theme toggle (light/dark), mobile hamburger, cart badge with item count

## Demo features

- Cart badge on top: shows total items; click to open the Cart page
- Routes: `/` (Todo), `/calculator`, `/shopping`, `/cart`
- Mobile responsive with hamburger menu and reduced-motion support

## Tech stack

- React 19, TypeScript, React Router, Redux Toolkit, React Redux
- Vite with code splitting, vendor chunking, gzip + brotli compression

## Getting started

```bash
npm install
npm run dev        # start dev server
npm run build      # production build (minified + compressed)
npm run preview    # preview production build
```

## Project structure

```
src/
  common/
    components/
      Todo/
      Calculator/
      Shopping/
    slice/
      cartSlice.ts
      todoSlice.ts
      counterSlice.ts
    store/
      index.ts
```

## Key implementation details

- Redux slices: `todoSlice` and `cartSlice` power the Todo and Shopping features
- Cart UX: sticky sidebar on desktop, full page at `/cart` with slide-in animation
- Performance: lazy-loaded routes, lazy images, compression, minified vendor chunk
- Theming: `data-theme` attribute with CSS variables; toggle persisted to localStorage

## Customization

- Change title and favicon in `index.html` and `public/favicon.svg`
- Update products in `src/common/components/Shopping/index.tsx`
- Adjust styles in `src/index.css` (navbar, calculator, cart, responsive breakpoints)

## Notes

- To deploy with compression, ensure your host serves `.br`/`.gz` files (Vite generates them)
- If Lighthouse reports bfcache issues, verify no `beforeunload` listeners or non-cacheable headers