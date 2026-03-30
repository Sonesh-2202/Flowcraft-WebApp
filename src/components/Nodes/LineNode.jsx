import { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useFlowDispatch } from '../../store/flowStore';
import './Nodes.css';

export default function LineNode({ id, data, selected }) {
  const dispatch = useFlowDispatch();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const inputRef = useRef(null);

  useEffect(() => { setLabel(data.label || ''); }, [data.label]);

  const handleDoubleClick = useCallback(() => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const commitEdit = useCallback(() => {
    setEditing(false);
    dispatch({
      type: 'UPDATE_NODE',
      payload: { id, updates: { data: { ...data, label } } },
    });
  }, [dispatch, id, data, label]);

  const borderColor = data.borderColor || '#3b82f6';
  const fontSize = data.fontSize || 13;
  const fontFamily = data.fontFamily || 'Inter';
  const rotation = data.rotation || 0;
  const lineType = data.lineType || 'straight'; /* bezier, straight, step, smoothstep */

  const renderPath = () => {
    /* Base paths matching the sidebar icons roughly */
    switch (lineType) {
      case 'default':
      case 'bezier':
        return <path d="M10,30 C50,30 90,30 130,30" stroke={borderColor} strokeWidth="3" fill="none" />;
      case 'straight':
        return <line x1="10" y1="30" x2="130" y2="30" stroke={borderColor} strokeWidth="3" />;
      case 'step':
        return <path d="M10,10 L70,10 L70,50 L130,50" stroke={borderColor} strokeWidth="3" fill="none" />;
      case 'smoothstep':
        return <path d="M10,10 C40,10 40,50 70,50 C100,50 100,50 130,50" stroke={borderColor} strokeWidth="3" fill="none" />;
      default:
        return <line x1="10" y1="30" x2="130" y2="30" stroke={borderColor} strokeWidth="3" />;
    }
  };

  const renderArrowHead = () => {
    switch (lineType) {
      case 'default':
      case 'bezier':
      case 'straight':
        return <polygon points="120,20 140,30 120,40" fill={borderColor} />;
      case 'step':
      case 'smoothstep':
        return <polygon points="120,40 140,50 120,60" fill={borderColor} />;
      default:
        return <polygon points="120,20 140,30 120,40" fill={borderColor} />;
    }
  };

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={40} minHeight={20} />
      <div
        className={`fc-node fc-node-line ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
        style={{
          width: '100%',
          height: '100%',
          transform: `rotate(${rotation}deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <svg viewBox="0 0 150 60" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        {renderPath()}
        {renderArrowHead()}
      </svg>
      {editing ? (
        <textarea
          ref={inputRef}
          className="fc-node-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); } }}
          style={{ fontSize: `${fontSize}px`, fontFamily, width: '80px', height: '30px', position: 'absolute' }}
        />
      ) : label ? (
        <div className="fc-node-label" style={{ fontSize: `${fontSize}px`, fontFamily, position: 'absolute', background: 'var(--color-bg-primary)', padding: '2px 6px', borderRadius: '4px' }}>
          {label}
        </div>
      ) : null}
      
      <Handle type="target" position={Position.Left} id="left" style={{ left: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ right: 0 }} />
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      </div>
    </>
  );
}
