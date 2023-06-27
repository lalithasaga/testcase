import {createSlice} from '@reduxjs/toolkit';


const initialtoken = localStorage.getItem('token');

const initialemail = localStorage.getItem('email');

const isLogin = !!initialtoken


const initialAuthState = {
    isLogin: isLogin,
    token:initialtoken,
    email:initialemail,
    expiration: null,
}

const authSlice = createSlice({
    name: 'Auth',
    initialState: initialAuthState,
    reducers: {
        login(state,action)
        {
            state.token = action.payload.token
            state.email = action.payload.email
            state.isLogin = true
            state.expiration = action.payload.expiration
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('email', action.payload.email)
            localStorage.setItem('expiration', action.payload.expiration)
        },
        logout(state)
        {
            state.token = null
            state.email = null
            state.isLogin = false
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            localStorage.removeItem('expiration')
        }

    }
})

export default authSlice.reducer;
export const Authactions = authSlice.actions; 
