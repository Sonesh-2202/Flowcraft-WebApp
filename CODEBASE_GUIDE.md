# Codebase Guide

This document explains the architecture and file structure of the **FlowCraft** (Flowchart Generator) project. It will help you understand where different parts of the application reside and what they do.

## Project Structure Overview

```text
src/
├── components/          # Reusable React UI components
│   ├── Canvas/          # React Flow main canvas wrapper
│   ├── Nodes/           # Custom React Flow node components
│   ├── PropertiesPanel/ # Editor sidebar for node/edge settings
│   ├── Sidebar/         # Draggable palette of available nodes
│   └── Toolbar/         # Top action bar (Undo, Redo, Export, etc.)
├── hooks/               # Custom React hooks (e.g., useUndoRedo)
├── store/               # Global state management (useReducer + Context)
├── utils/               # Helper functions (e.g., export logic)
├── App.css              # Main application specific styles
├── App.jsx              # Main application layout orchestrator
├── index.css            # Global CSS styles and design system variables
└── main.jsx             # React entry point, context providers
```

## Detailed File Explanations

### 1. Application Core & Entry
* **`main.jsx`**: The entry point of the React app. It renders the `App` component into the DOM.
* **`App.jsx`**: The main layout wrapper. Usually sets up the `header` (Toolbar), `aside` (Sidebar, PropertiesPanel), and `main` content area (Canvas).
* **`App.css` & `index.css`**: Defines global layout behavior, fonts, utility classes, and custom css variables for the overall look and feel.

### 2. Global State (`src/store/`)
* **`flowStore.jsx`**: Uses **React Context and `useReducer`** to manage the global state of the application.
  * **What it does**: It stores the current `nodes` and `edges` on the canvas, handles Theme (Light/Dark mode) in tandem with App.jsx. It provides functions to add nodes, connect nodes, update properties (colors, text, labels, etc.), scale properties via ReactFlow Resizers, and clear the canvas.
  * **What to do with it**: Whenever you need to add a new global action (like a new keyboard shortcut that affects the whole canvas), define the state updater here.

### 3. Components (`src/components/`)
* **`Canvas/` (`FlowCanvas.jsx` & `.css`)**: The central workspace area utilizing `@xyflow/react` (React Flow).
  * **What it does**: Handles the rendering of nodes and edges, captures drop events from the sidebar, and manages the interactive zoom/pan canvas.
  * **What to do with it**: Edit this if you want to change the grid background, add minimaps, or manage keypress events on the canvas itself.

* **`Sidebar/` (`Sidebar.jsx` & `.css`)**: The left-hand panel.
  * **What it does**: Lists draggable node types (e.g., Input, Process, Database) using the HTML Drag and Drop API.
  * **What to do with it**: Append new items here when you create new custom node shapes that the user will need to drag onto the canvas.

* **`PropertiesPanel/` (`PropertiesPanel.jsx` & `.css`)**: The right-hand panel.
  * **What it does**: Inspects the currently selected node or edge and allows the user to change attributes (Color, Background, Stroke width, Font size, Rotation).
  * **What to do with it**: If you add a new property to a node (like "shadow intensity"), add a slider or input for it in here to allow user interaction.

* **`Nodes/`**: The customized SVG shapes.
  * **Files**: `CircleNode.jsx`, `CloudNode.jsx`, `DatabaseNode.jsx`, `DiamondNode.jsx`, `ParallelogramNode.jsx`, `RectangleNode.jsx`, `ArrowNode.jsx`, `LineNode.jsx`, `ImageNode.jsx`, `nodeTypes.jsx`.
  * **What they do**: Define how individual nodes look using inline CSS/SVGs, and utilize `@xyflow/react`'s `<NodeResizer />` to permit user 8-point scaling! `nodeTypes.jsx` maps these custom files to string names that React Flow expects.
  * **What to do with it**: To create a "Hexagon" node, you would create `HexagonNode.jsx` here, style it, inject the `<NodeResizer />`, add handles, and register it inside `nodeTypes.jsx`.

* **`Toolbar/` (`Toolbar.jsx` & `.css`)**: The top action bar.
  * **What it does**: Holds global action buttons (Clear workspace, Zoom controls, Export buttons).
  * **What to do with it**: Add actions here that apply to the whole file/canvas without needing a specific node selected.

### 4. Hooks (`src/hooks/`)
* **`useUndoRedo.js`**: 
  * **What it does**: A custom hook that captures snapshots of the `flowStore` state. It allows the user to traverse back and forth through changes.
  * **What to do with it**: Generally, you shouldn't need to touch this unless you need to optimize memory usage by limiting the history stack size.

### 5. Utilities (`src/utils/`)
* **`exportUtils.js`**: 
  * **What it does**: Houses logic mapping canvas state into exportable files (JSON save states, PPTX using `pptxgenjs`, DOCX, Image using native `html-to-image` rendering engine).
  * **What to do with it**: Edit this file if you want to support exporting to a new format like PDF.

---
## How to Contribute or Modify
1. **Adding a Shape**: Create the node in `components/Nodes`, register it in `nodeTypes.jsx`, and add a drag handle for it in `components/Sidebar`.
2. **Adding a Detail property (e.g., Text align)**: Add the UI selector in `PropertiesPanel.jsx`, dispatch an update to `flowStore.jsx`.
3. **Adding a new Output format**: Write the converter in `exportUtils.js` and add a button calling it inside `Toolbar.jsx`.
