import React, { useRef, useState, useEffect, useReducer } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import ExpenseInput from './ExpenseInput';
import './ExpenseForm.css';
import {themeReducer} from './Redux/ThemeReducer';

const ExpenseForm = () => {
const expenseInputRef = useRef();
const descriptionInputRef = useRef();
const categoryInputRef = useRef();
const [expenses, setExpenses] = useState([]);
const [editingExpenseId, setEditingExpenseId] = useState(null);
const [user, setUser] = useState(null);
const [theme, dispatchTheme] = useReducer(themeReducer, 'light');
const [isPremium, setIsPremium] = useState(false);
const [showPremiumFeatures, setShowPremiumFeatures] = useState(false);

useEffect(() => {
const auth = firebase.auth();


const unsubscribe = auth.onAuthStateChanged((user) => {
  if (user) {
    setUser(user);
    setIsPremium(true); // Simulating active premium user
  } else {
    setUser(null);
    setIsPremium(false);
  }
});

return () => {
  unsubscribe();
};
}, []);

const submitHandler = (event) => {
event.preventDefault();


if (!user) {
  console.error('User not authenticated');
  return;
}

const enteredExpense = expenseInputRef.current.value;
const enteredDescription = descriptionInputRef.current.value;
const enteredCategory = categoryInputRef.current.value;

const expenseData = {
  expense: enteredExpense,
  description: enteredDescription,
  category: enteredCategory,
};

const db = firebase.database(); // Access the Realtime Database

if (editingExpenseId) {
  // Editing existing expense
  db.ref(`expenses/${user.uid}/${editingExpenseId}`)
    .update(expenseData)
    .then(() => {
      console.log('Expense updated successfully');
      setEditingExpenseId(null); // Clear the editing expense ID
    })
    .catch((error) => {
      console.error('Error updating expense:', error);
    });
} else {
  // Adding new expense
  db.ref(`expenses/${user.uid}`)
    .push(expenseData)
    .then(() => {
      console.log('Expense added successfully');
    })
    .catch((error) => {
      console.error('Error adding expense:', error);
    });
}

expenseInputRef.current.value = '';
descriptionInputRef.current.value = '';
categoryInputRef.current.value = '';
};

const deleteExpense = (expenseId) => {
if (!user) {
console.error('User not authenticated');
return;
}


const db = firebase.database();
db.ref(`expenses/${user.uid}/${expenseId}`)
  .remove()
  .then(() => {
    console.log('Expense deleted successfully');
  })
  .catch((error) => {
    console.error('Error deleting expense:', error);
  });
};

const editExpense = (expenseId) => {
setEditingExpenseId(expenseId);

if (!user) {
  console.error('User not authenticated');
  return;
}

const db = firebase.database();
db.ref(`expenses/${user.uid}/${expenseId}`)
  .once('value')
  .then((snapshot) => {
    const expenseToEdit = snapshot.val();
    if (expenseToEdit) {
      expenseInputRef.current.value = expenseToEdit.expense;
      descriptionInputRef.current.value = expenseToEdit.description;
      categoryInputRef.current.value = expenseToEdit.category;
    }
  })
  .catch((error) => {
    console.error('Error fetching expense:', error);
  });
};

useEffect(() => {
if (!user) {
setExpenses([]);
return;
}


const db = firebase.database();
const expensesRef = db.ref(`expenses/${user.uid}`);

const expensesListener = expensesRef.on('value', (snapshot) => {
  const expensesData = snapshot.val();
  if (expensesData) {
    const expensesArray = Object.keys(expensesData).map((key) => ({
      id: key,
      ...expensesData[key],
    }));
    setExpenses(expensesArray);
  } else {
    setExpenses([]);
  }
});

return () => {
  expensesRef.off('value', expensesListener);
};
}, [user]);

const toggleTheme = () => {
if (isPremium) {
dispatchTheme({ type: 'TOGGLE_THEME' });
}
};

const activatePremium = () => {
setShowPremiumFeatures(true);
};

const totalExpenses = expenses.reduce((total, expense) => total + parseFloat(expense.expense), 0);

const downloadExpensesAsCSV = () => {
if (!user) {
console.error('User not authenticated');
return;
}

const csvContent = [
  'Expense,Description,Category',
  ...expenses.map((expense) => `${expense.expense},${expense.description},${expense.category}`),
].join('\n');

const element = document.createElement('a');
const file = new Blob([csvContent], { type: 'text/csv' });
element.href = URL.createObjectURL(file);
element.download = 'expenses.csv';
document.body.appendChild(element);
element.click();
document.body.removeChild(element);
};

return (
  <div className={`app ${theme}`}>
  <form onSubmit={submitHandler}>
  <ExpenseInput
         id="expense"
         label="Expense"
         type="text"
         required
         inputRef={expenseInputRef}
       />
  <ExpenseInput
         id="description"
         label="Description"
         type="text"
         required
         inputRef={descriptionInputRef}
       />
  <div className="category">
  <label htmlFor="category">
  Category
  <select id="category" ref={categoryInputRef}>
  <option value="">Select a category</option>
  <option value="Food">Food</option>
  <option value="Petrol">Petrol</option>
  <option value="Salary">Salary</option>
  </select>
  </label>
  </div>
  {(!isPremium && totalExpenses >= 10000) ? (
  <button type="submit" disabled>
  Add Expense
  </button>
  ) : (
  <button type="submit">{editingExpenseId ? 'Update Expense' : 'Add Expense'}</button>
  )}
  </form>
  <div>
  <h2>Expenses</h2>
  
  {showPremiumFeatures && (
  <button className="premium-button" onClick={toggleTheme}>
  Toggle Theme
  </button>
  )}
  {!showPremiumFeatures && totalExpenses > 10000 && (
  <button className="premium-button" onClick={activatePremium}>
  Activate Premium
  </button>
  )}
  {expenses.length === 0 && <p>No expenses added yet.</p>}
  {expenses.length > 0 && (
  <table className="expenses-table">
  <thead>
  <tr>
  <th>Expense</th>
  <th>Description</th>
  <th>Category</th>
  <th>Actions</th>
  </tr>
  </thead>
  <tbody>
  {expenses.map((expense) => (
  <tr key={expense.id}>
  <td>{expense.expense}</td>
  <td>{expense.description}</td>
  <td>{expense.category}</td>
  <td>
  <button className="edit-button" onClick={() => editExpense(expense.id)}>
  Edit
  </button>
  <button className="delete-button" onClick={() => deleteExpense(expense.id)}>
  Delete
  </button>
  </td>
  </tr>
  ))}
  </tbody>
  </table>
  )}
  </div>
  {showPremiumFeatures && (
  <div>
  <h3>Premium Features</h3>
  <button className="premium-button" onClick={downloadExpensesAsCSV}>
  Export as CSV
  </button>
  </div>
  )}
  </div>
  );
  };
  
  export default ExpenseForm;




