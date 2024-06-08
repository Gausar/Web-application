import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import axios from "axios";
import "./styles.css";

class UserDetail extends Component {
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
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.fetchUserData();
    }
  }

  fetchUserData = async () => {
    const userId = this.props.match.params.userId;
    try {
      const response = await axios.get(`/user/${userId}`);
      this.setState({ user: response.data });
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response && error.response.status === 400) {
        console.error("Invalid user ID:", userId);
        this.setState({ user: null });
      }
    }
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
            <img src="loc.png" alt="Location Icon" className="icon"/> Location : {user.location}
          </Typography>
          <Typography variant="body1">
            <img src="occu.png" alt="Occupation Icon" className="icon" /> Occupation : {user.occupation}
          </Typography>
          <Typography variant="body1">
            <img src="desc.png" alt="Description Icon" className="icon" /> Description : {user.description}
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
