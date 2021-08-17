import React, { Component } from "react";
import logo from "./logo.svg";
//import "./App.css";
import Chat from "./chat";
import Sandbox from "./sandbox";

function App() {
  return (
    <React.Fragment>
      <div>
        <Chat />
      </div>
      <div>
        <Sandbox />
      </div>
    </React.Fragment>
  );
}

export default App;
