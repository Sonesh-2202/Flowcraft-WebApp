import { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useFlowDispatch } from '../../store/flowStore';
import './Nodes.css';

export default function RectangleNode({ id, data, selected }) {
  const dispatch = useFlowDispatch();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Process');
  const inputRef = useRef(null);

  useEffect(() => { setLabel(data.label || 'Process'); }, [data.label]);

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
  const fontSize = data.fontSize || 13;
  const fontFamily = data.fontFamily || 'Inter';
  const rotation = data.rotation || 0;

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={60} minHeight={40} />
      <div
        className={`fc-node fc-node-rectangle ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
        style={{ width: '100%', height: '100%', transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 160 60" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect
          x="1" y="1" width="158" height="58" rx="8"
          fill={bgColor}
          stroke={borderColor}
          strokeWidth="2"
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
          style={{ fontSize: `${fontSize}px`, fontFamily }}
        />
      ) : (
        <div className="fc-node-label" style={{ fontSize: `${fontSize}px`, fontFamily }}>
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
