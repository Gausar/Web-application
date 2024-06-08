import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { withRouter } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

/**
 * Define TopBar, a React component of CS142 Project 5.
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contextInfo: "",
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

    const userId = pathname.split("/")[2];

    if (pathname === "/users") {
      contextInfo = "All Users";
      this.setState({ contextInfo });
    }
    else if (pathname.startsWith("/users/") && userId) {
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
    }
    else if (pathname.startsWith("/photos/") && userId) {
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
          <img src="user.png" className="userLogo"></img>
          <Typography variant="h5" color="inherit" className="left"> Gausar </Typography>
          <Typography variant="h5" color="inherit" style={{ marginLeft: "auto" }}> {contextInfo} </Typography>
          <img src="signLogo.png" className="signLogo"></img>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
