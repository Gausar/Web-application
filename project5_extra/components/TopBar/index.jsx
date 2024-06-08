import React from "react";
import { AppBar, Toolbar, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { withRouter } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contextInfo: '',
    };
  }

  componentDidMount() {
    this.updateContextInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.updateContextInfo();
    }
  }

  updateContextInfo = () => {
    const { pathname } = this.props.location;
    let contextInfo = "";

    if (pathname === "/users") {
      contextInfo = "All Users";
    } else if (pathname.startsWith("/users/")) {
      const userId = pathname.split("/")[2];
      const url = `/user/${userId}`;
      fetchModel(url)
        .then((response) => {
          const user = response.data;
          if (user) {
            contextInfo = `Details of ${user.first_name} ${user.last_name}`;
            this.setState({ contextInfo });
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    } else if (pathname.startsWith("/photos/")) {
      const userId = pathname.split("/")[2];
      const url = `/user/${userId}`;
      fetchModel(url)
        .then((response) => {
          const user = response.data;
          if (user) {
            contextInfo = `Photos of ${user.first_name} ${user.last_name}`;
            this.setState({ contextInfo });
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  };

  render() {
    const { contextInfo } = this.state;
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <img src="user.png" className="userLogo" alt="User Logo"></img>
          <Typography variant="h5" color="inherit" className="left">
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.advancedFeaturesEnabled}
                  onChange={this.props.onAdvancedFeatures}
                  color="secondary"
                />
              }
              label="Advanced Features"
            />
          </Typography>
          <Typography variant="h5" color="inherit" style={{ marginLeft: "auto" }}>
            {contextInfo}
          </Typography>
          <img src="signLogo.png" className="signLogo" alt="Sign Logo"></img>
        </Toolbar>
      </AppBar>
    );
  }
}
export default withRouter(TopBar);
