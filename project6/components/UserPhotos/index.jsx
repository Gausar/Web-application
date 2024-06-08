import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import axios from "axios";
import './styles.css';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhotos: [],
      currentIndex: 0,
    };
  }

  componentDidMount() {
    this.fetchUserPhotos();
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
    } catch(error) {
      console.error("Error fetching user photos: ", error);
    }
  };

  handleStepForward = () => {
    this.setState((prevState) => ({
      currentIndex: Math.min(prevState.currentIndex + 1, prevState.userPhotos.length - 1),
    }));
  };

  handleStepBackward = () => {
    this.setState((prevState) => ({
      currentIndex: Math.max(prevState.currentIndex - 1, 0),
    }));
  };

  render() {
    const { userPhotos } = this.state;
    const { advancedFeaturesEnabled } = this.props;
    console.log(advancedFeaturesEnabled);
    if (!advancedFeaturesEnabled) {
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
                {photo.comments &&
                  photo.comments.map((comment) => (
                    <div key={comment._id}>
                      {/* <Link to={`/user/${comment.user._id}`}>
                          {comment.user.first_name} {comment.user.last_name}
                        </Link> */}
                      <Typography variant="body2">
                        {" "}
                        - {new Date(comment.date_time).toLocaleString()}:
                      </Typography>
                      <Typography variant="body2">{comment.comment}</Typography>
                    </div>
                  ))
                }
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else {
      const { currentIndex } = this.state;
      const photo = userPhotos[currentIndex];
      return (
        <div className="photos">
          <Card style={{ margin: "10px" }} className="card">
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
                    {/* <Typography variant="body2">
                      <Link to={`/user/${comment.user._id}`}>
                          {comment.user.first_name} {" "} {comment.user.last_name}
                      </Link>
                    </Typography> */}
                    <Typography variant="body2">
                      {" "}
                      - {new Date(comment.date_time).toLocaleString()}:
                    </Typography>
                    <Typography variant="body2">{comment.comment}</Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2">No comments.</Typography>
              )}
            </CardContent>
          </Card>
          <div className="stepper">
            <Button variant="contained" onClick={this.handleStepBackward} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={this.handleStepForward}
              disabled={currentIndex === userPhotos.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      );
    }
  }
}
export default UserPhotos;