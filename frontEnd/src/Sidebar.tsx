import React, { useRef } from "react";
import { Socket } from "socket.io-client";
import { useSelector } from 'react-redux';

interface SidebarProps {
  socket: Socket;
}

const Sidebar: React.FC<SidebarProps> = ({ socket }) => {
  const sideBarRef = useRef<HTMLDivElement | null>(null);

  const openSideBar = () => {
    if (sideBarRef.current) {
      sideBarRef.current.style.left = "0";
    }
  };

  const closeSideBar = () => {
    if (sideBarRef.current) {
      sideBarRef.current.style.left = "-100%";
    }
  };

  const { users } = useSelector((state: RootState) => state.user);

  return (
    <>
      <button
        className="btn btn-dark btn-sm"
        onClick={openSideBar}
        style={{ position: "absolute", top: "5%", left: "5%" }}
      >
        Users
      </button>
      <div
        className="position-fixed pt-2 h-100 bg-dark"
        ref={sideBarRef}
        style={{
          width: "150px",
          left: "-100%",
          transition: "0.3s linear",
          zIndex: "9999",
        }}
      >
        <button
          className="btn btn-block border-0 form-control rounded-0 btn-light"
          onClick={closeSideBar}
        >
          Close
        </button>
        <div className="w-100 mt-5">
          {users.map((usr, index) => (
            <p key={index} className="text-white text-center py-2">
              {usr.username}
              {usr.id === socket.id && " - (You)"}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

interface RootState {
  user: {
    users: Array<{ id: string; username: string }>;
  };
}

