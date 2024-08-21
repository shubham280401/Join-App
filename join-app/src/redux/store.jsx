// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cardsReducer from "./cardsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    cards: cardsReducer,
  },
});

export default store;
