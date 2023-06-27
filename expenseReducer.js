import { createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';


// Create a slice using Redux Toolkit
const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    editingExpenseId: null,
  },
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action) => {
      const { expenseId, updatedExpense } = action.payload;
      const index = state.expenses.findIndex((expense) => expense.id === expenseId);
      if (index !== -1) {
        state.expenses[index] = updatedExpense;
      }
    },
    deleteExpense: (state, action) => {
      const expenseId = action.payload;
      state.expenses = state.expenses.filter((expense) => expense.id !== expenseId);
    },
    editExpense: (state, action) => {
      state.editingExpenseId = action.payload;
    },
    fetchExpenses: (state, action) => {
      const databaseRef = firebase.database().ref('/expenses');
      databaseRef.once('value', (snapshot) => {
        const expensesData = snapshot.val();

        const fetchedExpenses = Object.keys(expensesData).map((expenseId) => ({
          id: expenseId,
          ...expensesData[expenseId],
        }));

        state.expenses = fetchedExpenses;
      });
    },
  },
});

// Extract the action creators from the slice
export const {
  addExpense,
  updateExpense,
  deleteExpense,
  editExpense,
  fetchExpenses,
} = expenseSlice.actions;

// Export the reducer
export default expenseSlice.reducer;
