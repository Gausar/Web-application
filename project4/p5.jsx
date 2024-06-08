import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Link } from "react-router-dom";
import Example from "./components/Example";
import States from "./components/States";
import Header from "./components/Header";
import "./styles/main.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: <Example />
        };
        this.toView = this.toView.bind(this);
    }

    toView() {
        this.setState(prevState => ({
            display: !prevState.display
        }));
    }

    render() {
        return (
            <div className="change-page">
                <Header />
                <HashRouter>
                    <div>
                            <Link to="/example">
                                <button className="button">Example</button>
                            </Link>
                            <Link to="/states">
                                <button className="button">States</button>
                            </Link>
                            
                            <Route path="/example" component={Example} />
                            <Route path="/states" component={States} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("reactapp"));
