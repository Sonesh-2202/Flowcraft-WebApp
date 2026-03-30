import { useCallback } from 'react';
import { nodeDefinitions } from '../Nodes/nodeTypes';
import './Sidebar.css';

const edgeTypes = [
  { id: 'default', label: 'Bezier', style: 'solid' },
  { id: 'straight', label: 'Straight', style: 'solid' },
  { id: 'step', label: 'Step', style: 'solid' },
  { id: 'smoothstep', label: 'Smooth Step', style: 'solid' },
];

export default function Sidebar({ activeEdgeType, setActiveEdgeType }) {
  const onDragStart = useCallback((event, nodeType, defaultData) => {
    event.dataTransfer.setData('application/flowcraft-type', nodeType);
    event.dataTransfer.setData(
      'application/flowcraft-data',
      JSON.stringify(defaultData)
    );
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <aside className="sidebar" id="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="8" rx="2" />
            <rect x="5" y="15" width="14" height="6" rx="2" />
            <line x1="12" y1="11" x2="12" y2="15" />
          </svg>
        </div>
        <span className="sidebar-logo-text">FlowCraft</span>
      </div>

      {/* Node palette */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Shapes</div>
        <div className="node-palette">
          {nodeDefinitions.map((def) => (
            <div
              key={def.type}
              className="node-card"
              draggable
              onDragStart={(e) => onDragStart(e, def.type, def.defaultData)}
              id={`palette-${def.type}`}
            >
              <div className="node-card-icon">{def.icon}</div>
              <span className="node-card-label">{def.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edge types */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Edge Style</div>
        <div className="edge-type-list">
          {edgeTypes.map((et) => (
            <div
              key={et.id}
              className={`edge-type-item ${activeEdgeType === et.id ? 'active' : ''}`}
              onClick={() => setActiveEdgeType(et.id)}
              draggable
              onDragStart={(e) =>
                onDragStart(e, 'line', {
                  label: '',
                  borderColor: '#3b82f6',
                  fontSize: 13,
                  fontFamily: 'Inter',
                  rotation: 0,
                  lineType: et.id,
                })
              }
              id={`edge-type-${et.id}`}
            >
              <svg width="28" height="12" viewBox="0 0 28 12">
                {et.id === 'default' ? (
                  <path d="M2,6 C10,6 18,6 26,6" stroke="currentColor" strokeWidth="2" fill="none" />
                ) : et.id === 'straight' ? (
                  <line x1="2" y1="6" x2="26" y2="6" stroke="currentColor" strokeWidth="2" />
                ) : et.id === 'step' ? (
                  <path d="M2,2 L14,2 L14,10 L26,10" stroke="currentColor" strokeWidth="2" fill="none" />
                ) : (
                  <path d="M2,2 C8,2 8,10 14,10 C20,10 20,2 26,2" stroke="currentColor" strokeWidth="2" fill="none" />
                )}
                <polygon points="24,3 28,6 24,9" fill="currentColor" />
              </svg>
              <span>{et.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
