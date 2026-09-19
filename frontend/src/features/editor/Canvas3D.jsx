   import { colors } from "../../ui/theme";
   import {
     Container,
     CanvasContainer,
     ExpandButton,
     ZoomButtonsContainer,
     ZoomButton,
   } from "./EditorStyles";
import StitchesBar from "./StitchesBar";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import BeginningModal from "./BeginningModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleExpandCanvas, insertStitch, selectNode } from "./editorSlice";
import { FaExpand, FaCompress } from "react-icons/fa";
import stitchDistances from '../utils/stitchDistances';
import CrochetStitchDrawings3d from './CanvasDrawingsFor3D'
import Vector from "../utils/vector";

export default function Canvas3D() {
 const isEmpty =
    useSelector((state) => state.editor.pattern.nodes.length) === 0;

  const expanded = useSelector((state) => state.editor.expanded);
  const graphicalView = useSelector((state) => state.editor.graphicalView);
  const selectedMenu = useSelector((state) => state.editor.selectedMenu);
  const [isBeginningModalOpen, setIsBeginningModalOpen] = useState(isEmpty);
  const [selectedNode, setSelectedNode] = useState(null);
  const containerRef = useRef();
  const graphRef = useRef();
  const patternData = useSelector((state) => state.editor.pattern);
  const dispatch = useDispatch();
  const stitchPaths = new CrochetStitchDrawings3d(0xff0000);
  const hoverNodeRef = useRef();
  const preloadedNodeObjects = useRef({});
  const preloadedLinkObjects = useRef({});

  const getNodeObject = (node) => preloadedNodeObjects.current[node.id] || null;

const getLinkObject = (link) =>
  preloadedLinkObjects.current[`${link.source}-${link.target}`] || false;

  const getNodeById = (id) => {
    return patternData.nodes.find((node) => node.id === id);
  };
  useEffect(() => {
  const preloadObjects = () => {
    const nodeCache = {};
    const linkCache = {};

    patternData.nodes.forEach((node) => {
      const colorInt = parseInt((node.color || "#999999").replace("#", ""), 16);
      if (graphicalView) {
        nodeCache[node.id] = new THREE.Mesh(
          new THREE.SphereGeometry(6, 16, 16),
          new THREE.MeshBasicMaterial({ color: node.color || "#999" })
        );
      } else {
        if (["mr", "ch", "hole"].includes(node.type)) {
          nodeCache[node.id] = stitchPaths.draw(node.type, colorInt);
        }
      }
    });

    patternData.links.forEach((link) => {
      if(graphicalView){
        return;
      }
      const source = patternData.nodes.find((n) => n.id === link.source);
      if (!source) return;
      const colorInt = parseInt((source.color || "#000000").replace("#", ""), 16);
      if (link.inserts && source?.type) {
        linkCache[`${link.source}-${link.target}`] = stitchPaths.draw(source.type, colorInt);
      } else if (link.slipStitch) {
        linkCache[`${link.source}-${link.target}`] = stitchPaths.draw("slst", colorInt);
      }
    });

    preloadedNodeObjects.current = nodeCache;
    preloadedLinkObjects.current = linkCache;
  };

  preloadObjects();
}, [patternData, graphicalView]);


  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const bgColor = colors.surface;


  const graphInstance = ForceGraph3D()(container)
    .backgroundColor(bgColor)
    .nodeAutoColorBy("id")
    .nodeRelSize(5)
    .nodeColor(() => "transparent")
    .nodeOpacity(0.5)
    .nodeThreeObjectExtend(true)
    .nodeThreeObject((node) => getNodeObject(node))
    .linkWidth(0)
    .linkOpacity(1)
    .linkColor(() => "#ccc")
    .linkDirectionalArrowLength(0)
    .linkDirectionalArrowRelPos(1)
    .linkDirectionalArrowColor(() => "black")
    .linkThreeObjectExtend(true)
    .linkThreeObject((link)=>getLinkObject(link))
    .linkPositionUpdate((linkObject, { start, end }, link) => {
                    if(!linkObject){
                        if(link.source.type === 'hole'){
                        let newX = 0;
                        let newY = 0;
                        let newZ = 0;
                        link.source.surroundingNodes.forEach(id => {
                            let node = getNodeById(id)
                            newX += node.x;
                            newY += node.y;
                            newZ += node.z;
                        })
                        newX /= node.surroundingNodes.length;
                        newY /= node.surroundingNodes.length;
                        newZ /= node.surroundingNodes.length;
                        node.x = newX;
                        node.y = newY;
                        node.z = newZ;
                    }
                        return true;
                    }

                    let position;
                    let centerPoint = Object.assign(...['x', 'y', 'z'].map(c => ({
                        [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                    })));
                    let startPoint = {
                        "x": start.x,
                        "y": start.y,
                        "z": start.z,
                    };
                    let startCenterMiddlePoint = {
                        "x": (startPoint.x +  centerPoint.x) / 2,
                        "y": (startPoint.y +  centerPoint.y) / 2,
                        "z": (startPoint.z +  centerPoint.z) / 2 ,
                    };
                    let secondMiddlePoint = {
                        "x": (startPoint.x +  startCenterMiddlePoint.x) / 2,
                        "y": (startPoint.y +  startCenterMiddlePoint.y) / 2,
                        "z": (startPoint.z +  startCenterMiddlePoint.z) / 2 ,
                    };
                    if(link.slipstitch){
                        position = centerPoint;
                    }else{
                        position = secondMiddlePoint;

                        let screenCoordSource = graphInstance.graph2ScreenCoords(link.source.x, link.source.y, link.source.z);
                        let screenCoordTarget = graphInstance.graph2ScreenCoords(link.target.x, link.target.y, link.target.z);

                        let spriteUpVec = new Vector(0, 1, 0);
                        let linkVec = new Vector(
                            Math.abs(screenCoordSource.x - screenCoordTarget.x),
                            Math.abs(screenCoordSource.y - screenCoordTarget.y),
                            Math.abs(screenCoordSource.z - screenCoordTarget.z)
                        );
                        let radians = spriteUpVec.angleTo(linkVec);
                        let stitchAbove = screenCoordSource.y >= screenCoordTarget.y;
                        let stitchRight = screenCoordSource.x >= screenCoordTarget.x;

                        if(stitchAbove){
                            radians += Math.PI;
                            if(!stitchRight){
                                radians *= -1;
                            }
                        }else{
                            if(stitchRight){
                                radians *= -1;
                            }
                        }
                        linkObject?.children[0]?.material.setValues({
                            rotation: radians
                        })
                    }

                    Object.assign(linkObject.position, position);
                })
    .showNavInfo(false)
    .enableNodeDrag(true)
      .onNodeClick((node) => {
        if (node?.id) setSelectedNode(node.id);
      }).numDimensions(3);

    graphInstance.cooldownTime(Infinity).d3Force('charge')
          .strength(-100)

    graphInstance.cooldownTime(Infinity)
        .d3Force('link')
        .distance(link => link.inserts || link.slipstitch ? stitchDistances[link.source.type] : 0);


    graphRef.current = graphInstance;
  }, [graphicalView]);


  useEffect(() => {
    if (!graphRef.current) return;

    const graph = graphRef.current;
    graph.graphData(JSON.parse(JSON.stringify(patternData)));
  }, [patternData, graphicalView]);

  useEffect(() => {
    if (selectedNode && graphRef.current) {
      const graphNodes = graphRef.current.graphData().nodes;
      const currentPositions = {};

      graphNodes.forEach((node) => {
        currentPositions[node.id] = {
          x: node.x,
          y: node.y,
          z: node.z || 0,
        };
      });

      dispatch(insertStitch({ node: selectedNode, positions: currentPositions }));
    }

    return () => setSelectedNode(null);
  }, [selectedNode, dispatch]);


  const handleZoom = (zoomIn = true) => {
    if (!graphRef.current) return;

    const distance = graphRef.current
      .camera()
      .position.distanceTo(graphRef.current.scene().position);

    const zoomFactor = zoomIn ? 0.8 : 1.4;
    graphRef.current.camera().translateZ(distance * (zoomFactor - 1));
  };
  

  return (
    <>
      {isBeginningModalOpen && (
        <BeginningModal
          onClose={() => setIsBeginningModalOpen(false)}
          isOpen={isBeginningModalOpen}
        />
      )}
      <Container>
        <StitchesBar />
        <CanvasContainer
          $expanded={expanded}
          $selectedMenu={selectedMenu}
          ref={containerRef}
        ></CanvasContainer>
        <ZoomButtonsContainer>
          <ZoomButton type="button" aria-label="Zoom in" onClick={() => handleZoom(true)}>
            <FaPlus size={12} />
          </ZoomButton>
          <ZoomButton type="button" aria-label="Zoom out" onClick={() => handleZoom(false)}>
            <FaMinus size={12} />
          </ZoomButton>
        </ZoomButtonsContainer>

        <ExpandButton onClick={() => dispatch(toggleExpandCanvas())}>
          {expanded ? <FaCompress size={16} /> : <FaExpand size={16} />}
        </ExpandButton>
      </Container>
    </>
  );
}
