import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Canvas from "./Canvas";
import { setUserNo, setUsers } from "./redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

interface RoomProps {
  socket: Socket;
}

const Room: React.FC<RoomProps> = ({ socket }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState<string>("#000000");
  const [elements, setElements] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [tool, setTool] = useState<string>("pencil");
  const dispatch = useDispatch();
  const { userNo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    socket.on("message", (data: { message: string }) => {
      toast.info(data.message);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("users", (data: any) => {
      dispatch(setUsers(data));
      dispatch(setUserNo(data.length));
    });
  }, [dispatch, socket]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      setElements([]);
    }
  };

  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.filter((ele, index) => index !== elements.length - 1)
    );
  };

  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) =>
      prevHistory.filter((ele, index) => index !== history.length - 1)
    );
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasImage = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = canvasImage;
      downloadLink.download = "canvas_image.png";
      downloadLink.click();
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <h1 className="display-5 pt-4 pb-3 text-center">
          React Drawing App - users online:{userNo}
        </h1>
      </div>
      <div className="row justify-content-center align-items-center text-center py-2">
        <div className="col-md-2">
          <div className="color-picker d-flex align-items-center justify-content-center">
            Color Picker : &nbsp;
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="pencil"
              value="pencil"
              checked={tool === "pencil"}
              onChange={() => setTool("pencil")}
            />
            <label className="form-check-label" htmlFor="pencil">
              Pencil
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="line"
              value="line"
              checked={tool === "line"}
              onChange={() => setTool("line")}
            />
            <label className="form-check-label" htmlFor="line">
              Line
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="rect"
              value="rect"
              checked={tool === "rect"}
              onChange={() => setTool("rect")}
            />
            <label className="form-check-label" htmlFor="rect">
              Rectangle
            </label>
          </div>
        </div>

        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={elements.length === 0}
            onClick={undo}
          >
            Undo
          </button>
          &nbsp;&nbsp;
          <button
            type="button"
            className="btn btn-outline-primary ml-1"
            disabled={history.length < 1}
            onClick={redo}
          >
            Redo
          </button>
        </div>
        <div className="row ">
          <div className="col-md-1 mb-3">
            <div className="color-picker d-flex align-items-center justify-content-center">
              <input
                type="button"
                className="btn btn-danger"
                value="Clear Canvas"
                onClick={clearCanvas}
              />
            </div>
          </div>
          <div className="col-md-1 mb-3">
            <div className="color-picker d-flex align-items-center justify-content-center">
              <input
                type="button"
                className="btn btn-danger"
                value="Download Canvas"
                onClick={handleDownload}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <Canvas
          canvasRef={canvasRef}
          ctx={ctx}
          color={color}
          setElements={setElements}
          elements={elements}
          tool={tool}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Room;

interface RootState {
  user: {
    userNo: number;
  };
}

