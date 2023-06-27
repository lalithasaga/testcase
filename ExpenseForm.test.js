import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ExpenseForm from './ExpenseForm';
import firebase from 'firebase/compat';

jest.mock('firebase/compat/app', () => ({
  __esModule: true,
  default: {
    database: jest.fn(),
  },
}));

describe('ExpenseForm', () => {
  test('Submitting an expense without entering any data', () => {
    // Mock the console.error method
    console.error = jest.fn();

    render(<ExpenseForm />);
    const addButton = screen.getByRole('button', { name: /add expense/i });

    fireEvent.click(addButton);

    expect(console.error).toHaveBeenCalledWith('User not authenticated');
    // Add more assertions as needed
  });

  test('Submitting an expense with valid data', () => {
    // Mock Firebase methods and data
    const pushMock = jest.fn().mockResolvedValue();
    const databaseMock = {
      ref: jest.fn(() => ({
        push: pushMock,
      })),
    };
    jest.spyOn(firebase, 'database').mockReturnValue(databaseMock);

    render(<ExpenseForm />);
    const expenseInput = screen.getByLabelText('Expense');
    const descriptionInput = screen.getByLabelText('Description');
    const addButton = screen.getByRole('button', { name: /add expense/i });

    fireEvent.change(expenseInput, { target: { value: '10' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test expense' } });
    fireEvent.click(addButton);

    expect(pushMock).toHaveBeenCalledWith({
      expense: '10',
      description: 'Test expense',
      category: '',
    });
    // Add more assertions as needed
  });

  test('Editing an existing expense', () => {
    // Mock Firebase methods and data
    const updateMock = jest.fn().mockResolvedValue();
    const databaseMock = {
      ref: jest.fn(() => ({
        update: updateMock,
      })),
    };
    jest.spyOn(firebase, 'database').mockReturnValue(databaseMock);

    render(<ExpenseForm />);
    const editButton = screen.getByRole('button', { name: /edit/i });

    fireEvent.click(editButton);

    expect(updateMock).toHaveBeenCalledWith({
      expense: 'updatedExpense',
      description: 'updatedDescription',
      category: 'updatedCategory',
    });
    // Add more assertions as needed
  });

  test('Deleting an existing expense', () => {
    // Mock Firebase methods and data
    const removeMock = jest.fn().mockResolvedValue();
    const databaseMock = {
      ref: jest.fn(() => ({
        remove: removeMock,
      })),
    };
    jest.spyOn(firebase, 'database').mockReturnValue(databaseMock);

    render(<ExpenseForm />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });

    fireEvent.click(deleteButton);

    expect(removeMock).toHaveBeenCalled();
    // Add more assertions as needed
  });

  test('Attempting to edit an expense without authentication', () => {
    // Mock the console.error method
    console.error = jest.fn();

    render(<ExpenseForm />);
    const editButton = screen.getByRole('button', { name: /edit/i });

    fireEvent.click(editButton);

    expect(console.error).toHaveBeenCalledWith('User not authenticated');
    // Add more assertions as needed
  });

  test('Attempting to delete an expense without authentication', () => {
    // Mock the console.error method
    console.error = jest.fn();

    render(<ExpenseForm />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });

    fireEvent.click(deleteButton);

    expect(console.error).toHaveBeenCalledWith('User not authenticated');
    // Add more assertions as needed
  });

  // Add more test cases...

});


