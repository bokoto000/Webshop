import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Client from "./components/Client";

function App() {
  return (
    <BrowserRouter>
      <Client />
    </BrowserRouter>
  );
}

export default App;
