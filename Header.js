import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.jpg';
import './Header.css';
import { useSelector, useDispatch } from 'react-redux';
import  { Authactions } from './Redux/Auth';



const Header = () => {
  const isLogin = useSelector(state => state.Auth.isLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(Authactions.logout())
    navigate('/');
  };

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="My Web Link Logo" />
        <span className="logo-text">MyWeb Link</span>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          {isLogin && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/expense">Add Expense</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header; 
