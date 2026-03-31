<div align="center">

<br />

# 🎨 FlowCraft — Flowchart Builder

**A dynamic, web-based flowchart and diagram builder application.**

<p align="center">
  <a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react&logoColor=white" alt="React 19" /></a>
  <a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/Vite-Lightning%20Fast-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://reactflow.dev/" target="_blank"><img src="https://img.shields.io/badge/React_Flow-Engine-FF0072.svg?style=for-the-badge&logo=react&logoColor=white" alt="React Flow" /></a>
  <a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" /></a>
</p>

*FlowCraft allows users to drag & drop nodes, naturally scale them using boundary resizers, customize their visual properties, connect them, and export diagrams seamlessly into various formats including Images, PowerPoint, and Word documents.*

<br />

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Architecture & Stack](#-architecture--stack)
- [🛠️ Build for Production](#-build-for-production)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

<table width="100%">
  <tr>
    <td width="50%">
      <h3>🖱️ Drag & Drop Workspace</h3>
      <p>Seamlessly map logic by dragging elements from the sidebar onto the infinitely panning canvas.</p>
    </td>
    <td width="50%">
      <h3>📐 Precision Scaling & Resizing</h3>
      <p>Every shape on the canvas comes with an 8-point drag handle box, allowing you to stretch and squash figures intuitively.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🎨 Customizable Nodes</h3>
      <p>Modify background colors, stroke colors, shapes, texts, font-families, and arbitrary rotation (0–360°) dynamically via a robust properties panel.</p>
    </td>
    <td>
      <h3>🧩 Versatile Node Shapes</h3>
      <p>Includes Process, Decision, Database, Cloud, Pointers, and standalone Arrow/Line shapes.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🖼️ Image Uploads</h3>
      <p>Native support for dragging an "Image" block into your flowchart and uploading local visuals right from your PC.</p>
    </td>
    <td>
      <h3>🌓 Dark & Light Mode</h3>
      <p>A sleek theme toggler ensures maximum accessibility in any environment.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>💾 Advanced Exporting</h3>
      <p>Export pristine diagrams directly to High-resolution <b>PNG</b>, <b>PPTX</b> (PowerPoint slides), and <b>DOCX</b> (Word Document).</p>
    </td>
    <td>
      <h3>⏰ History Management</h3>
      <p>Built-in Undo and Redo tracking via shortcuts (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Y</kbd>) to prevent accidental data loss.</p>
    </td>
  </tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

> [!NOTE]
> Ensure you have **Node.js** (v18 or higher recommended) installed on your machine. You will also need `npm` or `yarn`.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sonesh-2202/Flowcraft-WebApp.git
cd Flowcraft-WebApp
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

### 4️⃣ Open the App

Open your browser and navigate to the local URL provided in your terminal (usually `http://localhost:5173/`).

> [!TIP]
> **Pro Tip:** Start dragging nodes from the left panel onto the center canvas, stretch them using the resizers, edit properties in the right pane, and test the export functionality from the top toolbar!

---

## 🏗️ Architecture & Stack

| Technology | Purpose |
|:---|:---|
| <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" /> | UI framework with component-based architecture |
| <img src="https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E" /> | Lightning-fast build tool with HMR |
| **@xyflow/react** | Flowchart canvas engine (nodes, edges, zooming, panning) |
| **useReducer + Context** | Pure React-based global state management |
| **CSS Variables** | Dynamic styling with Native CSS, supporting Dark/Light mode |
| **html-to-image / docx / pptxgenjs** | Robust export engine ecosystem |

📚 *For a detailed breakdown of internal files and architecture, refer to our [CODEBASE_GUIDE.md](./CODEBASE_GUIDE.md)*

---

## 🛠️ Build for Production

```bash
npm run build
```

This bundles the optimized application into the `dist/` directory, ready to deploy to any static host like Vercel, Netlify, or GitHub Pages.

---

## 📂 Project Structure

<details>
<summary><b>Click to expand project tree</b></summary>

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
</details>

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork** the Project
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

<br />

<div align="center">
  <b>Built with ❤️ using React & Vite</b>
</div>