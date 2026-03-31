import { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useFlowDispatch } from '../../store/flowStore';
import './Nodes.css';

export default function ArrowNode({ id, data, selected }) {
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

  const bgColor = data.bgColor || '#1e3a5f';
  const borderColor = data.borderColor || '#3b82f6';
  const fontColor = data.fontColor || '#ffffff';
  const fontSize = data.fontSize || 13;
  const fontFamily = data.fontFamily || 'Inter';
  const fontWeight = data.fontBold ? 'bold' : (data.fontWeight || '500');
  const fontStyle = data.fontItalic ? 'italic' : 'normal';
  const borderWidth = data.borderWidth || 2;
  const rotation = data.rotation || 0;
  const opacity = data.opacity !== undefined ? data.opacity : 1;
  const glowEffect = data.glowEffect || false;

  const glowStyle = glowEffect ? { filter: `drop-shadow(0 0 8px ${borderColor})` } : {};

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={40} minHeight={20} />
      <div
        className={`fc-node fc-node-arrow ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
        style={{
          width: '100%',
          height: '100%',
          transform: `rotate(${rotation}deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          opacity,
          ...glowStyle,
        }}
      >
        <svg viewBox="0 0 140 60" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path
          d="M0 20 L100 20 L100 0 L140 30 L100 60 L100 40 L0 40 Z"
          fill={bgColor}
          stroke={borderColor}
          strokeWidth={borderWidth}
        />
      </svg>
      {editing ? (
        <textarea
          ref={inputRef}
          className="fc-node-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); } }}
          style={{ fontSize: `${fontSize}px`, fontFamily, width: '80px', height: '40px', left: '20px', position: 'absolute', color: fontColor, fontWeight, fontStyle }}
        />
      ) : label ? (
        <div className="fc-node-label" style={{ fontSize: `${fontSize}px`, fontFamily, position: 'absolute', left: '25px', maxWidth: '70px', color: fontColor, fontWeight, fontStyle }}>
          {label}
        </div>
      ) : null}
      
      {/* Handles are positioned around the arrow for connectivity if needed */}
      <Handle type="target" position={Position.Left} id="left" style={{ left: '-8px' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ right: '-8px' }} />
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      </div>
    </>
  );
}
