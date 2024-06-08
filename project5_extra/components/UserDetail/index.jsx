import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  componentDidMount() {
    this.fetchUserData();
  }

  componentDidUpdate(prevProps) {
    const prevUserId = prevProps.match.params.userId;
    const currentUserId = this.props.match.params.userId;
    if (prevUserId !== currentUserId) {
      this.fetchUserData();
    }
  }

  fetchUserData = () => {
    const userId = this.props.match.params.userId;
    fetchModel(`/user/${userId}`)
      .then((response) => {
        this.setState({
          user: response.data,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  render() {
    const { user } = this.state;
    if (!user) {
      return <Typography variant="body1">User not found</Typography>;
    }

    return (
      <div className="name">
        <div className="details">
          <Typography variant="body1">
            <img src="loc.png" className="icon"/> Location : {user.location}
          </Typography>
          <Typography variant="body1">
            <img src="occu.png" className="icon" /> Occupation : {user.occupation}
          </Typography>
          <Typography variant="body1">
            <img src="desc.png" className="icon" /> Description : {user.description}
          </Typography>
          <Typography variant="body1" style={{ marginLeft: "100px" }}>
            <Link to={`/photos/${user._id}`} style={{ textDecoration: "none" }}> View Photos </Link>
          </Typography>
        </div>
      </div>
    );
  }
}

export default UserDetail;
