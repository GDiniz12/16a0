"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  currentRoom: any;
  setCurrentRoom: (room: any) => void;
  nickname: string;
  setNickname: (name: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  currentRoom: null,
  setCurrentRoom: () => {},
  nickname: "",
  setNickname: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    // Pegar o hostname dinâmico resolve o problema de testar no celular via IP local!
    const backendUrl = typeof window !== "undefined" 
      ? `http://${window.location.hostname}:3001` 
      : "http://localhost:3001";

    const newSocket = io(backendUrl);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, currentRoom, setCurrentRoom, nickname, setNickname }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);