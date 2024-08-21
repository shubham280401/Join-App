import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export const fetchCards = createAsyncThunk("cards/fetchCards", async () => {
  const querySnapshot = await getDocs(collection(db, "cards"));
  const cardsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return cardsData;
});

export const updateUserCards = createAsyncThunk(
  "cards/updateUserCards",
  async ({ uid, name, avatarUrl }) => {
    const q = query(collection(db, "cards"), where("userID", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (cardDoc) => {
      await updateDoc(doc(db, "cards", cardDoc.id), {
        name: name,
        avatarUrl: avatarUrl,
      });
    });
    // Refetch the updated cards
    const updatedQuerySnapshot = await getDocs(collection(db, "cards"));
    const updatedCardsData = updatedQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return updatedCardsData;
  }
);

const cardsSlice = createSlice({
  name: "cards",
  initialState: {
    cards: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCard(state, action) {
      state.cards.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(updateUserCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addCard } = cardsSlice.actions;

export default cardsSlice.reducer;
