"use strict";

import React from "react";
import ReactDOM from "react-dom";
import logo from "../assets/icon_150x150.png";
import "./search.less";

class Search extends React.Component {
  render() {
    return (
      <div className="search-text">
        Search Text
        <img className="search-img" src={logo} />
      </div>
    );
  }
}
ReactDOM.render(<Search />, document.getElementById("root"));
