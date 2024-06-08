import React from "react";
import ReactDOM from "react-dom";
import "./styles/main.css";

import Header from "./components/Header";
import Example from "./components/Example";


ReactDOM.render(<div>
                <Header />
                <Example />
                </div>, 
                document.getElementById("reactapp"));