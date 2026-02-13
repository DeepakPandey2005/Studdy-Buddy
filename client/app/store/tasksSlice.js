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

export const markStepDoneAsync = createAsyncThunk(
  "tasks/markStepDoneAsync",
  async (stepId) => {
    const token = await getToken();
    const res = await axios.patch(
      `${Config.API_URL}/api/tasks/step/${stepId}/done`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return { stepId, data: res.data };
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
      })
      .addCase(markStepDoneAsync.fulfilled, (state, action) => {
        const { stepId } = action.payload;
        for (const task of state.list) {
          const step = task.steps.find(s => s._id === stepId);
          if (step) {
            step.isDone = true;
            break;
          }
        }
      });
  },
});

export const { markStepDone } = tasksSlice.actions;
export default tasksSlice.reducer;
