import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "@/app/utils/token";
import { Config } from "@/constants/Config";

/* -------------------- ASYNC THUNK -------------------- */
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

/* -------------------- SLICE -------------------- */
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    // ✅ THIS IS markStepDone
    markStepDone: (state, action) => {
      const stepId = action.payload;

      for (const task of state.list) {
        const step = task.steps.find(s => s._id === stepId);
        if (step) {
          step.isDone = true;
          break;
        }
      }
    },
  },
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

export const { markStepDone } = tasksSlice.actions;
export default tasksSlice.reducer;
