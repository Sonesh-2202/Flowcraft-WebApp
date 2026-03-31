import { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useFlowDispatch } from '../../store/flowStore';
import './Nodes.css';

export default function DiamondNode({ id, data, selected }) {
  const dispatch = useFlowDispatch();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Decision');
  const inputRef = useRef(null);

  useEffect(() => { setLabel(data.label || 'Decision'); }, [data.label]);

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
  const borderColor = data.borderColor || '#f59e0b';
  const fontColor = data.fontColor || '#ffffff';
  const fontSize = data.fontSize || 12;
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
      <NodeResizer isVisible={selected} minWidth={60} minHeight={40} />
      <div
        className={`fc-node fc-node-diamond ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
        style={{ width: '100%', height: '100%', transform: `rotate(${rotation}deg)`, opacity, ...glowStyle }}
      >
        <svg viewBox="0 0 140 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <polygon
          points="70,2 138,50 70,98 2,50"
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
          style={{ fontSize: `${fontSize}px`, fontFamily, padding: '20px 24px', color: fontColor, fontWeight, fontStyle }}
        />
      ) : (
        <div className="fc-node-label" style={{ fontSize: `${fontSize}px`, fontFamily, color: fontColor, fontWeight, fontStyle }}>
          {label}
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ left: '50%' }} />
      <Handle type="source" position={Position.Bottom} style={{ left: '50%' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ top: '50%' }} />
      </div>
    </>
  );
}
