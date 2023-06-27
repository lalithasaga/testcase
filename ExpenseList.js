import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useSelector } from 'react-redux';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const email = useSelector((state) => state.Auth.email);

  useEffect(() => {
    const database = firebase.database();
    const expensesRef = database.ref(`/${email}/expenses`);

    expensesRef.on('value', (snapshot) => {
      const expensesData = snapshot.val();
      if (expensesData) {
        const loadedExpenses = Object.keys(expensesData).map((key) => ({
          id: key,
          expense: expensesData[key].expense,
          description: expensesData[key].description,
          category: expensesData[key].category,
        }));
        setExpenses(loadedExpenses);
      } else {
        setExpenses([]);
      }
    });

    return () => {
      expensesRef.off('value');
    };
  }, [email]);

  return (
    <div>
      <h2>Expenses List</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <p>Expense: {expense.expense}</p>
            <p>Description: {expense.description}</p>
            <p>Category: {expense.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesList;
