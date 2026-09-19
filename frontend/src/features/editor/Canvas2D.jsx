import styled from "styled-components";
import StitchesBar from "./StitchesBar";
import {
  FaPlus,
  FaMinus,
  FaExpand,
  FaCompress,
  FaDownload,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "force-graph";
import BeginningModal from "./BeginningModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleExpandCanvas, insertStitch, setCanvasRef } from "./editorSlice";
import CrochetCanvas from "./CanvasDrawingsFor2D";
import Vector from "../utils/vector";
import stitchDistances from "../utils/stitchDistances";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
const stitchCanvas = new CrochetCanvas();

const Container = styled.div`
  display: flex;
  position: relative;
`;

const ExportButton = styled.div`
  cursor: pointer;
  position: absolute;
  border-radius: 30px;
  background-color: var(--secondary-color);
  bottom: 85px;
  right: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 99;
  &:hover {
    background-color: var(--primary-color);
  }
`;

const CanvasContainer = styled.div`
  width: 100%;
  background-color: var(--third-color);
  margin: ${({ $expanded }) => ($expanded ? "0px" : "10px 20px")};
  height: ${({ $expanded, $selectedMenu }) =>
    $expanded ? "100%" : $selectedMenu ? "65vh" : "75vh"};
  border-radius: 30px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
`;

const ExpandButton = styled.div`
  cursor: pointer;
  position: absolute;
  border-radius: 30px;
  background-color: var(--secondary-color);
  bottom: 35px;
  right: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 99;
  &:hover {
    background-color: var(--primary-color);
  }
`;

const ZoomButtonsContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99;
  top: 28px;
  right: 40px;
`;

const ZoomButton = styled.div`
  cursor: pointer;
  padding: 10px;
  background-color: var(--secondary-color);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: var(--primary-color);
  }
`;

export default function Canvas2D() {
  const isEmpty =
    useSelector((state) => state.editor.pattern.nodes?.length) === 0;
  const expanded = useSelector((state) => state.editor.expanded);
  const graphicalView = useSelector((state) => state.editor.graphicalView);
  const selectedMenu = useSelector((state) => state.editor.selectedMenu);
  const patternData = useSelector((state) => state.editor.pattern);
  const [isBeginningModalOpen, setIsBeginningModalOpen] = useState(isEmpty);
  const [selectedNode, setSelectedNode] = useState(null);
  const hoveredNodeRef = useRef(null);
  const queryClient = useQueryClient();
  const containerRef = useRef();
  const positionsRef = useRef({});

  const graphRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (graphRef.current) {
      // Re-apply the same data to trigger a redraw
      graphRef.current.graphData(JSON.parse(JSON.stringify(patternData)));
    }
  }, [hoveredNodeRef]);

  useEffect(() => {
    if (isEmpty) {
      setIsBeginningModalOpen(true);
    }
  }, [isEmpty]);

  // Function to export canvas as PNG
  const exportCanvasAsPNG = async () => {
    try {
      const canvas = containerRef.current?.querySelector("canvas");
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      // Wait for any pending animations to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force a redraw to ensure everything is rendered
      if (graphRef.current) {
        graphRef.current.graphData(JSON.parse(JSON.stringify(patternData)));
        // Wait for the redraw to complete
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Get the canvas data
      const dataURL = canvas.toDataURL("image/png", 1.0);
      //console.log(dataURL);
      const typeMatch = dataURL.match(/data:image\/([^;]+);base64,/);
      const base64Match = dataURL.match(/,([^]+)/);

      if (typeMatch && base64Match) {
        const imageType = typeMatch[1]; // 'png' in this case
        const base64Data = base64Match[1]; // 'erweerfeargrafg' in this case
        const file = {
          mimeType: imageType,
          base64Data,
        };
        queryClient.setQueryData(["patternSaved"], file);
      }

      //image mutation
      // const imageUploadMutation = useMutation({
      //   mutationFn: async ({ imageType, base64Data }) => {
      //     const file = base64ToFile(base64Data,,imageType);
      //   },
      // });
      // Create download link
      const link = document.createElement("a");
      link.download = `crochet-pattern-${new Date().getTime()}.png`;
      link.href = dataURL;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("PNG export successful");
    } catch (error) {
      console.error("Error exporting PNG:", error);

      // Alternative method using html2canvas if the direct method fails
      try {
        //  install html2canvas: npm install html2canvas
        const html2canvas = (await import("html2canvas")).default;

        const canvas = await html2canvas(containerRef.current, {
          backgroundColor: getComputedStyle(document.documentElement)
            .getPropertyValue("--third-color")
            .trim(),
          scale: 2, // Higher quality
          useCORS: true,
          allowTaint: true,
        });

        const dataURL = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.download = `crochet-pattern-${new Date().getTime()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("PNG export successful using html2canvas");
      } catch (html2canvasError) {
        console.error("html2canvas export also failed:", html2canvasError);
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = ForceGraph2D()(containerRef.current)
      .backgroundColor(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--third-color")
          .trim()
      )
      .nodeRelSize(5)
      .nodeColor(() => "transparent")
      .linkColor(() => "#ccc")
      .linkWidth(0)
      .nodeCanvasObjectMode(() => "before")
      .nodeCanvasObject((node, ctx) => {
        const isHovered = node.id === hoveredNodeRef.current;

        if (node.type === "ch" || node.type === "mr") {
          stitchCanvas.draw(node.type, ctx, node.x, node.y, node.color);
        }
        if (isHovered) {
          const radius = 8;
          const gradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            radius
          );
          gradient.addColorStop(0, "rgba(234, 142, 75, 0.8)");
          gradient.addColorStop(1, "rgba(234, 142, 75, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          ctx.fill();
        }

        positionsRef.current[node.id] = {
          x: node.x,
          y: node.y,
          z: node.z || 0,
        };
      })
      .linkCanvasObjectMode((link) => {
        if (link.inserts) return "replace";
        return "before";
      })

      .linkCanvasObject((link, ctx) => {
        if (link.source.type === "hole") {
          // set its position in the middle of its surrounding nodes
          let newX = 0;
          let newY = 0;
          link.source.surroundingNodes.forEach((uuid) => {
            let node = this.getNode(uuid);
            newX += node.x;
            newY += node.y;
          });
          newX /= link.source.surroundingNodes.length;
          newY /= link.source.surroundingNodes.length;
          link.source.x = newX;
          link.source.y = newY;
        }
        // Calculate Angle and Center point for placement
        let n1Vec = new Vector(link.source.x, link.source.y, 0);
        let n2Vec = new Vector(link.target.x, link.target.y, 0);
        let linkVec = n1Vec.subtract(n2Vec).unit();
        let perpendicularVec = new Vector(0, 1, 0);

        let angle = perpendicularVec.unitAngleTo(linkVec);
        let sourceX = link.source.x;
        let sourceY = link.source.y;
        let middleX = (sourceX + link.target.x) / 2;
        let middleY = (sourceY + link.target.y) / 2;
        let x = (sourceX + middleX) / 2;
        let y = (sourceY + middleY) / 2;

        let color = link.source.color;

        // Draw on html5 canvas if the edge is of type insert
        if (link.inserts) {
          ctx.save();
          ctx.translate(x, y); //translate to center of shape
          if (linkVec.x < 0) {
            ctx.rotate(Math.PI + angle);
          } else {
            ctx.rotate(Math.PI - angle);
          }

          ctx.translate(-x, -y);

          stitchCanvas.draw(link.source.type, ctx, x, y, link.source.color);
          ctx.restore();
        } else if (link.slipStitch) {
          stitchCanvas.draw("slst", ctx, middleX, middleY, color);
        }
      })
      .onNodeClick((node) => {
        if (node?.id) setSelectedNode(node.id);
      })
      .onNodeHover((node) => {
        hoveredNodeRef.current = node?.id;
      });

    graph
      .d3Force("link")
      .distance((link) =>
        link.inserts || link.slipstitch ? stitchDistances[link.source.type] : 0
      );
    graph.cooldownTime(Infinity).d3Force("charge").strength(-100);

    graphRef.current = graph;

    return () => {
      graph._destructor?.();
    };
  }, []);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.graphData(JSON.parse(JSON.stringify(patternData)));
    }
  }, [patternData]);

  useEffect(() => {
    if (selectedNode) {
      const currentPositions = positionsRef.current;
      dispatch(
        insertStitch({ node: selectedNode, positions: currentPositions })
      );
    }
    return () => setSelectedNode(null);
  }, [selectedNode, dispatch]);

  useEffect(() => {
    return () => {
      if (graphRef.current) {
        graphRef.current.graphData({ nodes: [], links: [] });
      }
    };
  }, []);

  const handleZoom = (zoomIn = true) => {
    if (!graphRef.current) return;
    const zoomAmount = zoomIn ? 1.2 : 0.8;
    graphRef.current.zoom(graphRef.current.zoom() * zoomAmount, 300);
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
        />
        <ZoomButtonsContainer>
          <ZoomButton onClick={() => handleZoom(true)}>
            <FaPlus size={12} />
          </ZoomButton>
          <ZoomButton onClick={() => handleZoom(false)}>
            <FaMinus size={12} />
          </ZoomButton>
        </ZoomButtonsContainer>
        <ExportButton onClick={exportCanvasAsPNG}>
          <FaDownload size={16} />
        </ExportButton>
        <ExpandButton onClick={() => dispatch(toggleExpandCanvas())}>
          {expanded ? <FaCompress size={16} /> : <FaExpand size={16} />}
        </ExpandButton>
      </Container>
    </>
  );
}
