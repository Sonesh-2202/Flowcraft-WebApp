import { createContext, useContext, useReducer, useCallback, useRef } from 'react';

const FlowContext = createContext(null);
const FlowDispatchContext = createContext(null);

/* ── Default state ── */
const initialState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
};

/* ── Reducer ── */
function flowReducer(state, action) {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload };
    case 'SET_EDGES':
      return { ...state, edges: action.payload };
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.payload] };
    case 'UPDATE_NODE': {
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.payload.id
            ? { ...n, ...action.payload.updates }
            : n
        ),
      };
    }
    case 'DELETE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter((n) => n.id !== action.payload),
        edges: state.edges.filter(
          (e) => e.source !== action.payload && e.target !== action.payload
        ),
        selectedNodeId:
          state.selectedNodeId === action.payload ? null : state.selectedNodeId,
      };
    case 'DELETE_EDGE':
      return {
        ...state,
        edges: state.edges.filter((e) => e.id !== action.payload),
        selectedEdgeId:
          state.selectedEdgeId === action.payload ? null : state.selectedEdgeId,
      };
    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.payload, selectedEdgeId: null };
    case 'SELECT_EDGE':
      return { ...state, selectedEdgeId: action.payload, selectedNodeId: null };
    case 'DESELECT_ALL':
      return { ...state, selectedNodeId: null, selectedEdgeId: null };
    case 'DELETE_SELECTED': {
      if (state.selectedNodeId) {
        return {
          ...state,
          nodes: state.nodes.filter((n) => n.id !== state.selectedNodeId),
          edges: state.edges.filter(
            (e) => e.source !== state.selectedNodeId && e.target !== state.selectedNodeId
          ),
          selectedNodeId: null,
        };
      }
      if (state.selectedEdgeId) {
        return {
          ...state,
          edges: state.edges.filter((e) => e.id !== state.selectedEdgeId),
          selectedEdgeId: null,
        };
      }
      return state;
    }
    case 'UPDATE_EDGE': {
      return {
        ...state,
        edges: state.edges.map((e) =>
          e.id === action.payload.id
            ? { ...e, ...action.payload.updates }
            : e
        ),
      };
    }
    case 'SET_STATE':
      return { ...action.payload };
    case 'CLEAR_CANVAS':
      return { ...initialState };
    default:
      return state;
  }
}

/* ── Provider ── */
export function FlowProvider({ children }) {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  return (
    <FlowContext.Provider value={state}>
      <FlowDispatchContext.Provider value={dispatch}>
        {children}
      </FlowDispatchContext.Provider>
    </FlowContext.Provider>
  );
}

/* ── Hooks ── */
export function useFlowState() {
  const context = useContext(FlowContext);
  if (!context && context !== initialState) {
    throw new Error('useFlowState must be used within FlowProvider');
  }
  return context;
}

export function useFlowDispatch() {
  const context = useContext(FlowDispatchContext);
  if (!context) {
    throw new Error('useFlowDispatch must be used within FlowProvider');
  }
  return context;
}

export { initialState };
