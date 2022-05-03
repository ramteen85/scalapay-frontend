import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Member from '../../pages/Member/Member';
import DisplayOrders from '../../pages/Member/DisplayOrders';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';

const PageRoutes = () => {
  const isAuth = useSelector((state) => state.auth?.isAuthenticated);
  return (
    <Router>
      {/* Using the new React-Router v6 */}
      <Routes>
        {isAuth ? (
          <Fragment>
            <Route path="/" element={<Member />} />
          </Fragment>
        ) : (
          <Fragment>
            <Route path="/" element={<Login />} />
          </Fragment>
        )}
        {isAuth ? (
          <Fragment>
            <Route path="/display-orders" element={<DisplayOrders />} />
          </Fragment>
        ) : (
          <Fragment>
            <Route path="/" element={<Login />} />
          </Fragment>
        )}
        {!isAuth ? (
          <Fragment>
            <Route path="/register" element={<Register />} />
          </Fragment>
        ) : (
          <Fragment>
            <Route path="/" element={<Member />} />
          </Fragment>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default PageRoutes;
