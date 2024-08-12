import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 8,
    width: 400,
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
}));

const ProfileMemberModal = ({ open, onClose, member }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      scroll={"body"}
      onClose={() => {
        onClose();
      }}
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
      className={classes.modal}
    >
      <Stack
        alignItems="center"
        spacing={"20px"}
        className={classes.paper}
        sx={{
          ...classes.paper,
        }}
        direction={"column"}
      >
        <Avatar className={classes.avatar} />
        <Typography variant="h5" align="center" gutterBottom>
          Thông tin tài khoản
        </Typography>
        <TextField
          id="fullName"
          className={classes.formField}
          label="Họ và tên"
          fullWidth
          variant="outlined"
          value={member.fullName}
        />
        <TextField
          id="email"
          className={classes.formField}
          label="Email"
          fullWidth
          variant="outlined"
          value={member.email}
        />
        <TextField
          id="phoneNumber"
          className={classes.formField}
          label="Điện thoại"
          fullWidth
          variant="outlined"
          value={member.phoneNumber}
        />
      </Stack>
    </Dialog>
  );
};

export default ProfileMemberModal;
