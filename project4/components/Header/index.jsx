import React from "react";
import "./styles.css";

class Header extends React.Component {
  render() {
    return (
      <div className="header-container">
        <img src="header.png" alt="Logo" className="logo1" />
        <img src="header.png" alt="Logo" className="logo" />
        <h1 className="header-title">Web applications</h1>
        <p className="header-subtitle">Project-4 solutions by Gausar.</p>
      </div>
    );
  }
}
export default Header;
