import React from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFeaturesEnabled: false,
    };
  }

  handleAdvancedFeatures = () => {
    this.setState((prevState) => ({
      advancedFeaturesEnabled: !prevState.advancedFeaturesEnabled,
    }));
  };

  render() {
    const { advancedFeaturesEnabled } = this.state;

    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar
                advancedFeaturesEnabled={advancedFeaturesEnabled}
                onAdvancedFeatures={this.handleAdvancedFeatures}
              />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route
                      exact
                      path="/"
                      render={() => (
                        <Typography variant="body1">
                          Welcome to your photosharing app!
                        </Typography>
                      )}
                    />
                  <Route
                    path="/users/:userId"
                    render={(props) => <UserDetail {...props} />}
                  />
                  <Route
                    path="/photos/:userId"
                    render={(props) => <UserPhotos {...props} advancedFeaturesEnabled={advancedFeaturesEnabled} />}
                  />
                  <Route path="/users" component={UserList} />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
