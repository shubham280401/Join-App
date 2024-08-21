// redux/bookmarksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchBookmarks",
  async () => {
    const querySnapshot = await getDocs(collection(db, "bookmarks"));
    const bookmarks = [];
    querySnapshot.forEach((doc) => {
      bookmarks.push({ id: doc.id, ...doc.data() });
    });
    return bookmarks;
  }
);

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState: {
    bookmarks: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBookmarks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookmarks.fulfilled, (state, action) => {
      state.bookmarks = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchBookmarks.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default bookmarksSlice.reducer;
