import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { ChromePicker } from 'react-color';
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedNodeColor, setGraphicalView, toggle3D, undo, redo, resetEditor, setStitches, setLinks } from "./editorSlice";
import NewPatternModal from "./NewPatternmodal"; 
import SavePatternModal from "./SavePatternModal"; // import the modal
import {useCreatePattern} from '../../hooks/usePattern'
import {
  FaUndo,
  FaRedo,
  FaProjectDiagram,
  FaThLarge,
  FaFileAlt,
  FaSave,
  FaTrashAlt,
  FaFileExport,
  FaFileImport
} from "react-icons/fa";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import DiscardChangesModal from "./DiscardChangesModal";



const Menubar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--sixth-color);
  padding: 8px 36px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const MenuItemsContainer = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  gap: 10px;
`;

const ViewButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 15px;
  font-weight: 500; 
  background-color: ${({ $active }) =>
    $active ? 'rgba(0, 0, 255, 0.1)' : 'transparent'};
  border-radius: 6px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 255, 0.1);
  }
`;

const EditButton = styled(ViewButton)`
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  &:hover {
    background-color: ${({ $disabled }) =>
      $disabled ? "transparent" : "rgba(0, 128, 0, 0.1)"};
  }
`;


const ColorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: #f1f3f5;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.25);
  }
`;

const ColorPreview = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${(props) => props.$color};
`;

const ColorText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #333;
  letter-spacing: 0.3px;
`;

const PickerContainer = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  z-index: 5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
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
  const canvas = useSelector((state) => state.editor.canvasRef);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false); 
  const [showDiscardModal, setShowDiscardModal] = useState(false); 
  const pattern = useSelector((state) => state.editor.pattern);
  const {_id} = useSelector(state => state.user.userDetail)
  const isLoggedIn = useSelector(state=>state.user.isLoggedIn)
  const create = useCreatePattern();
  const { mutate: savePattern, isPending: isSaving } = create;


  const view3D = useSelector((state) => state.editor.view3D);
  const dispatch = useDispatch();

  const stitchColor = selectedNode?.color
    ? typeof selectedNode.color === 'string'
      ? selectedNode.color
      : `#${selectedNode.color.toString(16).padStart(6, '0')}`
    : '#ffffff';

  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempColor, setTempColor] = useState(stitchColor);
  const pickerRef = useRef(null);
  const navigate = useNavigate()
  
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
    console.log('data to save', data)
    savePattern(data, {
      onSuccess: () => {
        toast.success("Pattern saved!");
        dispatch(resetEditor());
        navigate(`/user/${_id}`)
      },
      onError: () => {
        toast.error("Failed to save pattern.");
      },
    });
  };
  const handleConfirmDiscard = () =>{
    dispatch(resetEditor())
    setShowDiscardModal(false)
  }

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
        throw new Error("Invalid pattern structure. Must include 'nodes' and 'links' arrays.");
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
          throw new Error("Each node must have at least 'id', 'type', 'start', and 'previous' fields.");
        }
        nodeIds.add(node.id);
      }

      // Validate all links
      for (const link of data.links) {
        if (
          typeof link.source !== "string" ||
          typeof link.target !== "string"
        ) {
          throw new Error("Each link must have a 'source' and 'target' string.");
        }

        if (!nodeIds.has(link.source) || !nodeIds.has(link.target)) {
          throw new Error(`Link source/target does not reference an existing node: ${link.source} → ${link.target}`);
        }
      }

      // If everything is valid, use it 
      dispatch(setStitches(data.nodes))
      dispatch(setLinks(data.links))

    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };

  input.click(); // Trigger file dialog
  };
  const stitchTypeMap = {
  mr: "Magic Ring",
  ch: "Chain",
  sc: "Single Crochet",
  hdc: "Half Double Crochet",
  dc: "Double Crochet",
  tr: "Treble Crochet",
};

const generateInstructions = () => {
  if (!pattern?.nodes?.length) return;

  const nodesById = Object.fromEntries(pattern.nodes.map(n => [n.id, n]));
  const indexMap = Object.fromEntries(pattern.nodes.map(n => [n.id, n.index]));

  const instructions = [];

  // Handle magic ring start
  const startNode = pattern.nodes.find(n => n.start === true && n.type === 'mr');
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

  if (selectedMenu === null) return;

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
      onClose={() => setShowDiscardModal(false)}
      onDiscard={handleConfirmDiscard}
    />

    <Menubar>
      <MenuItemsContainer>
        {selectedMenu === 'Stitch' && (
          <MenuItem>
            Stitch Color
            <ColorInput onClick={togglePicker}>
              <ColorPreview $color={tempColor} />
              <ColorText>{tempColor.toUpperCase()}</ColorText>
              {pickerVisible && (
                <PickerContainer ref={pickerRef} onClick={(e) => e.stopPropagation()}>
                  <ChromePicker color={tempColor} onChange={handleColorChange} />
                </PickerContainer>
              )}
            </ColorInput>
          </MenuItem>
        )}

        {selectedMenu === 'View' && (
          <>
            <ViewButton $active={graphicalView} onClick={() => dispatch(setGraphicalView())}>
              <FaProjectDiagram />
              Graphical View
            </ViewButton>

            <ViewButton onClick={() => dispatch(toggle3D())}>
              <FaThLarge />
              {view3D ? 'Switch to 2D' : 'Switch to 3D'}
            </ViewButton>
          </>
        )}

        {selectedMenu === 'Edit' && (
          <>
            <EditButton $disabled={!canUndo} onClick={() => dispatch(undo())}>
            <FaUndo />
            Undo
          </EditButton>
          <EditButton $disabled={!canRedo} onClick={() => dispatch(redo())}>
            <FaRedo />
            Redo
          </EditButton>

          </>
        )}
        {selectedMenu === "File" && (
  <>
    <EditButton onClick={handleNewClick}>
      <FaFileAlt />
      New Pattern
    </EditButton>

    {isLoggedIn ? (
      <>
        <EditButton onClick={handleSaveClick}>
          <FaSave />
          Save
        </EditButton>

        <EditButton onClick={() => generateInstructions()}>
          <FaFileExport />
          Generate Instructions
        </EditButton>
      </>
    ) : (
      <>
        <EditButton onClick={() => importPattern()}>
          <FaFileImport />
          Import Pattern
        </EditButton>
      </>
    )}
  </>
)}
        



      </MenuItemsContainer>
    </Menubar>
    </>
  );
}
