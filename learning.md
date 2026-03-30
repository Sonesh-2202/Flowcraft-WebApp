# FlowCraft — Learning Guide

## Tech Stack & Why

### React — The UI Framework
React is a JavaScript library (by Meta) for building user interfaces out of **components** — small, reusable, self-contained pieces of UI. Think of it like LEGO blocks: you build a `<Sidebar>` component, a `<Canvas>` component, a `<Toolbar>` component, and React assembles them into your app.

**Why React?**
- **Component model** — Perfect for a flowchart app where we need a sidebar, canvas, toolbar, and properties panel all working independently but sharing state
- **Massive ecosystem** — The `reactflow` library (our flowchart engine) is React-native, so it integrates seamlessly
- **Virtual DOM** — React only re-renders what changed, which matters when dragging nodes at 60fps

**Why not Angular?** Angular is heavier, more opinionated, and `reactflow` doesn't have an Angular port — we'd have to use a lesser library.

**Why not React Native?** React Native is for **mobile apps** (iOS/Android). We're building a **web app** that runs in a browser.

### Vite — The Build Tool
Vite (French for "fast") is a modern build tool that:
- Starts the dev server in **milliseconds** (vs. 30+ seconds with Webpack/CRA)
- Uses native ES modules in development — no bundling needed during dev
- Hot Module Replacement (HMR) — when you edit a file, only that component updates in the browser, no full reload

**Why Vite over Create React App (CRA)?** CRA is officially deprecated. Vite is the recommended tool by the React team itself now.

---

## Libraries We Need

| Library | Purpose | Why This One? |
|---------|---------|---------------|
| **@xyflow/react** | Drag-and-drop flowchart canvas with nodes, edges, handles | The gold-standard React flowchart library (formerly `reactflow`). Handles panning, zooming, connecting, drag-drop, and now **NodeResizing** out of the box |
| **html-to-image** | Export canvas → PNG image | Lighter and more reliable than `html2canvas` for React DOM elements. Captures the exact DOM as a pixel-perfect image |
| **docx** | Generate Word (.docx) files | Pure JS, no server needed. We'll embed the flowchart PNG into a Word document |
| **pptxgenjs** | Generate PowerPoint (.pptx) files | Pure JS, generates real .pptx files with slides. We'll embed the flowchart as an image on a slide |
| **@fontsource/inter** | Premium font | The Inter typeface, so our app doesn't rely on system fonts |

---

## Terminal Commands Explained

### Step 1 — Verify Node.js is installed
```bash
node --version
```
> This checks if Node.js is on your system. You need **v18+**. Node.js is the JavaScript runtime that lets us run JS outside the browser — it powers our dev server and build tools.

### Step 2 — Scaffold the project with Vite + React
```bash
npm create vite@latest ./ -- --template react
```
> `npm create vite@latest` runs the Vite project scaffolder.
> `./` means "create the project in the current directory."
> `--template react` tells Vite to set up a React project with JSX support.

### Step 3 — Install base dependencies
```bash
npm install
```
> This reads `package.json` (created by Vite) and downloads all base dependencies (React, ReactDOM, Vite itself) into a `node_modules` folder.

### Step 4 — Install our specific libraries
```bash
npm install @xyflow/react html-to-image docx file-saver pptxgenjs @fontsource/inter
```
> This installs all 6 libraries we listed above. npm fetches them from the npm registry and adds them to `package.json`.

---

## Folder Structure

```
Flowchart-Generator/
├── index.html                  ← Entry HTML file (Vite serves this)
├── package.json                ← Project config + dependency list
├── vite.config.js              ← Vite configuration
├── public/                     ← Static assets (favicon, etc.)
├── src/
│   ├── main.jsx                ← React entry point (mounts <App/> to DOM)
│   ├── App.jsx                 ← Root component — assembles all panels
│   ├── App.css                 ← Global styles + CSS variables
│   ├── index.css               ← Base reset styles + font imports
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── FlowCanvas.jsx  ← The ReactFlow canvas (core drag-drop area)
│   │   │   └── FlowCanvas.css  ← Canvas-specific styles
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx     ← Left panel: draggable node palette
│   │   │   └── Sidebar.css     ← Sidebar styles
│   │   ├── Toolbar/
│   │   │   ├── Toolbar.jsx     ← Top bar: undo/redo/zoom/export buttons
│   │   │   └── Toolbar.css     ← Toolbar styles
│   │   ├── PropertiesPanel/
│   │   │   ├── PropertiesPanel.jsx  ← Right panel: edit selected node props
│   │   │   └── PropertiesPanel.css  ← Properties panel styles
│   │   └── Nodes/
│   │       ├── RectangleNode.jsx    ← Custom rectangle (process) node
│   │       ├── DiamondNode.jsx      ← Custom diamond (decision) node
│   │       ├── CircleNode.jsx       ← Custom circle (start/end) node
│   │       ├── ParallelogramNode.jsx← Custom parallelogram (I/O) node
│   │       ├── CloudNode.jsx        ← Custom cloud shape node
│   │       ├── DatabaseNode.jsx     ← Custom database cylinder node
│   │       ├── ArrowNode.jsx        ← Custom rotatable standalone pointer 
│   │       ├── LineNode.jsx         ← Custom drag-and-drop edge style lines 
│   │       ├── ImageNode.jsx        ← Custom local image upload blocks
│   │       ├── nodeTypes.jsx        ← Registry mapping type names → components
│   │       └── Nodes.css            ← Shared node styling
│   ├── hooks/
│   │   └── useUndoRedo.js      ← Custom hook for undo/redo state history
│   ├── utils/
│   │   └── exportUtils.js      ← PNG/DOCX/PPTX export logic
│   └── store/
│       └── flowStore.js        ← Centralized state (nodes, edges, selection)
```

### Key Architectural Decisions:
- **Each component gets its own folder** with a `.jsx` + `.css` pair — keeps styles scoped and files small
- **Custom nodes are separated** — each shape has its own component for clean SVG rendering
- **`flowStore.js`** — We use React's `useReducer` + Context to share state between panels
- **`useUndoRedo.js`** — A custom hook that snapshots state on every change and lets you step back/forward
- **`exportUtils.js`** — All export logic in one utility file, keeps components clean
