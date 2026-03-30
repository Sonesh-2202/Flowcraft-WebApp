import { useState, useCallback, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useFlowDispatch } from '../../store/flowStore';
import './Nodes.css';

export default function ImageNode({ id, data, selected }) {
  const dispatch = useFlowDispatch();
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDoubleClick = useCallback(() => {
    /* Trigger file upload on double click if not already an image, or to replace it */
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          id,
          updates: {
            data: { ...data, imageUrl: base64Data },
          },
        },
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = null;
  }, [dispatch, id, data]);

  const rotation = data.rotation || 0;
  const borderColor = data.borderColor || '#3b82f6';
  const width = data.width || 120;
  const height = data.height || 120;

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={40} minHeight={40} />
      <div
        className={`fc-node fc-node-image ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%',
          height: '100%',
          minWidth: width, /* fallback for first drop */
          minHeight: height,
          transform: `rotate(${rotation}deg)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: selected ? `2px solid ${borderColor}` : (data.imageUrl ? '2px solid transparent' : '2px dashed var(--color-border)'),
          backgroundColor: data.imageUrl ? 'transparent' : 'var(--color-bg-tertiary)',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
      >
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />

      {data.imageUrl ? (
        <>
          <img 
            src={data.imageUrl} 
            alt="User uploaded" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            draggable="false"
          />
          {isHovered && (
             <div 
               style={{ 
                 position: 'absolute', 
                 top: 0, left: 0, right: 0, bottom: 0, 
                 background: 'rgba(0,0,0,0.4)', 
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 color: 'white',
                 fontSize: '12px',
                 fontWeight: 'bold',
                 pointerEvents: 'none'
               }}
             >
               Double-click to change
             </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '11px', padding: '10px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" style={{ marginBottom: '4px' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <br/>
          Double-click<br/>to upload image
        </div>
      )}

      {/* Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      </div>
    </>
  );
}
