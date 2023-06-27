import authReducer from "./Auth";
import {  configureStore } from '@reduxjs/toolkit';
//import expensesReducer from "../expensesReducer";


const store = configureStore({
  
  reducer : { 
    Auth : authReducer,
    
  }
})

export default store;