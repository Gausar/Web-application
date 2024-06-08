import React, { Component } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import axios from 'axios';
import './styles.css';

class AddPhotoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      sharingListNames: '', 
      sharingListIds: [],
    };
  }

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  handleSharingListChange = async (event) => {
    const sharingListNames = event.target.value;
    this.setState({ sharingListNames });

    if (sharingListNames.trim() !== '') {
      const namesArray = sharingListNames.split(',').map(name => name.trim());
      try {
        const responses = await Promise.all(
          namesArray.map(name => axios.get(`/users/search?first_name=${name}`))
        );
        const userIds = responses.flatMap(response => response.data.map(user => user._id));
        this.setState({ sharingListIds: userIds });
      } catch (error) {
        console.error('Error fetching user IDs:', error);
      }
    } else {
      this.setState({ sharingListIds: [] });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { file, sharingListIds } = this.state;
    this.props.handlePhotoUpload(file, sharingListIds);
  };

  handleCancel = () => {
    this.setState({ file: null, sharingListNames: '', sharingListIds: [] });
    this.props.handleClose();
  };

  render() {
    const { open, handleClose } = this.props;

    return (
      <Modal open={open} onClose={handleClose}>
        <Box className="add-photo-modal">
          <Typography variant="h6">Upload Photo</Typography><br/>
          <form onSubmit={this.handleSubmit}>
            <input type="file" onChange={this.handleFileChange} required /><br/>
            <TextField
              label="Sharing List (comma-separated first names)"
              value={this.state.sharingListNames}
              onChange={this.handleSharingListChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Upload
            </Button>
            <Button onClick={this.handleCancel} variant="contained" color="secondary" fullWidth>
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>
    );
  }
}

export default AddPhotoModal;