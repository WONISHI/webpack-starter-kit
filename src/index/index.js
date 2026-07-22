"use strict";

import React from "react";
import ReactDOM from "react-dom";
import logo from "../assets/icon_150x150.png";
import "./search.less";
import callHello from "./tree-shake";

class Search extends React.Component {
  render() {
    callHello();
    return (
      <div className="search-text">
        Search Text
        <img className="search-img" src={logo} />
      </div>
    );
  }
}
ReactDOM.render(<Search />, document.getElementById("root"));
