import { useState, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowProvider, useFlowState, useFlowDispatch } from './store/flowStore';
import { useUndoRedo } from './hooks/useUndoRedo';
import Sidebar from './components/Sidebar/Sidebar';
import Toolbar from './components/Toolbar/Toolbar';
import FlowCanvas from './components/Canvas/FlowCanvas';
import PropertiesPanel from './components/PropertiesPanel/PropertiesPanel';
import './App.css';

function AppInner() {
  const { nodes, edges } = useFlowState();
  const dispatch = useFlowDispatch();
  const [activeEdgeType, setActiveEdgeType] = useState('default');
  const [theme, setTheme] = useState('dark');

  const { recordSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo(
    nodes,
    edges,
    dispatch
  );

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR_CANVAS' });
  }, [dispatch]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <div className={`app-layout ${theme === 'light' ? 'light-theme' : ''}`}>
      <div className="app-body">
        <Sidebar
          activeEdgeType={activeEdgeType}
          setActiveEdgeType={setActiveEdgeType}
        />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <Toolbar
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onClear={handleClear}
            onDeleteSelected={() => dispatch({ type: 'DELETE_SELECTED' })}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          <FlowCanvas
            activeEdgeType={activeEdgeType}
            recordSnapshot={recordSnapshot}
          />
        </div>
        <PropertiesPanel activeEdgeType={activeEdgeType} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <AppInner />
      </FlowProvider>
    </ReactFlowProvider>
  );
}
