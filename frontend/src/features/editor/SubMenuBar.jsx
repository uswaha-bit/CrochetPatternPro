import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSelectedNodeColor,
  setGraphicalView,
  toggle3D,
  undo,
  redo,
  resetEditor,
  setStitches,
  setLinks,
} from "./editorSlice";
import NewPatternModal from "./NewPatternmodal";
import SavePatternModal from "./SavePatternModal"; // import the modal
import { useCreatePattern } from "../../hooks/usePattern";
import {
  FaUndo,
  FaRedo,
  FaProjectDiagram,
  FaThLarge,
  FaFileAlt,
  FaSave,
  FaFileExport,
  FaFileImport,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import DiscardChangesModal from "./DiscardChangesModal";
import { colors, fontStack } from "../../ui/theme";

const Bar = styled.div`
  display: flex;
  align-items: center;
  min-height: 60px;
  box-sizing: border-box;
  padding: 10px clamp(16px, 3vw, 36px);
  background: ${colors.surface};
  border-bottom: 2px dashed ${colors.stitchLine};
  color: ${colors.ink};
  font-family: ${fontStack};
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

/* One button style for every toolbar action.
   $active = a toggled-on state (e.g. graphical view). */
const ToolButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 2px solid ${({ $active }) => ($active ? colors.ink : colors.stitchLine)};
  border-radius: 10px;
  background: ${({ $active }) => ($active ? colors.ink : "transparent")};
  color: ${({ $active }) => ($active ? colors.paper : colors.ink)};
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${colors.ink};
    background: ${({ $active }) =>
      $active ? colors.ink : "rgba(22, 48, 32, 0.08)"};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* ---------- Stitch colour ---------- */
const ColorLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  font-weight: 600;
`;

const ColorField = styled.div`
  position: relative;
`;

const ColorButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 6px;
  border: 2px solid ${colors.ink};
  border-radius: 10px;
  background: ${colors.surface};
  color: ${colors.ink};
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;

const Swatch = styled.span`
  width: 24px;
  height: 24px;
  border: 2px solid ${colors.ink};
  border-radius: 6px;
  background: ${(props) => props.$color};
`;

const PickerContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 5;
  overflow: hidden;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  box-shadow: 0 4px 0 ${colors.ink};
`;

const stitchTypeMap = {
  mr: "Magic Ring",
  ch: "Chain",
  sc: "Single Crochet",
  hdc: "Half Double Crochet",
  dc: "Double Crochet",
  tr: "Treble Crochet",
};

export default function SubMenuBar() {
  const selectedNode = useSelector((state) => state.editor.selectedNode);
  const selectedMenu = useSelector((state) => state.editor.selectedMenu);
  const graphicalView = useSelector((state) => state.editor.graphicalView);
  const canUndo = useSelector((state) => state.editor.history.length > 0);
  const canRedo = useSelector((state) => state.editor.future.length > 0);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const pattern = useSelector((state) => state.editor.pattern);
  const { _id } = useSelector((state) => state.user.userDetail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const create = useCreatePattern();
  const { mutate: savePattern, isPending: isSaving } = create;

  const view3D = useSelector((state) => state.editor.view3D);
  const dispatch = useDispatch();

  const stitchColor = selectedNode?.color
    ? typeof selectedNode.color === "string"
      ? selectedNode.color
      : `#${selectedNode.color.toString(16).padStart(6, "0")}`
    : "#ffffff";

  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempColor, setTempColor] = useState(stitchColor);
  const pickerRef = useRef(null);
  const navigate = useNavigate();

  const handleNewClick = () => setShowNewModal(true);
  const handleCancelNew = () => setShowNewModal(false);
  const handleConfirmNewPattern = () => {
    setShowNewModal(false);
    dispatch(resetEditor());
  };
  const handleSaveClick = () => {
    if (pattern.nodes.length === 0) {
      alert("Pattern must have at least one stitch.");
      return;
    }
    setShowSaveModal(true);
  };

  const handleConfirmSave = (name) => {
    const data = { name, stitches: pattern.nodes, links: pattern.links };
    savePattern(data, {
      onSuccess: () => {
        toast.success("Pattern saved!");
        dispatch(resetEditor());
        navigate(`/user/${_id}`);
      },
      onError: () => {
        toast.error("Failed to save pattern.");
      },
    });
  };
  const handleConfirmDiscard = () => {
    dispatch(resetEditor());
    setShowDiscardModal(false);
  };

  const importPattern = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Basic structure check
        if (
          typeof data !== "object" ||
          !Array.isArray(data.nodes) ||
          !Array.isArray(data.links)
        ) {
          throw new Error(
            "Invalid pattern structure. Must include 'nodes' and 'links' arrays."
          );
        }

        // At least one node
        if (data.nodes.length === 0) {
          throw new Error("Pattern must include at least one node.");
        }

        // Validate all nodes
        const nodeIds = new Set();
        for (const node of data.nodes) {
          if (
            typeof node.id !== "string" ||
            typeof node.type !== "string" ||
            typeof node.start !== "boolean" ||
            !("previous" in node)
          ) {
            throw new Error(
              "Each node must have at least 'id', 'type', 'start', and 'previous' fields."
            );
          }
          nodeIds.add(node.id);
        }

        // Validate all links
        for (const link of data.links) {
          if (
            typeof link.source !== "string" ||
            typeof link.target !== "string"
          ) {
            throw new Error(
              "Each link must have a 'source' and 'target' string."
            );
          }

          if (!nodeIds.has(link.source) || !nodeIds.has(link.target)) {
            throw new Error(
              `Link source/target does not reference an existing node: ${link.source} → ${link.target}`
            );
          }
        }

        // If everything is valid, use it
        dispatch(setStitches(data.nodes));
        dispatch(setLinks(data.links));
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    };

    input.click(); // Trigger file dialog
  };

  const generateInstructions = () => {
    if (!pattern?.nodes?.length) return;

    const nodesById = Object.fromEntries(pattern.nodes.map((n) => [n.id, n]));

    const instructions = [];

    // Handle magic ring start
    const startNode = pattern.nodes.find(
      (n) => n.start === true && n.type === "mr"
    );
    if (startNode) {
      instructions.push(`Round 1: Start with a Magic Ring.`);
    }

    for (const node of pattern.nodes) {
      if (node.type === "mr") continue; // Already handled
      const typeName = stitchTypeMap[node.type] || node.type;
      const index = node.index;

      let line = `Stitch ${index + 1}: ${typeName}`;

      // If inserting into another stitch
      if (node.inserts && nodesById[node.inserts]) {
        const insertedIndex = nodesById[node.inserts].index;
        line += ` into Stitch ${insertedIndex + 1}`;
      }

      instructions.push(line + ".");
    }

    const content = instructions.join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "crochet-instructions.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setTempColor(stitchColor);
  }, [stitchColor]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerVisible(false);
        if (tempColor !== stitchColor) {
          dispatch(updateSelectedNodeColor(tempColor));
        }
      }
    };

    if (pickerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerVisible, tempColor, stitchColor, dispatch]);

  const togglePicker = (e) => {
    e.stopPropagation();
    if (!pickerVisible) {
      setPickerVisible(true);
    }
  };

  const handleColorChange = (color) => {
    setTempColor(color.hex);
  };

  if (selectedMenu === null) return null;

  return (
    <>
      {isSaving && <Spinner overlay />}

      <NewPatternModal
        isOpen={showNewModal}
        onConfirm={handleConfirmNewPattern}
        onCancel={handleCancelNew}
      />
      <SavePatternModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleConfirmSave}
        isLoading={isSaving}
      />

      <DiscardChangesModal
        isOpen={showDiscardModal}
        onCancel={() => setShowDiscardModal(false)}
        onDiscard={handleConfirmDiscard}
      />

      <Bar>
        <Items>
          {selectedMenu === "Stitch" && (
            <ColorLabel>
              Stitch color
              <ColorField>
                <ColorButton type="button" onClick={togglePicker}>
                  <Swatch $color={tempColor} />
                  <span>{tempColor.toUpperCase()}</span>
                </ColorButton>
                {pickerVisible && (
                  <PickerContainer
                    ref={pickerRef}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChromePicker
                      color={tempColor}
                      onChange={handleColorChange}
                    />
                  </PickerContainer>
                )}
              </ColorField>
            </ColorLabel>
          )}

          {selectedMenu === "View" && (
            <>
              <ToolButton
                type="button"
                $active={graphicalView}
                aria-pressed={graphicalView}
                onClick={() => dispatch(setGraphicalView())}
              >
                <FaProjectDiagram />
                Graphical view
              </ToolButton>

              <ToolButton type="button" onClick={() => dispatch(toggle3D())}>
                <FaThLarge />
                {view3D ? "Switch to 2D" : "Switch to 3D"}
              </ToolButton>
            </>
          )}

          {selectedMenu === "Edit" && (
            <>
              <ToolButton
                type="button"
                disabled={!canUndo}
                onClick={() => dispatch(undo())}
              >
                <FaUndo />
                Undo
              </ToolButton>
              <ToolButton
                type="button"
                disabled={!canRedo}
                onClick={() => dispatch(redo())}
              >
                <FaRedo />
                Redo
              </ToolButton>
            </>
          )}

          {selectedMenu === "File" && (
            <>
              <ToolButton type="button" onClick={handleNewClick}>
                <FaFileAlt />
                New pattern
              </ToolButton>

              {isLoggedIn ? (
                <>
                  <ToolButton type="button" onClick={handleSaveClick}>
                    <FaSave />
                    Save
                  </ToolButton>

                  <ToolButton
                    type="button"
                    onClick={() => generateInstructions()}
                  >
                    <FaFileExport />
                    Generate instructions
                  </ToolButton>
                </>
              ) : (
                <ToolButton type="button" onClick={() => importPattern()}>
                  <FaFileImport />
                  Import pattern
                </ToolButton>
              )}
            </>
          )}
        </Items>
      </Bar>
    </>
  );
}