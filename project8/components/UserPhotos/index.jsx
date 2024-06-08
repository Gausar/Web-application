import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import { MentionsInput, Mention } from 'react-mentions';
import axios from "axios";
import './styles.css';
import DeleteIcon from '@mui/icons-material/Delete';


class UserPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhotos: [],
      comments: {},
      mentions: {},
      users: [],
    };
  }

  componentDidMount() {
    this.fetchUserPhotos();
    this.fetchUsers();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.fetchUserPhotos();
    }
  }

  fetchUserPhotos = async () => {
    const userId = this.props.match.params.userId;
    try {
      const response = await axios.get(`/photosOfUser/${userId}`);
      this.setState({ userPhotos: response.data });
    } catch (error) {
      console.error("Error fetching user photos: ", error);
    }
  };

  fetchUsers = async () => {
    try {
      const response = await axios.get('/user/list');
      this.setState({ users: response.data });
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  handleCommentChange = (photoId, event, newValue, newPlainTextValue, mentions) => {
    this.setState((prevState) => ({
      comments: {
        ...prevState.comments,
        [photoId]: newValue
      },
      mentions: {
        ...prevState.mentions,
        [photoId]: mentions.map(mention => mention.id)
      }
    }));
  };

  handleAddComment = async (photoId) => {
    const { comments, mentions } = this.state;

    if (!comments[photoId]?.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`/commentsOfPhoto/${photoId}`, { comment: comments[photoId], mentions: mentions[photoId] });
      this.setState((prevState) => ({
        userPhotos: prevState.userPhotos.map(photo => {
          if (photo._id === photoId) {
            return { ...photo, comments: [...photo.comments, response.data] };
          }
          return photo;
        }),
        comments: {
          ...prevState.comments,
          [photoId]: ''
        },
        mentions: {
          ...prevState.mentions,
          [photoId]: []
        },
      }));
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  handleDeletePhoto = async (photoId) => {
    try {
      const response = await axios.delete(`/photos/${photoId}`);

      if (response.status === 200) {
        console.log('Photo deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  
  handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/comments/${commentId}`);

      if (response.status === 200) {
        console.log('Comment deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  parseComment = (commentText) => {
    const reg = /@\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = reg.exec(commentText)) !== null) {
      const [fullMatch, displayName, userId] = match;
      const index = match.index;

      if (lastIndex < index) {
        parts.push(commentText.substring(lastIndex, index));
      }
      parts.push(
        <Link key={userId} to={`/users/${userId}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
          {displayName}
        </Link>
      );
      lastIndex = index + fullMatch.length;
    }
    if (lastIndex < commentText.length) {
      parts.push(commentText.substring(lastIndex));
    }
    return parts;
  };

  render() {
    const { userPhotos, comments, users } = this.state;
    const { loggedInUser } = this.props;

    return (
      <div className="photos">
        {userPhotos.map((photo) => (
          <Card key={photo._id} style={{ margin: '10px' }} className="card">
            <CardMedia
              component="img"
              height="300"
              image={`/images/${photo.file_name}`}
              alt={photo.file_name}
              className="cardMedia"
            />
            <CardContent>
              <Typography variant="subtitle1" className="subtitle1">
                Creation Date: {new Date(photo.date_time).toLocaleString()}
              </Typography>
              {loggedInUser && loggedInUser._id === photo.user_id && (
                console.log(photo._id),
                <Button onClick={() => this.handleDeletePhoto(photo._id)} startIcon={<DeleteIcon />} variant="contained" color="secondary" style={{ marginTop: '10px', marginLeft: '10px' }}>
                  Delete Photo
                </Button>
              )}
              <Typography variant="subtitle2">Comments:</Typography>
              {photo.comments && photo.comments.map((comment) => (
                <div key={comment._id}>
                  <Typography variant="body2">
                    {" "}- {new Date(comment.date_time).toLocaleString()}:
                  </Typography>
                  <Typography variant="body2">{this.parseComment(comment.comment)}</Typography>
                  {loggedInUser && loggedInUser._id === photo.user_id && (
                    console.log(comment._id),
                    <Button onClick={() => this.handleDeleteComment(photo._id)} startIcon={<DeleteIcon />} variant="contained" color="secondary" style={{ marginTop: '10px', marginLeft: '10px' }}>
                    </Button>
                  )}
                </div>
              ))}
              <MentionsInput
                value={comments[photo._id] || ''}
                onChange={(event, newValue, newPlainTextValue, mentions) => this.handleCommentChange(photo._id, event, newValue, newPlainTextValue, mentions)}
                style={{ width: '100%', minHeight: '100px' }}
              >
                <Mention
                  trigger="@"
                  data={users.map(user => ({
                    id: user._id,
                    display: `${user.first_name} ${user.last_name}`,
                    link: `/user/${user._id}`
                  }))}
                />
              </MentionsInput>
              <Button onClick={() => this.handleAddComment(photo._id)} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Add Comment
              </Button>
              
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}
export default UserPhotos;
