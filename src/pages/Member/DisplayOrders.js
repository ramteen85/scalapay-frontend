import React, { Fragment, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import { orderActions, getUserInfo } from '../../store/order';
import { sidebarActions } from '../../store/sidebar';
import Navbar from '../../components/Navbar/Navbar';
import Card from '../../components/Card/Card';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import Config from '../../helpers/config';
import RecordItem from '../../components/RecordItem/RecordItem';
import { useNavigate } from 'react-router-dom';
import '../../assets/boxicons-2.0.7/css/boxicons.css';
import './Member.css';

function DisplayOrders() {
  const sidebarOpen = useSelector((state) => state.sidebar?.sidebarOpen);
  const fetchedOrders = useSelector((state) => state.order?.fetchedOrders);
  const shippingDetails = useSelector((state) => state.order?.shippingDetails);
  const billingDetails = useSelector((state) => state.order?.billingDetails);
  const sidebarToggleRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();
  const consumer = useSelector((state) => state.order?.consumerDetails);
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    setLoading(true);
    dispatch(getUserInfo());
    refresh();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const refresh = async (e) => {
    try {
      if (e) e.preventDefault();

      // fetch all orders
      let tokenString = `Bearer ${token}`;
      let response = await fetch(`${Config.url}:${Config.port}/order/getAll`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: tokenString },
      });

      let resData = await response.json();

      // store orders in redux store to be fetched on the screen
      dispatch(orderActions.fetchOrders(resData.orders));
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  if (loading) {
    return (
      <Fragment>
        {sidebarOpen && (
          <SideDrawer
            onClickOutside={() => {
              dispatch(sidebarActions.toggleSidebar());
            }}
          />
        )}
        <LoadingScreen message={`Loading...`}></LoadingScreen>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        {sidebarOpen && (
          <SideDrawer
            onClickOutside={() => {
              dispatch(sidebarActions.toggleSidebar());
            }}
          />
        )}
        <Navbar sidebarToggleRef={sidebarToggleRef} />
        <Card style={{ marginTop: '2rem', marginBottom: '3rem' }}>
          <div className="address-container">
            <div className="detail-col">
              <h1 className="page-title">
                <span className="page-title-label">Consumer Details</span>
              </h1>
              <div className="address-content">
                <span>{consumer.givenNames + ' ' + consumer.surname}</span>
                <span>{consumer.email}</span>
                <span>Ph: {consumer.phoneNumber}</span>
              </div>
            </div>
            <div className="detail-col">
              <h1 className="page-title">
                <span className="page-title-label">Billing Address</span>
              </h1>
              <div className="address-content">
                <span>{billingDetails.name}</span>
                <span>{billingDetails.line1}</span>
                <span>
                  {billingDetails.suburb} {billingDetails.postcode}
                </span>
                <span>Ph: {billingDetails.phoneNumber}</span>
              </div>
            </div>
            <div className="detail-col">
              <h1 className="page-title">
                <span className="page-title-label">Shipping Details</span>
              </h1>
              <div className="address-content">
                <span>{shippingDetails.name}</span>
                <span>{shippingDetails.line1}</span>
                <span>
                  {shippingDetails.suburb} {shippingDetails.postcode}
                </span>
                <span>Ph: {shippingDetails.phoneNumber}</span>
              </div>
            </div>
          </div>
        </Card>
        <Card style={{ marginTop: '2rem', marginBottom: '3rem' }}>
          <h1 className="page-title">
            <span className="page-title-label">Your Previous Orders</span>
            <button className="page-title-btn" onClick={refresh}>
              Refresh
            </button>
          </h1>
          {errorMsg.length > 0 && (
            <span className="errorMsg" style={{ textAlign: 'center' }}>
              {errorMsg}
            </span>
          )}
          <div className="divider"></div>
          <div className="order-container">
            {fetchedOrders.length === 0 && (
              <div className="order-container-placeholder">
                No Orders Yet. Try Refreshing!
              </div>
            )}
            {fetchedOrders.length > 0 &&
              fetchedOrders.map((ord, index) => (
                <RecordItem
                  key={`rec-${Date.now()}-${Math.random()}`}
                  order={ord}
                  index={index}
                />
              ))}
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default DisplayOrders;
