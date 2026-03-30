import { useState, useCallback, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { exportPNG, exportDOCX, exportPPTX } from '../../utils/exportUtils';
import './Toolbar.css';

export default function Toolbar({ undo, redo, canUndo, canRedo, onClear, onDeleteSelected, theme, toggleTheme }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [showExport, setShowExport] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dropdownRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowExport(false);
      }
    }
    if (showExport) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showExport]);

  /* Keyboard shortcuts */
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        onDeleteSelected();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, onDeleteSelected]);

  /* Export handlers with loading state */
  const handleExport = useCallback(async (exportFn) => {
    setExporting(true);
    setShowExport(false);
    try {
      await exportFn();
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="toolbar" id="toolbar">
      {/* Undo / Redo */}
      <div className="toolbar-group">
        <button
          className="icon-btn"
          onClick={undo}
          disabled={!canUndo}
          data-tooltip="Undo (Ctrl+Z)"
          id="btn-undo"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button
          className="icon-btn"
          onClick={redo}
          disabled={!canRedo}
          data-tooltip="Redo (Ctrl+Y)"
          id="btn-redo"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
          </svg>
        </button>
      </div>

      <div className="divider" />

      {/* Zoom controls */}
      <div className="toolbar-group">
        <button
          className="icon-btn"
          onClick={() => zoomIn({ duration: 200 })}
          data-tooltip="Zoom In"
          id="btn-zoom-in"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          className="icon-btn"
          onClick={() => zoomOut({ duration: 200 })}
          data-tooltip="Zoom Out"
          id="btn-zoom-out"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          className="icon-btn"
          onClick={() => fitView({ padding: 0.2, duration: 300 })}
          data-tooltip="Fit to Screen"
          id="btn-fit-view"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </button>
      </div>

      <div className="divider" />

      {/* Delete selected */}
      <button
        className="icon-btn"
        onClick={onDeleteSelected}
        data-tooltip="Delete Selected (Del)"
        id="btn-delete-selected"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Theme Toggle */}
      <button
        className="icon-btn"
        onClick={toggleTheme}
        data-tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        id="btn-theme-toggle"
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Clear canvas */}
      <button
        className="icon-btn"
        onClick={onClear}
        data-tooltip="Clear Canvas"
        id="btn-clear"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      <div className="toolbar-spacer" />

      {/* Export dropdown */}
      <div className="export-dropdown-wrapper" ref={dropdownRef}>
        <button
          className="export-btn primary"
          onClick={() => setShowExport(!showExport)}
          disabled={exporting}
          id="btn-export"
        >
          {exporting ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          {exporting ? 'Exporting…' : 'Export'}
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showExport && (
          <div className="export-dropdown">
            <button
              className="export-dropdown-item"
              onClick={() => handleExport(exportPNG)}
              id="export-png"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Export as PNG
            </button>
            <button
              className="export-dropdown-item"
              onClick={() => handleExport(exportDOCX)}
              id="export-docx"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Export as Word
            </button>
            <button
              className="export-dropdown-item"
              onClick={() => handleExport(exportPPTX)}
              id="export-pptx"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Export as PowerPoint
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
