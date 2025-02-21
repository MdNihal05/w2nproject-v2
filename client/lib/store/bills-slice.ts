import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { BillsState } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Default bills state when no persisted data exists.
const defaultBillsState: BillsState = {
  bills: [],
  isLoading: false,
  error: null,
  analysis: null,
};

// Load persisted bills state from localStorage if available.
const loadBillsState = (): BillsState => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("billsState");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error("Error parsing billsState from localStorage", err);
      }
    }
  }
  return defaultBillsState;
};

const initialState: BillsState = loadBillsState();

export const fetchBills = createAsyncThunk("bills/fetchBills", async () => {
  const response = await fetch(`${API_URL}/bills`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch bills");
  return response.json();
});

export const addBill = createAsyncThunk(
  "bills/addBill",
  async (formData: FormData) => {
    const response = await fetch(`${API_URL}/bills/add`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to add bill");
    return response.json();
  }
);

export const deleteBill = createAsyncThunk("bills/deleteBill", async (id: string) => {
  const response = await fetch(`${API_URL}/bills/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete bill");
  return id;
});

export const describeBills = createAsyncThunk("bills/describeBills", async () => {
  const response = await fetch(`${API_URL}/bills/describe`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to get bill analysis");
  return response.json();
});

const billsSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch bills handlers
      .addCase(fetchBills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("billsState", JSON.stringify(state));
        }
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch bills";
      })
      // Add bill handler
      .addCase(addBill.fulfilled, (state, action) => {
        state.bills.push(action.payload);
        if (typeof window !== "undefined") {
          localStorage.setItem("billsState", JSON.stringify(state));
        }
      })
      // Delete bill handler
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.bills = state.bills.filter((bill) => bill._id !== action.payload);
        if (typeof window !== "undefined") {
          localStorage.setItem("billsState", JSON.stringify(state));
        }
      })
      // Describe bills handler
      .addCase(describeBills.fulfilled, (state, action) => {
        state.analysis = action.payload.message;
        if (typeof window !== "undefined") {
          localStorage.setItem("billsState", JSON.stringify(state));
        }
      });
  },
});

export default billsSlice.reducer;
