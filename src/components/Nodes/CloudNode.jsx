import { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useFlowDispatch } from '../../store/flowStore';
import './Nodes.css';

export default function CloudNode({ id, data, selected }) {
  const dispatch = useFlowDispatch();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Cloud');
  const inputRef = useRef(null);

  useEffect(() => { setLabel(data.label || 'Cloud'); }, [data.label]);

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
  const borderColor = data.borderColor || '#06b6d4';
  const fontSize = data.fontSize || 13;
  const fontFamily = data.fontFamily || 'Inter';
  const rotation = data.rotation || 0;

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={60} minHeight={40} />
      <div
        className={`fc-node fc-node-cloud ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
        style={{ width: '100%', height: '100%', transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 160 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path
          d="M32,80 C10,80 2,65 10,52 C4,40 14,26 30,28 C34,14 52,8 68,16 C78,6 100,6 112,18 C130,12 152,22 148,42 C158,48 158,68 144,76 C148,86 132,90 120,84 C110,92 90,92 80,84 C66,92 44,90 32,80 Z"
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
          style={{ fontSize: `${fontSize}px`, fontFamily, padding: '20px 24px' }}
        />
      ) : (
        <div className="fc-node-label" style={{ fontSize: `${fontSize}px`, fontFamily }}>
          {label}
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ top: '10%' }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: '10%' }} />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      </div>
    </>
  );
}
