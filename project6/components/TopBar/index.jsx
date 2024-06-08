import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

class TopBar extends Component {
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

  updateContextInfo = async () => {
    const { pathname } = this.props.location;
    let newContextInfo = "";

    const userId = pathname.split("/")[2];

    if (pathname === "/users") {
      newContextInfo = "All Users";
    } else if (pathname.startsWith("/users/")) {
      try {
        const response = await axios.get(`/user/${userId}`);
        const user = response.data;
        if (user) {
          newContextInfo = `Details of ${user.first_name} ${user.last_name}`;
          this.state({ newContextInfo});
        }
        else{
            console.error("Invalid user ID");
            this.props.sendStatus(400);
            return;   
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else if (pathname.startsWith("/photos/")) {
      try {
        const response = await axios.get(`/user/${userId}`);
        const user = response.data;
        if (user) {
          newContextInfo = this.state.advancedFeaturesEnabled
            ? `Photos of ${user.first_name} ${user.last_name}`
            : `Photos of ${user.first_name} ${user.last_name}`;
        }
      } catch (error) {

        console.error("Error fetching user details:", error);
      }
    }
    this.setState({ contextInfo: newContextInfo });
  };

  handleAdvancedFeaturesToggle = () => {
    this.setState(prevState => ({
      advancedFeaturesEnabled: !prevState.advancedFeaturesEnabled,
    }));
  };

  render() {
    const { contextInfo, advancedFeaturesEnabled } = this.state;

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <img src="user.png" alt="User Logo" className="userLogo" />
          <Typography variant="h5" color="inherit" className="left">
            <FormControlLabel
              control={
                <Checkbox
                  checked={advancedFeaturesEnabled}
                  onChange={this.handleAdvancedFeaturesToggle}
                  color="secondary"
                />
              }
              label="Advanced Features"
            />
          </Typography>
          <Typography variant="h5" color="inherit" style={{ marginLeft: 'auto' }}>
            {contextInfo}
          </Typography>
          <img src="signLogo.png" alt="Sign Logo" className="signLogo" />
        </Toolbar>
      </AppBar>
    );
  }
}
export default withRouter(TopBar); 