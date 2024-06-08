import React, { Component } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import './styles.css';

class AddPhotoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.handlePhotoUpload(this.state.file);
  };

  handleCancel = () => {
    this.setState({ file: null });
    this.props.handleClose();
  };

  render() {
    const { open, handleClose } = this.props;

    return (
      <Modal open={open} onClose={handleClose}>
        <Box className="add-photo-modal">
          <Typography variant="h6">Upload Photo</Typography><br/>
          <form onSubmit={this.handleSubmit}>
            <input type="file" onChange={this.handleFileChange} required />
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
