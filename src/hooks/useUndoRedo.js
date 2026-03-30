import { useCallback, useRef } from 'react';

const MAX_HISTORY = 50;

export function useUndoRedo(nodes, edges, dispatch) {
  const history = useRef([{ nodes: [], edges: [] }]);
  const currentIndex = useRef(0);
  const isUndoRedoing = useRef(false);

  /* Record a snapshot */
  const recordSnapshot = useCallback(
    (newNodes, newEdges) => {
      if (isUndoRedoing.current) {
        isUndoRedoing.current = false;
        return;
      }
      const snapshot = {
        nodes: newNodes.map((n) => ({ ...n, data: { ...n.data } })),
        edges: newEdges.map((e) => ({ ...e })),
      };

      /* Trim future history if we branched */
      const trimmed = history.current.slice(0, currentIndex.current + 1);
      trimmed.push(snapshot);

      /* Cap history length */
      if (trimmed.length > MAX_HISTORY) {
        trimmed.shift();
      } else {
        currentIndex.current += 1;
      }
      history.current = trimmed;
    },
    []
  );

  const undo = useCallback(() => {
    if (currentIndex.current <= 0) return;
    isUndoRedoing.current = true;
    currentIndex.current -= 1;
    const snapshot = history.current[currentIndex.current];
    dispatch({ type: 'SET_NODES', payload: snapshot.nodes });
    dispatch({ type: 'SET_EDGES', payload: snapshot.edges });
  }, [dispatch]);

  const redo = useCallback(() => {
    if (currentIndex.current >= history.current.length - 1) return;
    isUndoRedoing.current = true;
    currentIndex.current += 1;
    const snapshot = history.current[currentIndex.current];
    dispatch({ type: 'SET_NODES', payload: snapshot.nodes });
    dispatch({ type: 'SET_EDGES', payload: snapshot.edges });
  }, [dispatch]);

  const canUndo = currentIndex.current > 0;
  const canRedo = currentIndex.current < history.current.length - 1;

  return { recordSnapshot, undo, redo, canUndo, canRedo };
}
