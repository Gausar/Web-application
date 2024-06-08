import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';
import './styles.css';

class LoginRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_name: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      location: '',
      description: '',
      occupation: '',
      errorMessage: '',
      successMessage: '',
      isRegistering: false,
    };
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleLogin = async (event) => {
    event.preventDefault();
    const { login_name, password } = this.state;
    try {
      const response = await axios.post('/admin/login', { login_name, password });
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      this.props.history.push('/');
      this.props.setUser(user);
    } catch (error) {
      this.setState({ errorMessage: 'Login failed. Please try again.' });
    }
  };

  handleRegister = async (event) => {
    event.preventDefault();
    const { login_name, password, confirmPassword, first_name, last_name, location, description, occupation } = this.state;
    
    if (password !== confirmPassword) {
      this.setState({ errorMessage: 'Passwords do not match.' });
      return;
    }

    try {
      await axios.post('/user', {
        login_name,
        password,
        first_name,
        last_name,
        location,
        description,
        occupation,
      });
      this.setState({
        successMessage: 'Registration successful. Please log in.',
        errorMessage: '',
        login_name: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: '',
      });
    } catch (error) {
      this.setState({ errorMessage: error.response.data, successMessage: '' });
    }
  };

  toggleRegistering = () => {
    this.setState((prevState) => ({
      isRegistering: !prevState.isRegistering,
      errorMessage: '',
      successMessage: '',
    }));
  };

  render() {
    const { login_name, password, confirmPassword, first_name, last_name, location, description, occupation, errorMessage, successMessage, isRegistering } = this.state;

    return (
      <Container className="login-container" maxWidth="sm">
        <div className="login-form">
          <Typography className="login-title" variant="h4" component="h1" gutterBottom>
            {isRegistering ? 'Register' : 'Please Login'}
          </Typography>
          {errorMessage && (
            <Typography className="error-message" gutterBottom>
              {errorMessage}
            </Typography>
          )}
          {successMessage && (
            <Typography className="success-message" gutterBottom>
              {successMessage}
            </Typography>
          )}
          {isRegistering ? (
            <form onSubmit={this.handleRegister}>
              <TextField
                label="Login Name"
                name="login_name"
                value={login_name}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="First Name"
                name="first_name"
                value={first_name}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={last_name}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="Location"
                name="location"
                value={location}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={description}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
              />
              <TextField
                label="Occupation"
                name="occupation"
                value={occupation}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
              />
              <Button className="login-button" type="submit" variant="contained" color="primary" fullWidth>
                Register Me
              </Button>
              <Button className="toggle-button" onClick={this.toggleRegistering} variant="text" color="primary" fullWidth>
                Already have an account? Login
              </Button>
            </form>
          ) : (
            <form onSubmit={this.handleLogin}>
              <TextField
                label="Login Name"
                name="login_name"
                value={login_name}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
              />
              <Button className="login-button" type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
              <Button className="toggle-button" onClick={this.toggleRegistering} variant="text" color="primary" fullWidth>
                Don&apos;t have an account? <br/> Register
              </Button>
            </form>
          )}
        </div>
      </Container>
    );
  }
}

export default withRouter(LoginRegister);
