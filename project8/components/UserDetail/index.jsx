import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import axios from "axios";
import "./styles.css";
import DeleteIcon from '@mui/icons-material/Delete';

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      recentPhoto: null,
      photoWithMostComments: null,
      mentionedPhotos: []
    };    
  }

  componentDidMount() {
    this.fetchUserData();
    this.fetchMentionedPhotos();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.fetchUserData();
      this.fetchMentionedPhotos();
    }
  }

  fetchUserData = async () => {
    const userId = this.props.match.params.userId;
    
    try {
      const userResponse = await axios.get(`/user/${userId}`);
      const photosSummaryResponse = await axios.get(`/user/photos/summary/${userId}`);
  
      this.setState({
        user: userResponse.data,
        recentPhoto: photosSummaryResponse.data.recentPhoto,
        photoWithMostComments: photosSummaryResponse.data.photoWithMostComments,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response && error.response.status === 400) {
        console.error("Invalid user ID:", userId);
        this.setState({ user: null });
      }
    }
  };
  
  fetchMentionedPhotos = async () => {
    const userId = this.props.match.params.userId;
    try {
      const response = await axios.get(`/mentionsOfUser/${userId}`);
      this.setState({ mentionedPhotos: response.data });
    } catch (error) {
      console.error("Error fetching mentioned photos:", error);
    }
  };

  handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      const userId = this.state.user._id;
    try {
      await axios.delete(`/user/${userId}`);
      localStorage.removeItem('user');
      this.setState({ user: null });
      alert('Your account has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('error occurred while deleting your account');
    }
    }
  };

  render() {
    const { user, recentPhoto, photoWithMostComments, mentionedPhotos } = this.state;
    const {loggedInUser} = this.props;
    //console.log(loggedInUser);
    if (!user) {
      return <Typography variant="body1">User not found</Typography>;
    }
  
    return (
      <div className="name">
        <div className="details">
          <Typography variant="body1">
            <img src="loc.png" alt="Location Icon" className="icon" /> Location : {user.location}
          </Typography>
          <Typography variant="body1">
            <img src="occu.png" alt="Occupation Icon" className="icon" /> Occupation : {user.occupation}
          </Typography>
          <Typography variant="body1">
            <img src="desc.png" alt="Description Icon" className="icon" /> Description : {user.description}
          </Typography>
          <div className="photoContainer">
            {recentPhoto && (
              <div>
                <Typography variant="body1" className="photos1">
                  Most Recent Photo: <br />
                  <Link to={`/photos/${recentPhoto.user_id}`}>
                    <img src={`/images/${recentPhoto.file_name}`} alt="Most Recent" className="thumbnail" />
                  </Link>
                  <br />
                  Uploaded on: {new Date(recentPhoto.date_time).toLocaleString()}
                </Typography>
              </div>
            )}
            {photoWithMostComments && (
              <div>
                <Typography variant="body1" className="photos2">
                  Photo with Most Comments: <br />
                  <Link to={`/photos/${photoWithMostComments.user_id}`}>
                    <img src={`/images/${photoWithMostComments.file_name}`} alt="Most Comments" className="thumbnail" />
                  </Link>
                  <br/>
                  Comments: {photoWithMostComments.comments.length}
                </Typography>
              </div>
            )}
          </div>
          <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              color="inherit"
              sx={{
                border: '1px solid blue',
                borderRadius: '4px',
                paddingX: '5px',
                marginRight: '10px',
                background: '#0c1133',
              }}
            >
              <Link 
                to={`/photos/${user._id}`} 
                style={{ 
                  textDecoration: "none", 
                  color: 'white', 
                  display: 'block', 
                  width: '100%', 
                  height: '100%' 
                }}
              > 
                View Photos 
              </Link>
            </Button>
          </Typography>
        </div>
        <div className="mentions">
          <Typography variant="h6">Photos mentioning {user.first_name}:</Typography>
          {mentionedPhotos.length > 0 ? (
            mentionedPhotos.map(photo => (
              <div key={photo._id} className="mentionedPhoto">
                <Link to={`/photos/${photo.user_id._id}`}>
                  <img src={`/images/${photo.file_name}`} alt="Mentioned Photo" className="thumbnail" />
                </Link>
                <Typography variant="body1">
                  <Link to={`/users/${photo.user_id._id}`}>
                    {photo.user_id.first_name} {photo.user_id.last_name}
                  </Link>
                </Typography>
              </div>
            ))
          ) : (
            <Typography variant="body1">No photos mentioning {user.first_name}.</Typography>
          )}
        </div>
        <br/>
        {loggedInUser && loggedInUser._id === user._id && (
        <Button onClick={this.handleDeleteAccount} color="secondary" fullWidth startIcon={<DeleteIcon />} variant="contained">Delete My Account</Button>
      )}
      </div>
    );
  }  
}

export default UserDetail;
