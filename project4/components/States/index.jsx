import React from "react";
import "./styles.css";

/**
 * Define States, a React component of CS142 Project 4, Problem 2. The model
 * data for this view (the state names) is available at
 * window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      substring: "",
      filteredStates: window.cs142models.statesModel(),
    };
  }
  
  handleInputChange = (event) => {
    const { value } = event.target;
    const filteredStates = window.cs142models.statesModel().filter((state) => state.toLowerCase().includes(value.toLowerCase())
    );
    this.setState({ substring: value, filteredStates });
  };

  render() {
    return (
      <div className="states-container">
        Country : <input
          type="text"
          placeholder="Enter substring..."
          value={this.state.substring}
          onChange={this.handleInputChange}
        />
        <p>Matched values : </p>
        <ul className="states-list">
          {this.state.filteredStates.length > 0 ? (
            this.state.filteredStates.map((state, index) => (
              <li key={index}>{state}</li>
            ))
          ) : (
            <li>Олдсонгүй.</li>
          )}
        </ul>
      </div>
    );
  }
}

export default States;