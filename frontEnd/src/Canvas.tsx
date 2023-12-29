import React, { useEffect, useLayoutEffect, useState, useRef, MouseEvent } from "react";
import rough from "roughjs/bundled/rough.esm";
import { Socket } from "socket.io-client";

const generator = rough.generator();

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>;
  color: string;
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  elements: CanvasElement[];
  tool: string;
  socket: Socket;
}

interface CanvasElement {
  offsetX: number;
  offsetY: number;
  width?: number;
  height?: number;
  stroke: string;
  element: string;
  path?: number[][];
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  ctx,
  color,
  setElements,
  elements,
  tool,
  socket,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");

    if (context) {
      context.strokeWidth = 5;
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = color;
      context.lineWidth = 5;
      ctx.current = context;
    }
  }, []);

  useEffect(() => {
    if (ctx.current) {
      ctx.current.strokeStyle = color;
    }
  }, [color]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          element: tool,
        },
      ]);
    } else {
      setElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: color, element: tool },
      ]);
    }

    setIsDrawing(true);
  };

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current!);
    if (elements.length > 0 && ctx.current) {
      ctx.current.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
    }
    elements.forEach((ele) => {
      if (ele.element === "rect" && ctx.current) {
        roughCanvas.draw(
          generator.rectangle(ele.offsetX, ele.offsetY, ele.width || 0, ele.height || 0, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "line" && ctx.current) {
        roughCanvas.draw(
          generator.line(ele.offsetX, ele.offsetY, ele.width || 0, ele.height || 0, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "pencil" && ctx.current) {
        roughCanvas.linearPath(ele.path || [], {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
      }
    });
    const canvasImage = canvasRef.current!.toDataURL();
    if (canvasImage) {
      socket.emit("drawing", canvasImage);
    }
  }, [elements, socket]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "rect") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (tool === "line") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX,
                height: offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (tool === "pencil") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                path: [...(ele.path || []), [offsetX, offsetY]],
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div
      className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "500px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;

