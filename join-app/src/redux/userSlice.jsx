import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const initialState = {
  users: {
    data: [],
    backup: [],
    error: "",
    loading: false,
  },
};

// Generates pending, fulfilled and rejected action types
export const getUsers = createAsyncThunk("user/getUsers", async () => {
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    searchUsers: (state, action) => {
      state.users.data = state.users.backup.filter((user) => {
        return user?.name?.toLowerCase().includes(action.payload.toLowerCase());
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.users.loading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.users.loading = false;
      state.users.data = action.payload;
      state.users.backup = action.payload;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.users.loading = false;
      state.users.error = action.error.message;
    });
  },
});

export const { searchUsers } = userSlice.actions;

export default userSlice.reducer;
