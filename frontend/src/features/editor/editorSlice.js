import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const MAX_HISTORY_LENGTH = 50; // Limit to last 50 changes

const initialState = {
  pattern: { nodes: [], links: [] },
  currentLayerNumber: 0,
  selectedStitch: null,
  currentIndex: 0,
  selectedNode: null,
  selectedMenu: null,
  expanded: false,
  graphicalView: false,
  primaryColor: "#0D0C0D",
  view3D: false,
  history: [],
  future: [],
  canvasRef: null,
  name: 'untitled',
  id: null,
};

// Helper to deep copy relevant state
const cloneRelevantState = (state) => ({
  pattern: JSON.parse(JSON.stringify(state.pattern)),
  currentIndex: state.currentIndex,
  selectedNode: state.selectedNode ? { ...state.selectedNode } : null,
  primaryColor: state.primaryColor,
});

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    startPattern: (state, action) => {
      const { stitch } = action.payload;
      const newNode = {
        type: stitch,
        layer: state.currentLayerNumber,
        start: true,
        previous: null,
        inserts: null,
        isIncrease: null,
        surroundingNodes: null,
        id: uuidv4(),
        index: state.currentIndex,
        color: state.primaryColor,
      };
      state.selectedNode = newNode;
      state.pattern.nodes.push(newNode);
    },

    insertStitch: (state, action) => {

      const { node: nodeId, positions } = action.payload;

      if (positions) {
        state.pattern.nodes.forEach((n) => {
          if (positions[n.id]) {
            const pos = positions[n.id];
            n.x = pos.x;
            n.y = pos.y;
            if (pos.z) {
              n.z = pos.z;
            }
          }
        });
      }

      if (state.selectedStitch === null) {
        const n = state.pattern.nodes.find((node) => node.id === nodeId);
        state.selectedNode = n || null;
        return;
      }
      
      state.history.push(cloneRelevantState(state));
      if (state.history.length > MAX_HISTORY_LENGTH) state.history.shift();
      state.future = [];
      const lastNode = state.pattern.nodes[state.pattern.nodes.length - 1];

      if (state.selectedStitch === "slip") {
        const slipStitchLink = {
          source: lastNode.id,
          target: nodeId,
          inserts: false,
          slipStitch: true,
        };

        state.pattern.links.push(slipStitchLink);
      } else {
        const newNodeId = uuidv4();

        const newNode = {
          type: state.selectedStitch,
          layer: state.currentLayerNumber,
          start: false,
          previous: lastNode ? lastNode.id : null,
          inserts: state.selectedStitch !== "ch" ? nodeId : null,
          isIncrease: null,
          surroundingNodes: null,
          id: newNodeId,
          index: state.currentIndex + 1,
          color: state.primaryColor,
        };

        const prevLink = {
          source: lastNode.id,
          target: newNodeId,
          inserts: false,
          slipStitch: false,
        };

        if (state.selectedStitch !== "ch") {
          const insertLink = {
            target: nodeId,
            source: newNodeId,
            inserts: true,
            slipStitch: false,
          };
          state.pattern.links.push(insertLink);
        }

        state.selectedNode = newNode;
        state.pattern.nodes.push(newNode);
        state.pattern.links.push(prevLink);
        state.currentIndex++;
      }
      console.log(JSON.parse(JSON.stringify(state.pattern)))
    },
    resetEditor: (state) => {
        state.pattern.nodes = [];
        state.pattern.links = [];
        state.currentLayerNumber = 0;
        state.selectedStitch = null;
        state.currentIndex = 0;
        state.selectedNode = null;
        state.selectedMenu = null;
        state.expanded = false;
        state.graphicalView = false;
        state.view3D = false;
        state.history = [];
        state.future = [];
      }
      ,
    updateSelectedNodeColor: (state, action) => {
      state.history.push(cloneRelevantState(state));
      if (state.history.length > MAX_HISTORY_LENGTH) state.history.shift();
      state.future = [];

      const newColor = action.payload;

      if (state.selectedNode) {
        state.selectedNode.color = newColor;
        state.primaryColor = newColor;

        const nodeIndex = state.pattern.nodes.findIndex(
          (node) => node.id === state.selectedNode.id
        );
        if (nodeIndex !== -1) {
          state.pattern.nodes[nodeIndex].color = newColor;
        }
      }
    },

    undo: (state) => {
      if (state.history.length > 0) {
        const previous = state.history.pop();
        state.future.push(cloneRelevantState(state));
        Object.assign(state, {
          ...state,
          ...previous,
        });
      }
    },

    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.pop();
        state.history.push(cloneRelevantState(state));
        Object.assign(state, {
          ...state,
          ...next,
        });
      }
    },

    selectStitch: (state, action) => {
      const { stitch } = action.payload;
      state.selectedStitch = stitch ? stitch : null;
    },

    selectNode: (state, action) => {
      const { selectedNode } = action.payload;
      const node = state.pattern.nodes.find((node) => node.id === selectedNode);
      state.selectedNode = node ? node : null;
      state.selectedMenu = "Stitch";
    },

    setSelectedMenu: (state, action) => {
      state.selectedMenu = state.selectedMenu === action.payload ? null : action.payload;
    },

    toggleExpandCanvas: (state) => {
      state.expanded = !state.expanded;
    },

    setGraphicalView: (state) => {
      if (!state.graphicalView) {
        state.view3D = true;
      }
      state.graphicalView = !state.graphicalView;
    },

    toggle3D: (state) => {
      if (state.view3D) {
        state.graphicalView = false;
      }
      state.view3D = !state.view3D;
    },
    setCanvasRef: (state, action) => {
      state.canvasRef = action.payload;
    },
    setStitches: (state, action) => {
      state.pattern.nodes = action.payload;
      state.selectedNode=state.pattern.nodes[state.pattern.nodes.length - 1]
    },
    setLinks: (state, action) => {
      state.pattern.links = action.payload;
    },
    setPatternName: (state, action) => {
      state.name = action.payload;
    },
    setId:(state, action)=>{
      state.id = action.payload
    }
  },
});

export const {
  setId,
  setStitches,
  setLinks,
  setPatternName,
  startPattern,
  addStitch,
  insertStitch,
  selectStitch,
  selectNode,
  updateSelectedNodeColor,
  setSelectedMenu,
  toggleExpandCanvas,
  setGraphicalView,
  toggle3D,
  undo,
  redo,
  resetEditor,
  setCanvasRef
} = editorSlice.actions;

export default editorSlice.reducer;
