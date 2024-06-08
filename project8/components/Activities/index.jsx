import React, { Component } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import axios from 'axios';
//import './styles.css';

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
    };
  }

  componentDidMount() {
    this.fetchActivities();
  }

  fetchActivities = async () => {
    try {
      const response = await axios.get('/activities');
      this.setState({ activities: response.data });
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  renderActivity = (activity) => {
    const { type, date, userId, additionalInfo } = this.activity;
    let activityInfo;

    switch (type) {
      case 'Photo Upload':
        activityInfo = (
          <ListItemAvatar>
            <Avatar src={additionalInfo.thumbnailUrl} alt="Uploaded Photo" />
          </ListItemAvatar>
        );
        break;
      case 'New Comment':
        activityInfo = (
          <ListItemAvatar>
            <Avatar src={additionalInfo.thumbnailUrl} alt="Commented Photo" />
          </ListItemAvatar>
        );
        break;
      default:
        activityInfo = null;
    }

    return (
      <ListItem key={activity._id}>
        {activityInfo}
        <ListItemText
          primary={`${userId.first_name} ${userId.last_name} - ${type}`}
          secondary={new Date(date).toLocaleString()}
        />
      </ListItem>
    );
  };

  render() {
    const { activities } = this.state;

    return (
      <Box className="activities-container">
        <Typography variant="h4" gutterBottom>
          Recent Activities
        </Typography>
        <List>
          {activities.map((activity) => this.renderActivity(activity))}
        </List>
        <Button onClick={this.fetchActivities} variant="contained" color="primary">
          Refresh
        </Button>
      </Box>
    );
  }
}

export default Activities;
