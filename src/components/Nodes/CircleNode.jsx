import { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useFlowDispatch } from '../../store/flowStore';
import './Nodes.css';

export default function CircleNode({ id, data, selected }) {
  const dispatch = useFlowDispatch();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Start');
  const inputRef = useRef(null);

  useEffect(() => { setLabel(data.label || 'Start'); }, [data.label]);

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
  const borderColor = data.borderColor || '#10b981';
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
      <NodeResizer isVisible={selected} minWidth={40} minHeight={40} />
      <div
        className={`fc-node fc-node-circle ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
        style={{ width: '100%', height: '100%', transform: `rotate(${rotation}deg)`, opacity, ...glowStyle }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <circle
          cx="50" cy="50" r="48"
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
          style={{ fontSize: `${fontSize}px`, fontFamily, borderRadius: '50%', color: fontColor, fontWeight, fontStyle }}
        />
      ) : (
        <div className="fc-node-label" style={{ fontSize: `${fontSize}px`, fontFamily, color: fontColor, fontWeight, fontStyle }}>
          {label}
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      </div>
    </>
  );
}
