import RectangleNode from './RectangleNode';
import DiamondNode from './DiamondNode';
import CircleNode from './CircleNode';
import ParallelogramNode from './ParallelogramNode';
import CloudNode from './CloudNode';
import DatabaseNode from './DatabaseNode';
import ArrowNode from './ArrowNode';
import ImageNode from './ImageNode';
import LineNode from './LineNode';

const nodeTypes = {
  rectangle: RectangleNode,
  diamond: DiamondNode,
  circle: CircleNode,
  parallelogram: ParallelogramNode,
  cloud: CloudNode,
  database: DatabaseNode,
  arrow: ArrowNode,
  image: ImageNode,
  line: LineNode,
};

export default nodeTypes;

/* ── Node definitions for sidebar palette ── */
export const nodeDefinitions = [
  {
    type: 'rectangle',
    label: 'Process',
    icon: (
      <svg viewBox="0 0 40 28" fill="none">
        <rect x="1" y="1" width="38" height="26" rx="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    defaultData: {
      label: 'Process',
      bgColor: '#1e3a5f',
      borderColor: '#3b82f6',
      fontSize: 13,
      fontFamily: 'Inter',
    },
  },
  {
    type: 'diamond',
    label: 'Decision',
    icon: (
      <svg viewBox="0 0 40 28" fill="none">
        <polygon points="20,1 39,14 20,27 1,14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    defaultData: {
      label: 'Decision',
      bgColor: '#1e3a5f',
      borderColor: '#f59e0b',
      fontSize: 12,
      fontFamily: 'Inter',
    },
  },
  {
    type: 'circle',
    label: 'Start / End',
    icon: (
      <svg viewBox="0 0 40 28" fill="none">
        <ellipse cx="20" cy="14" rx="14" ry="12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    defaultData: {
      label: 'Start',
      bgColor: '#1e3a5f',
      borderColor: '#10b981',
      fontSize: 13,
      fontFamily: 'Inter',
    },
  },
  {
    type: 'parallelogram',
    label: 'Input / Output',
    icon: (
      <svg viewBox="0 0 40 28" fill="none">
        <polygon points="8,1 39,1 32,27 1,27" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    defaultData: {
      label: 'Input / Output',
      bgColor: '#1e3a5f',
      borderColor: '#8b5cf6',
      fontSize: 13,
      fontFamily: 'Inter',
    },
  },
  {
    type: 'cloud',
    label: 'Cloud',
    icon: (
      <svg viewBox="0 0 40 28" fill="none">
        <path d="M10,22 C4,22 1,17 3,13 C1,9 5,5 11,6 C13,2 19,1 24,4 C28,1 34,2 36,7 C39,6 40,12 38,16 C40,20 36,24 30,22 C28,26 22,26 18,22 C14,26 8,24 10,22 Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    defaultData: {
      label: 'Cloud',
      bgColor: '#1e3a5f',
      borderColor: '#06b6d4',
      fontSize: 13,
      fontFamily: 'Inter',
    },
  },
  {
    type: 'database',
    label: 'Database',
    icon: (
      <svg viewBox="0 0 40 28" fill="none">
        <path d="M6,8 L6,20 C6,25 34,25 34,20 L34,8" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="20" cy="8" rx="14" ry="5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    defaultData: {
      label: 'Database',
      bgColor: '#1e3a5f',
      borderColor: '#ec4899',
      fontSize: 13,
      fontFamily: 'Inter',
    },
  },
  {
    type: 'arrow',
    label: 'Pointer',
    icon: (
      <svg viewBox="0 0 40 28" fill="none">
        <path d="M6,14 L24,14 L24,8 L36,14 L24,20 L24,14" fill="currentColor" />
      </svg>
    ),
    defaultData: {
      label: '',
      bgColor: '#1e3a5f',
      borderColor: '#3b82f6',
      fontSize: 13,
      fontFamily: 'Inter',
      rotation: 0,
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: (
      <svg viewBox="0 0 40 28" fill="none">
        <rect x="6" y="4" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="11" r="2.5" fill="currentColor" />
        <path d="M6 20 l8 -8 l6 6 l4 -4 l8 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    defaultData: {
      label: '',
      bgColor: 'transparent',
      borderColor: '#3b82f6',
      imageUrl: null,
      width: 120,
      height: 120,
      rotation: 0,
    },
  },
];
