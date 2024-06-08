// import React, { Component } from "react";
// import { Typography, Card, CardContent, CardMedia, Button, TextField } from "@mui/material";
// import axios from "axios";
// import './styles.css';

// class UserPhotos extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userPhotos: [],
//       //currentIndex: 0,
//       newComment: '',
//     };
//   }

//   componentDidMount() {
//     this.fetchUserPhotos();
//   }

//   componentDidUpdate(prevProps) {
//     if (prevProps.match.params.userId !== this.props.match.params.userId) {
//       this.fetchUserPhotos();
//     }
//   }

//   fetchUserPhotos = async () => {
//     const userId = this.props.match.params.userId;
//     try {
//       const response = await axios.get(`/photosOfUser/${userId}`);
//       this.setState({ userPhotos: response.data });
//     } catch (error) {
//       console.error("Error fetching user photos: ", error);
//     }
//   };

//   handleCommentChange = (event) => {
//     this.setState({ newComment: event.target.value });
//   };

//   handleAddComment = async (photoId) => {
//     const { newComment } = this.state;

//     if (!newComment.trim()) {
//       alert("Comment cannot be empty.");
//       return;
//     }

//     try {
//       const response = await axios.post(`/commentsOfPhoto/${photoId}`, { comment: newComment });
//       this.setState((prevState) => ({
//         userPhotos: prevState.userPhotos.map(photo => {
//           if (photo._id === photoId) {
//             return { ...photo, comments: [...photo.comments, response.data] };
//           }
//           return photo;
//         }),
//         newComment: '',
//       }));
//     } catch (error) {
//       console.error("Error adding comment: ", error);
//     }
//   };

//   render() {
//     const { userPhotos, newComment } = this.state;

//     return (
//       <div className="photos">
//         {userPhotos.map((photo) => (
//           <Card key={photo._id} style={{ margin: '10px' }} className="card">
//             <CardMedia
//               component="img"
//               height="300"
//               image={`/images/${photo.file_name}`}
//               alt={photo.file_name}
//               className="cardMedia"
//             />
//             <CardContent>
//               <Typography variant="subtitle1" className="subtitle1">
//                 Creation Date: {new Date(photo.date_time).toLocaleString()}
//               </Typography>
//               <Typography variant="subtitle2">Comments:</Typography>
//               {photo.comments && photo.comments.map((comment) => (
//                 <div key={comment._id}>
//                   <Typography variant="body2">
//                     {" "}- {new Date(comment.date_time).toLocaleString()}:
//                   </Typography>
//                   <Typography variant="body2">{comment.comment}</Typography>
//                 </div>
//               ))}
//               <TextField
//                 label="Add a comment"
//                 value={newComment}
//                 onChange={this.handleCommentChange}
//                 fullWidth
//               />
//               <Button onClick={() => this.handleAddComment(photo._id)} variant="contained" color="primary" style={{ marginTop: '10px' }}>
//                 Add Comment
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   }
// }

// export default UserPhotos;
import React, { Component } from "react";
import { Typography, Card, CardContent, CardMedia, Button, TextField } from "@mui/material";
import axios from "axios";
import './styles.css';

class UserPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhotos: [],
      comments: {},
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
    } catch (error) {
      console.error("Error fetching user photos: ", error);
    }
  };

  handleCommentChange = (photoId, event) => {
    const { comments } = this.state;
    this.setState({
      comments: { ...comments, [photoId]: event.target.value }
    });
  };

  handleAddComment = async (photoId) => {
    const { comments } = this.state;
    const newComment = comments[photoId];

    if (!newComment || !newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`/commentsOfPhoto/${photoId}`, { comment: newComment });
      this.setState((prevState) => ({
        userPhotos: prevState.userPhotos.map(photo => {
          if (photo._id === photoId) {
            return { ...photo, comments: [...photo.comments, response.data] };
          }
          return photo;
        }),
        comments: { ...prevState.comments, [photoId]: '' },
      }));
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  render() {
    const { userPhotos, comments } = this.state;

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
              {photo.comments && photo.comments.map((comment) => (
                <div key={comment._id}>
                  <Typography variant="body2">
                    {/* <Link to={`/user/${comment.user._id}`}>
                          {comment.user.first_name} {comment.user.last_name}
                        </Link> */}
                    {" "}- {new Date(comment.date_time).toLocaleString()}:
                  </Typography>
                  <Typography variant="body2">{comment.comment}</Typography>
                </div>
              ))}
              <TextField
                label="Add a comment"
                value={comments[photo._id] || ''}
                onChange={(event) => this.handleCommentChange(photo._id, event)}
                fullWidth
              />
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
