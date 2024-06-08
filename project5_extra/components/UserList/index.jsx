import React from "react";
import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }

  componentDidMount() {
    fetchModel("/user/list")
      .then(response => {
        this.setState({
          userList: response.data,
        });
      })
      .catch(error => {
        console.error("Error fetching user list:", error);
      });
  }

  render() {
    const { userList } = this.state;
    return (
      <div>
        <Typography variant="body1" className="body1"> Users </Typography>
        <List component="nav" className="nav">
          {userList.map((user) => (
            <div key={user._id}>
              <ListItem button component={RouterLink} to={`/users/${user._id}`}>
                <img src="user.png" className="userLogo"/>
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        <Typography variant="body1" className="body1"> </Typography>
      </div>
    );
  }
}

export default UserList;
