// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userNo: 0,
    roomJoined: false,
    user: {},
    users: [],
   
  },
  reducers: {
    setUserNo: (state, action) => {
      state.userNo = action.payload;
    },
    setRoomJoined: (state, action) => {
      state.roomJoined = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    
  },
});

export const { setUserNo, setRoomJoined, setUser, setUsers, } = userSlice.actions;
export default userSlice.reducer;
