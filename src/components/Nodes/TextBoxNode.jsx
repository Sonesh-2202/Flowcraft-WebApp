import { useState, useCallback, useRef, useEffect } from 'react';
import { NodeResizer } from '@xyflow/react';
import { useFlowDispatch } from '../../store/flowStore';
import './Nodes.css';

export default function TextBoxNode({ id, data, selected }) {
  const dispatch = useFlowDispatch();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Add text');
  const inputRef = useRef(null);

  useEffect(() => {
    setLabel(data.label || 'Add text');
  }, [data.label]);

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

  const bgColor = data.bgColor || '#0b1220';
  const borderColor = data.borderColor || '#60a5fa';
  const fontColor = data.fontColor || '#93c5fd';
  const fontSize = data.fontSize || 14;
  const fontFamily = data.fontFamily || 'Inter';
  const fontWeight = data.fontBold ? 'bold' : data.fontWeight || '600';
  const fontStyle = data.fontItalic ? 'italic' : 'normal';
  const borderWidth = data.borderWidth || 1.5;
  const rotation = data.rotation || 0;
  const opacity = data.opacity !== undefined ? data.opacity : 1;
  const glowEffect = data.glowEffect || false;
  const glowStyle = glowEffect
    ? { boxShadow: `0 0 12px ${borderColor}66` }
    : {};

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={40} minHeight={24} />
      <div
        className={`fc-node fc-node-text-box ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
        style={{
          width: '100%',
          height: '100%',
          transform: `rotate(${rotation}deg)`,
          opacity,
          background: bgColor,
          borderColor,
          borderWidth,
          borderStyle: 'dashed',
          boxSizing: 'border-box',
          ...glowStyle,
        }}
      >
        {editing ? (
          <textarea
            ref={inputRef}
            className="fc-node-input fc-node-text-box-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                commitEdit();
              }
            }}
            style={{
              fontSize: `${fontSize}px`,
              fontFamily,
              color: fontColor,
              fontWeight,
              fontStyle,
            }}
          />
        ) : (
          <div
            className="fc-node-label fc-node-text-box-label"
            style={{
              fontSize: `${fontSize}px`,
              fontFamily,
              color: fontColor,
              fontWeight,
              fontStyle,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </>
  );
}
