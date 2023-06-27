import React from 'react';
import { useSelector } from 'react-redux';

const PremiumButtonComponent = () => {
  const expenses = useSelector((state) => state.expenses.expenses);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const showPremiumButton = totalExpenses > 10000;

  return (
    <div>
      {showPremiumButton && <button>Activate Premium</button>}
    </div>
  );
};

export default PremiumButtonComponent;
