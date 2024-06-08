import React, { Component } from 'react';
import { Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

import './styles.css';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }

  componentDidMount() {
    this.fetchUserList();
  }

  fetchUserList = async () => {
    try {
      const response = await axios.get('/user/list');
      this.setState({ userList: response.data });
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  render() {
    const { userList } = this.state;

    return (
      <div>
        <Typography variant="body1" className="body1">
          Users
        </Typography>
        <List component="nav" className="nav">
          {userList.map((user) => (
            <div key={user._id}>
              <ListItem button component={RouterLink} to={`/users/${user._id}`}>
                <img src="user.png" alt="User Logo" className="userLogo" />
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        <Typography variant="body1" className="body1">
          {' '}
        </Typography>
      </div>
    );
  }
}

export default UserList;