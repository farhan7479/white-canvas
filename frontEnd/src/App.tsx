import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import ClientRoom from "./ClientRoom";
import JoinCreateRoom from "./JoinCreateRoom";
import Room from "./Room";
import Sidebar from "./Sidebar";

import "./style.css";

const server = "http://localhost:8000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: 99999,
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App: React.FC = () => {
  const [isLogin, token] = useAuth();

  const { roomJoined, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (roomJoined) {
      socket.emit("user-joined", user);
    }
  }, [roomJoined, user]);

  return (
    <BrowserRouter>
      <div className="home">
        <ToastContainer />
        {roomJoined ? (
          <>
            <Sidebar socket={socket} />
            {user.presenter ? (
              <Room socket={socket} />
            ) : (
              <ClientRoom socket={socket} />
            )}
          </>
        ) : (
          <JoinCreateRoom />
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;

