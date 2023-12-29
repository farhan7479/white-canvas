import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { setUserNo, setUsers } from "./redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

interface ClientRoomProps {
  socket: Socket;
}

const ClientRoom: React.FC<ClientRoomProps> = ({ socket }) => {
  const dispatch = useDispatch();
  const { userNo } = useSelector((state: RootState) => state.user);
  const imgRef = useRef<HTMLImageElement>(null);

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

  useEffect(() => {
    socket.on("canvasImage", (data: string) => {
      if (imgRef.current) {
        imgRef.current.src = data;
      }
    });
  }, [socket]);

  return (
    <div className="container-fluid">
      <div className="row pb-2">
        <h1 className="display-5 pt-4 pb-3 text-center">
          React Drawing App - users online: {userNo}
        </h1>
      </div>
      <div className="row mt-5">
        <div
          className="col-md-8 overflow-hidden border border-dark px-0 mx-auto
          mt-3"
          style={{ height: "500px" }}
        >
          <img className="w-100 h-100" ref={imgRef} src="" alt="image" />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;

interface RootState {
  user: {
    userNo: number;
  };
}

