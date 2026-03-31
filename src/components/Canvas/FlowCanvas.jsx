import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  useReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  reconnectEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowState, useFlowDispatch } from '../../store/flowStore';
import nodeTypes from '../Nodes/nodeTypes';
import './FlowCanvas.css';

let nodeIdCounter = 0;

export default function FlowCanvas({ activeEdgeType, recordSnapshot }) {
  const { nodes, edges } = useFlowState();
  const dispatch = useFlowDispatch();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [dragOver, setDragOver] = useState(false);
  const edgeReconnectSuccessful = useRef(true);

  /* ── Node changes ── */
  const onNodesChange = useCallback(
    (changes) => {
      const updated = applyNodeChanges(changes, nodes);
      dispatch({ type: 'SET_NODES', payload: updated });
    },
    [nodes, dispatch]
  );

  /* ── Edge changes ── */
  const onEdgesChange = useCallback(
    (changes) => {
      const updated = applyEdgeChanges(changes, edges);
      dispatch({ type: 'SET_EDGES', payload: updated });
    },
    [edges, dispatch]
  );

  /* ── Connecting edges ── */
  const onConnect = useCallback(
    (params) => {
      const strokeColor = '#94a3b8';
      const newEdge = {
        ...params,
        type: activeEdgeType,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: strokeColor,
        },
        style: { stroke: strokeColor, strokeWidth: 2 },
        animated: false,
      };
      const updated = addEdge(newEdge, edges);
      dispatch({ type: 'SET_EDGES', payload: updated });
    },
    [edges, dispatch, activeEdgeType]
  );

  /* ── Edge reconnect ── */
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      const updated = reconnectEdge(oldEdge, newConnection, edges);
      dispatch({ type: 'SET_EDGES', payload: updated });
    },
    [edges, dispatch]
  );

  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!edgeReconnectSuccessful.current) {
        dispatch({
          type: 'SET_EDGES',
          payload: edges.filter((e) => e.id !== edge.id),
        });
      }
      edgeReconnectSuccessful.current = true;
    },
    [edges, dispatch]
  );

  /* ── Selection ── */
  const onNodeClick = useCallback(
    (_, node) => {
      dispatch({ type: 'SELECT_NODE', payload: node.id });
    },
    [dispatch]
  );

  const onEdgeClick = useCallback(
    (_, edge) => {
      dispatch({ type: 'SELECT_EDGE', payload: edge.id });
    },
    [dispatch]
  );

  const onPaneClick = useCallback(() => {
    dispatch({ type: 'DESELECT_ALL' });
  }, [dispatch]);



  /* ── Record snapshots for undo/redo ── */
  const prevNodesRef = useRef(nodes);
  const prevEdgesRef = useRef(edges);
  useEffect(() => {
    const nodesChanged = prevNodesRef.current !== nodes;
    const edgesChanged = prevEdgesRef.current !== edges;
    if (nodesChanged || edgesChanged) {
      recordSnapshot(nodes, edges);
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
    }
  }, [nodes, edges, recordSnapshot]);

  /* ── Drag & Drop from sidebar ── */
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);

      const type = e.dataTransfer.getData('application/flowcraft-type');
      const dataStr = e.dataTransfer.getData('application/flowcraft-data');
      if (!type) return;

      let defaultData = {};
      try {
        defaultData = JSON.parse(dataStr);
      } catch {
        /* ignore */
      }

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      nodeIdCounter += 1;
      const newNode = {
        id: `node_${Date.now()}_${nodeIdCounter}`,
        type,
        position,
        data: { ...defaultData },
      };

      dispatch({ type: 'ADD_NODE', payload: newNode });
    },
    [screenToFlowPosition, dispatch]
  );

  return (
    <div
      className={`canvas-wrapper ${dragOver ? 'drag-over' : ''}`}
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode={null}
        defaultEdgeOptions={{
          type: activeEdgeType,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
            color: '#94a3b8',
          },
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="rgba(99, 130, 255, 0.08)"
          gap={20}
          size={1.5}
          variant="dots"
        />
        <MiniMap
          nodeColor={(node) => node.data?.borderColor || '#3b82f6'}
          maskColor="rgba(10, 14, 26, 0.7)"
          style={{ width: 160, height: 100 }}
        />
      </ReactFlow>
    </div>
  );
}
