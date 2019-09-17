import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Admin from "./admincomponents/Admin";

function App() {
  return (
    <BrowserRouter>
      <Admin />
    </BrowserRouter>
  );
}

export default App;
