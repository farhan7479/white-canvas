import React, { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

const client = new Keycloak({
  url: "http://localhost:5000/",
  realm: "myrealm",
  clientId: "myclient",
});

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;
    client
    .init({
      onLoad: "login-required",
    })
    .then((res) => {
      setLogin(true);
      setToken(client.token);
    })
    .catch((error) => {
      console.error("Keycloak initialization error:", error);
      setLogin(false);
    });
  
  }, []);

  return [isLogin, token];
};

export default useAuth;
