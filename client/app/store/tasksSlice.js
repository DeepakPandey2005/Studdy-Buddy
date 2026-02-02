import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../utils/token";
import { Config } from "@/constants/Config";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    const token = await getToken();
    const res = await axios.get(
      `${Config.API_URL}/api/tasks/get`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, state => {
        state.loading = false;
      });
  },
});

export default tasksSlice.reducer;
