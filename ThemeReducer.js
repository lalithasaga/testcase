// themeReducer.js

// Define the initial state for the theme
const initialState = {
    isDarkMode: false,
  };
  
  // Define the reducer function for the theme
 // Theme reducer
const themeReducer = (state, action) => {
    switch (action.type) {
    case 'TOGGLE_THEME':
    return state === 'light' ? 'dark' : 'light';
    default:
    return state;
    }
    };
    
  
  export { initialState, themeReducer };
  