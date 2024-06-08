import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import AddPhotoModal from '../AddPhotoModal';
import './styles.css';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextInfo: '',
      modalOpen: false,
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

    const userId = pathname.split('/')[2];

    if (pathname === '/users') {
      newContextInfo = 'All Users';
    } else if (pathname.startsWith('/users/')) {
      try {
        const response = await axios.get(`/user/${userId}`);
        const user = response.data;
        if (user) {
          newContextInfo = `Details of ${user.first_name} ${user.last_name}`;
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    } else if (pathname.startsWith('/photos/')) {
      try {
        const response = await axios.get(`/user/${userId}`);
        const user = response.data;
        if (user) {
          newContextInfo = `Photos of ${user.first_name} ${user.last_name}`;
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
    this.setState({ contextInfo: newContextInfo });
  };

  handleLogout = async () => {
    try {
      await axios.post('/admin/logout');
      localStorage.removeItem('user');
      this.props.setUser(null);
      this.props.history.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handlePhotoUpload = async (file, sharingList) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('sharing_list', sharingList);
  
    try {
      const response = await axios.post('/photos/new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Photo uploaded:', response.data);
      this.handleModalClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

    render() {
      const { contextInfo, modalOpen } = this.state;
      const { user } = this.props;
  
      return (
        <AppBar className="cs142-topbar-appBar" position="absolute">
          <Toolbar className="cs142-topbar-toolbar">
            <div className="toolbar-left">
              <img src="user.png" alt="User Logo" className="userLogo" />
              {user && (
                <Typography variant="h6" color="inherit">
                  Hi {user.first_name}
                </Typography>
              )}
            </div>
            <div className="cs142-topbar-left">
              <Typography variant="h6" color="inherit">
                {contextInfo}
              </Typography>
            </div>
            <div className="toolbar-right">
              {user ? (
                <>
                  <Button
                    color="inherit"
                    onClick={this.handleModalOpen}
                    sx={{
                      border: '1px solid white',
                      borderRadius: '4px',
                      paddingX: '5px',
                      marginRight: '10px',
                      background: '#0c1133',
                    }}
                  >
                    Add Photo
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => this.props.history.push('/activities')}
                    sx={{
                      border: '1px solid white',
                      borderRadius: '4px',
                      paddingX: '5px',
                      marginRight: '10px',
                      background: '#0c1133',
                    }}
                  >
                    Activities
                  </Button>
                  <Button
                    color="inherit"
                    onClick={this.handleLogout}
                    sx={{
                      border: '1px solid white',
                      borderRadius: '4px',
                      paddingX: '5px',
                      background: '#0c1133',
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Typography
                  variant="h6"
                  color="inherit"
                  onClick={() => this.props.history.push('/login')}
                  sx={{
                    border: '1px solid white',
                    borderRadius: '4px',
                    paddingX: '5px',
                  }}
                >
                  Login
                </Typography>
              )}
            </div>
          </Toolbar>
          <AddPhotoModal
            open={modalOpen}
            handleClose={this.handleModalClose}
            handlePhotoUpload={this.handlePhotoUpload}
          />
        </AppBar>
      );
    }
  }

export default withRouter(TopBar);
