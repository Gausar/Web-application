import React from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/loginRegister";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFeaturesEnabled: false,
      user: JSON.parse(localStorage.getItem('user')),
    };
  }

  setUser = (user) => {
    this.setState({ user });
  };

  handleAdvancedFeaturesToggle = () => {
    this.setState((prevState) => ({
      advancedFeaturesEnabled: !prevState.advancedFeaturesEnabled,
    }));
  };

  handleLogout = () => {
    localStorage.removeItem('user');
    this.setState({ user: null });
  };

  render() {
    const { advancedFeaturesEnabled, user } = this.state;

    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar
                user={user}
                advancedFeaturesEnabled={advancedFeaturesEnabled}
                onAdvancedFeaturesToggle={this.handleAdvancedFeaturesToggle}
                setUser={this.setUser}
                handleLogout={this.handleLogout}
              />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item xs={12}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  {!user ? (
                    <>
                      <Route
                        exact
                        path="/login"
                        render={(props) => (
                          <LoginRegister {...props} setUser={this.setUser} />
                        )}
                      />
                      <Redirect to="/login" />
                    </>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item sm={3}>
                        <Paper className="cs142-main-grid-item">
                          <UserList user={user} setUser={this.setUser} />
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
                                  Welcome to the photo-sharing app!
                                </Typography>
                              )}
                            />
                            <Route
                              path="/users/:userId"
                              render={(props) => (
                                <UserDetail {...props} user={user} setUser={this.setUser} />
                              )}
                            />
                            <Route
                              path="/photos/:userId"
                              render={(props) => (
                                <UserPhotos
                                  {...props}
                                  advancedFeaturesEnabled={advancedFeaturesEnabled}
                                />
                              )}
                            />
                            <Route path="/users" component={UserList} />
                          </Switch>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}
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
