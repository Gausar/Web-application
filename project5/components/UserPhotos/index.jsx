import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';
import fetchModel from '../../lib/fetchModelData';
import './styles.css';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhotos: [],
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
      fetchModel(`/photosOfUser/${userId}`)
        .then((res) => {
          this.setState({
            userPhotos: res.data,
          });
        })
        .catch((error) => {
          console.error('Error fetching user photos:', error);
        });
  }

  render() {
    const { userPhotos } = this.state;
    if (userPhotos.length === 0) {
      return <Typography variant="body1">No photos available for the user.</Typography>;
    }

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
              <Typography variant="subtitle2">Comments:</Typography>
              {photo.comments ? (
                photo.comments.map((comment) => (
                  <div key={comment._id}>
                    <Typography variant="body2">
                      <Link to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                      {' '} - {new Date(comment.date_time).toLocaleString()}:
                    </Typography>
                    <Typography variant="body2">{comment.comment}</Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2">No comments.</Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

export default UserPhotos;
