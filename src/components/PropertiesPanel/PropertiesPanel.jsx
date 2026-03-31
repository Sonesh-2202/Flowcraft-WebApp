import { useCallback, useMemo } from 'react';
import { useFlowState, useFlowDispatch } from '../../store/flowStore';
import './PropertiesPanel.css';

const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
];

const FONT_SIZES = [10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32];

const EDGE_TYPES = [
  { id: 'default', label: 'Bezier' },
  { id: 'straight', label: 'Straight' },
  { id: 'step', label: 'Step' },
  { id: 'smoothstep', label: 'Smooth Step' },
];

const ARROW_STYLES = [
  { id: 'closed', label: 'Filled Arrow' },
  { id: 'open', label: 'Open Arrow' },
  { id: 'none', label: 'No Arrow' },
];

const STROKE_WIDTHS = [1, 1.5, 2, 2.5, 3, 4, 5];

export default function PropertiesPanel({ activeEdgeType }) {
  const { nodes, edges, selectedNodeId, selectedEdgeId } = useFlowState();
  const dispatch = useFlowDispatch();

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId),
    [edges, selectedEdgeId]
  );

  const updateNodeData = useCallback(
    (key, value) => {
      if (!selectedNode) return;
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          id: selectedNode.id,
          updates: {
            data: { ...selectedNode.data, [key]: value },
          },
        },
      });
    },
    [dispatch, selectedNode]
  );

  const updateEdge = useCallback(
    (updates) => {
      if (!selectedEdge) return;
      dispatch({
        type: 'UPDATE_EDGE',
        payload: { id: selectedEdge.id, updates },
      });
    },
    [dispatch, selectedEdge]
  );

  const deleteSelected = useCallback(() => {
    if (selectedNodeId) {
      dispatch({ type: 'DELETE_NODE', payload: selectedNodeId });
    } else if (selectedEdgeId) {
      dispatch({ type: 'DELETE_EDGE', payload: selectedEdgeId });
    }
  }, [dispatch, selectedNodeId, selectedEdgeId]);

  /* ── Empty state ── */
  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="properties-panel" id="properties-panel">
        <div className="properties-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Properties
        </div>
        <div className="properties-empty">
          <svg className="properties-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <div className="properties-empty-text">
            Select a node or edge to view and edit its properties.
          </div>
        </div>
      </aside>
    );
  }

  /* ── Edge selected ── */
  if (selectedEdge) {
    const edgeColor = selectedEdge.style?.stroke || '#94a3b8';
    const edgeStrokeWidth = selectedEdge.style?.strokeWidth || 2;
    const edgeLabel = selectedEdge.label || '';

    return (
      <aside className="properties-panel" id="properties-panel">
        <div className="properties-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          Edge Properties
        </div>

        {/* Edge Style */}
        <div className="prop-group">
          <div className="prop-group-title">Style</div>
          <div className="prop-row">
            <label className="prop-label" htmlFor="prop-edge-type">Edge Type</label>
            <select
              id="prop-edge-type"
              className="select-field"
              value={selectedEdge.type || 'default'}
              onChange={(e) => updateEdge({ type: e.target.value })}
            >
              {EDGE_TYPES.map((et) => (
                <option key={et.id} value={et.id}>{et.label}</option>
              ))}
            </select>
          </div>
          <div className="prop-row">
            <label className="prop-label">
              <input
                type="checkbox"
                checked={selectedEdge.animated || false}
                onChange={(e) => updateEdge({ animated: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Animated
            </label>
          </div>
        </div>

        {/* Edge Color & Stroke */}
        <div className="prop-group">
          <div className="prop-group-title">Appearance</div>
          <div className="prop-row">
            <span className="prop-label">Edge Color</span>
            <div className="color-picker-row">
              <div
                className="color-picker-swatch"
                style={{ background: edgeColor }}
              >
                <input
                  type="color"
                  value={edgeColor.startsWith('#') ? edgeColor : '#94a3b8'}
                  onChange={(e) => {
                    const c = e.target.value;
                    updateEdge({
                      style: { ...selectedEdge.style, stroke: c, strokeWidth: edgeStrokeWidth },
                      markerEnd: { ...(selectedEdge.markerEnd || {}), color: c },
                    });
                  }}
                  id="prop-edge-color"
                />
              </div>
              <input
                className="input-field"
                type="text"
                value={edgeColor}
                onChange={(e) => {
                  const c = e.target.value;
                  updateEdge({
                    style: { ...selectedEdge.style, stroke: c, strokeWidth: edgeStrokeWidth },
                    markerEnd: { ...(selectedEdge.markerEnd || {}), color: c },
                  });
                }}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <div className="prop-row">
            <label className="prop-label" htmlFor="prop-edge-stroke-width">Stroke Width</label>
            <select
              id="prop-edge-stroke-width"
              className="select-field"
              value={edgeStrokeWidth}
              onChange={(e) =>
                updateEdge({
                  style: { ...selectedEdge.style, stroke: edgeColor, strokeWidth: Number(e.target.value) },
                  markerEnd: { ...(selectedEdge.markerEnd || {}), color: edgeColor },
                })
              }
            >
              {STROKE_WIDTHS.map((w) => (
                <option key={w} value={w}>{w}px</option>
              ))}
            </select>
          </div>
        </div>

        {/* Edge Label */}
        <div className="prop-group">
          <div className="prop-group-title">Label</div>
          <div className="prop-row">
            <label className="prop-label" htmlFor="prop-edge-label">Label Text</label>
            <input
              id="prop-edge-label"
              className="input-field"
              type="text"
              value={edgeLabel}
              placeholder="Edge label..."
              onChange={(e) => updateEdge({ label: e.target.value })}
            />
          </div>
        </div>

        {/* Edge Info */}
        <div className="prop-group">
          <div className="prop-group-title">Info</div>
          <div className="prop-row">
            <span className="prop-label">Edge ID</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
              {selectedEdge.id}
            </span>
          </div>
        </div>

        <div className="prop-group">
          <button className="prop-delete-btn" onClick={deleteSelected} id="btn-delete-edge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete Edge
          </button>
        </div>
      </aside>
    );
  }

  /* ── Node selected ── */
  const nodeData = selectedNode.data || {};
  const rotation = nodeData.rotation || 0;
  const opacity = nodeData.opacity !== undefined ? nodeData.opacity : 1;

  return (
    <aside className="properties-panel" id="properties-panel">
      <div className="properties-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        Node Properties
      </div>

      {/* Label */}
      <div className="prop-group">
        <div className="prop-group-title">Content</div>
        <div className="prop-row">
          <label className="prop-label" htmlFor="prop-label">Label</label>
          <input
            id="prop-label"
            className="input-field"
            type="text"
            value={nodeData.label || ''}
            onChange={(e) => updateNodeData('label', e.target.value)}
          />
        </div>
      </div>

      {/* Colors */}
      <div className="prop-group">
        <div className="prop-group-title">Appearance</div>
        <div className="prop-row">
          <span className="prop-label">Fill Color</span>
          <div className="color-picker-row">
            <div
              className="color-picker-swatch"
              style={{ background: nodeData.bgColor || '#1e3a5f' }}
            >
              <input
                type="color"
                value={nodeData.bgColor || '#1e3a5f'}
                onChange={(e) => updateNodeData('bgColor', e.target.value)}
                id="prop-bg-color"
              />
            </div>
            <input
              className="input-field"
              type="text"
              value={nodeData.bgColor || '#1e3a5f'}
              onChange={(e) => updateNodeData('bgColor', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>
        <div className="prop-row">
          <span className="prop-label">Border Color</span>
          <div className="color-picker-row">
            <div
              className="color-picker-swatch"
              style={{ background: nodeData.borderColor || '#3b82f6' }}
            >
              <input
                type="color"
                value={nodeData.borderColor || '#3b82f6'}
                onChange={(e) => updateNodeData('borderColor', e.target.value)}
                id="prop-border-color"
              />
            </div>
            <input
              className="input-field"
              type="text"
              value={nodeData.borderColor || '#3b82f6'}
              onChange={(e) => updateNodeData('borderColor', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>
        <div className="prop-row">
          <label className="prop-label" htmlFor="prop-border-width">Border Width</label>
          <select
            id="prop-border-width"
            className="select-field"
            value={nodeData.borderWidth || 2}
            onChange={(e) => updateNodeData('borderWidth', Number(e.target.value))}
          >
            {STROKE_WIDTHS.map((w) => (
              <option key={w} value={w}>{w}px</option>
            ))}
          </select>
        </div>
      </div>

      {/* Effects */}
      <div className="prop-group">
        <div className="prop-group-title">Effects</div>
        <div className="prop-row">
          <label className="prop-label" htmlFor="prop-opacity">
            Opacity: {Math.round(opacity * 100)}%
          </label>
          <div className="rotation-control">
            <input
              id="prop-opacity"
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => updateNodeData('opacity', Number(e.target.value))}
              className="rotation-slider"
            />
            <span className="opacity-value">{Math.round(opacity * 100)}%</span>
          </div>
        </div>
        <div className="prop-row">
          <label className="prop-label toggle-label">
            <span>Glow Effect</span>
            <div
              className={`toggle-switch ${nodeData.glowEffect ? 'active' : ''}`}
              onClick={() => updateNodeData('glowEffect', !nodeData.glowEffect)}
              id="prop-glow-effect"
            >
              <div className="toggle-knob" />
            </div>
          </label>
        </div>
      </div>

      {/* Rotation */}
      <div className="prop-group">
        <div className="prop-group-title">Transform</div>
        <div className="prop-row">
          <label className="prop-label" htmlFor="prop-rotation">
            Rotation: {rotation}°
          </label>
          <div className="rotation-control">
            <input
              id="prop-rotation"
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => updateNodeData('rotation', Number(e.target.value))}
              className="rotation-slider"
            />
            <input
              type="number"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => updateNodeData('rotation', Number(e.target.value))}
              className="input-field rotation-input"
            />
          </div>
          <div className="rotation-presets">
            {[0, 45, 90, 135, 180, 270].map((deg) => (
              <button
                key={deg}
                className={`rotation-preset-btn ${rotation === deg ? 'active' : ''}`}
                onClick={() => updateNodeData('rotation', deg)}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="prop-group">
        <div className="prop-group-title">Typography</div>
        <div className="prop-row">
          <span className="prop-label">Font Color</span>
          <div className="color-picker-row">
            <div
              className="color-picker-swatch"
              style={{ background: nodeData.fontColor || '#ffffff' }}
            >
              <input
                type="color"
                value={nodeData.fontColor || '#ffffff'}
                onChange={(e) => updateNodeData('fontColor', e.target.value)}
                id="prop-font-color"
              />
            </div>
            <input
              className="input-field"
              type="text"
              value={nodeData.fontColor || '#ffffff'}
              onChange={(e) => updateNodeData('fontColor', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>
        <div className="prop-row">
          <label className="prop-label" htmlFor="prop-font-family">Font Family</label>
          <select
            id="prop-font-family"
            className="select-field"
            value={nodeData.fontFamily || 'Inter'}
            onChange={(e) => updateNodeData('fontFamily', e.target.value)}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="prop-row">
          <label className="prop-label" htmlFor="prop-font-size">Font Size</label>
          <select
            id="prop-font-size"
            className="select-field"
            value={nodeData.fontSize || 13}
            onChange={(e) => updateNodeData('fontSize', Number(e.target.value))}
          >
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>{s}px</option>
            ))}
          </select>
        </div>
        <div className="prop-row">
          <span className="prop-label">Style</span>
          <div className="font-style-row">
            <button
              className={`font-style-btn ${nodeData.fontBold ? 'active' : ''}`}
              onClick={() => updateNodeData('fontBold', !nodeData.fontBold)}
              id="prop-font-bold"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              className={`font-style-btn ${nodeData.fontItalic ? 'active' : ''}`}
              onClick={() => updateNodeData('fontItalic', !nodeData.fontItalic)}
              id="prop-font-italic"
              title="Italic"
            >
              <em>I</em>
            </button>
          </div>
        </div>
      </div>

      {/* Delete */}
      <div className="prop-group">
        <button className="prop-delete-btn" onClick={deleteSelected} id="btn-delete-node">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete Node
        </button>
      </div>
    </aside>
  );
}
