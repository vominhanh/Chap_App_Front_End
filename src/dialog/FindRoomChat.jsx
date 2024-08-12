import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import _ from "lodash";
import axios from "axios";
import { useFormik } from "formik";
import { boolean } from "yup";
import { useNavigate } from "react-router-dom";

function FindRoomChat({ open, onClose }) {
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [findingResult, setFindingResult] = React.useState([]);
  const navigate = useNavigate();

  const findUser = async (text) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        process.env.REACT_APP_API_ENDPOINT + `user/?search=${text}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFindingResult(response.data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      findUser(searchText);
    }, 200);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  const createAndRedirectToRoom = async (userId) => {
    setLoading(true);
    try {
      let roomId = null;

      // Kiểm tra xem phòng đã tồn tại hay chưa
      try {
        const res = await axios.post(
          process.env.REACT_APP_API_ENDPOINT + "room/checkAvailable",
          { member: userId },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          }
        );

        if (res.status === 200) {
          roomId = res.data.room._id; // Giả sử phản hồi chứa room._id
        } else if (res.status === 400 && res.data.error === "Room not found.") {
          // Phòng không tồn tại, tiếp tục tạo phòng mới
        } else {
          throw new Error("Unknown error occurred during room check.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.error === "Room not found."
        ) {
          // Phòng không tồn tại, tiếp tục tạo phòng mới
        } else {
          throw error;
        }
      }

      console.log("xuống");

      // Nếu phòng chưa tồn tại, tạo phòng mới
      if (!roomId) {
        try {
          const createRoomRes = await axios.post(
            process.env.REACT_APP_API_ENDPOINT + "room",
            { members: [userId] },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            }
          );

          console.log(createRoomRes);

          roomId = createRoomRes.data.room._id; // Giả sử phản hồi chứa room._id
        } catch (error) {
          throw new Error("Error creating new room: " + error.message);
        }
      }

      // Chuyển hướng tới phòng
      if (roomId) {
        navigate(`/chat/${roomId}`);
      }
    } catch (error) {
      console.error("Error creating or redirecting to room: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {loading ? <CircularProgress /> : null}
      <Stack p={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Tìm kiếm phòng trò chuyện
        </Typography>
        <TextField
          fullWidth
          id="search"
          label="Nhập tên phòng hoặc tên người dùng"
          variant="outlined"
          InputProps={{
            startAdornment: <SearchRounded color="disabled" />,
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Typography variant="h6" align="left" gutterBottom>
          Kết quả tìm kiếm
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
          <List sx={{ height: 300 }}>
            {findingResult.length > 0 ? (
              _.map(findingResult, (user) => (
                <ListItemButton
                  key={user._id}
                  onClick={() => createAndRedirectToRoom(user._id)}
                >
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText primary={user.fullName} />
                </ListItemButton>
              ))
            ) : (
              <Typography align="center" gutterBottom>
                Không tìm thấy người dùng phù hợp
              </Typography>
            )}
          </List>
        </Box>
        {/* Bấm Xác nhận hoặc Hủy */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <Button variant="contained" color="inherit" onClick={onClose}>
            Đóng
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default FindRoomChat;
