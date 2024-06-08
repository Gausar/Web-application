import React from "react";
import ReactDOM from "react-dom";
import Example from "./components/Example";
import States from "./components/States";
import Header from "./components/Header";
import "./styles/main.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: true
        };
        this.toView = this.toView.bind(this);
    }

    toView() {
        this.setState(prevState => ({
            display: !prevState.display
        }));
    }

    render() {
        const { display } = this.state;
        return (
            <div className="change-page">
            <button onClick={this.toView} className="button">
                {display ? "Switch to States" : "Switch to Example"}
            </button>
            {display ? <Example /> : <States />}
            </div>
        );
    }
}

ReactDOM.render(<div><Header /> <App /></div>, document.getElementById("reactapp"));