import React, { Fragment, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import { orderActions, getUserInfo } from '../../store/order';
import { sidebarActions } from '../../store/sidebar';
import Navbar from '../../components/Navbar/Navbar';
import Card from '../../components/Card/Card';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import Config from '../../helpers/config';
import OrderItem from '../../components/OrderItem/OrderItem';
import { useNavigate } from 'react-router-dom';
import '../../assets/boxicons-2.0.7/css/boxicons.css';
import './Member.css';

let mounted = false;

function Member() {
  const sidebarOpen = useSelector((state) => state.sidebar?.sidebarOpen);
  const createdProducts = useSelector((state) => state.order?.createdProducts);
  const totalAmount = useSelector((state) => state.order?.totalAmount?.amount);
  const shippingAmount = useSelector((state) => state.order?.shippingAmount?.amount);
  const shippingDetails = useSelector((state) => state.order?.shippingDetails);
  const billingDetails = useSelector((state) => state.order?.billingDetails);
  const sidebarToggleRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();
  // to submit with form
  const total = useSelector((state) => state.order?.totalAmount);
  const consumer = useSelector((state) => state.order?.consumerDetails);
  const discounts = useSelector((state) => state.order?.discounts);
  const merchant = useSelector((state) => state.order?.merchant);
  const merchantReference = useSelector((state) => state.order?.merchantReference);
  const shipping = useSelector((state) => state.order?.shippingAmount);
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    if (!mounted) {
      dispatch(getUserInfo());
      mounted = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  useEffect(() => {
    // reset selected products when entering the page
    dispatch(orderActions.resetSelectedProducts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  // functions

  const newEntry = (e) => {
    e.preventDefault();
    dispatch(orderActions.addProduct());
  };

  const submitOrder = async (e) => {
    // send the order
    e.preventDefault();
    try {
      // reset error message for another go
      setErrorMsg('');

      // validation

      // check order is not empty
      if (createdProducts.length === 0) {
        setErrorMsg('Please select some products first.');
        return;
      }

      // check order does not contain default products
      let flag = false;
      for (let x = 0; x < createdProducts.length; x++) {
        if (createdProducts[x].name === 'Select a Product') {
          flag = true;
          break;
        }
      }
      if (flag) {
        setErrorMsg('Cannot submit an order with default product selections.');
        return;
      }

      // check none of the products have a quantity of 0
      for (let x = 0; x < createdProducts.length; x++) {
        if (createdProducts[x].quantity === '0') {
          flag = true;
          break;
        }
      }
      if (flag) {
        setErrorMsg('Cannot submit an order with product quantities of zero.');
        return;
      }

      // all good, send the order
      setLoading(true);

      // remap created products to exclude ID
      let products = createdProducts.map((prod) => ({
        gtin: prod.gtin,
        quantity: prod.quantity,
        price: {
          amount: prod.price.amount,
          currency: prod.price.currency,
        },
        name: prod.name,
        category: prod.category,
        subcategory: prod.subcategory,
        sku: prod.sku,
        brand: prod.brand,
      }));

      // construct payload
      const payload = {
        totalAmount: total,
        consumer: consumer,
        billing: billingDetails,
        shipping: shippingDetails,
        items: products,
        discounts: discounts,
        merchant: merchant,
        merchantReference: merchantReference,
        shippingAmount: shipping,
      };

      // get token from store
      let tokenString = `Bearer ${token}`;

      // reach out to API
      let response = await fetch(`${Config.url}:${Config.port}/order/create`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json', Authorization: tokenString },
        body: JSON.stringify({
          payload,
        }),
      });

      let resData = await response.json();

      // server side error handling

      if (resData.error) {
        setLoading(false);
        setErrorMsg(resData.message);
        return;
      }

      // all good, redirect!

      window.location.replace(resData.receipt.checkoutUrl);

      // reset order and redirect
    } catch (err) {
      // catch any remaining errors
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  const changeFormField = (section, label, value) => {
    const payload = {
      section,
      label,
      value,
    };
    dispatch(orderActions.changeFormField(payload));
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
        <Navbar sidebarToggleRef={sidebarToggleRef} />
        <LoadingScreen message={`Processing Order...`}></LoadingScreen>
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
        <Card style={{ marginTop: '2rem' }}>
          <h1 className="page-title">
            <span className="page-title-label">Create an Order</span>
            <button className="page-title-btn" onClick={newEntry}>
              Add Product
            </button>
          </h1>
          <div className="divider"></div>
          <div className="order-container">
            {createdProducts.map((prod, index) => (
              <OrderItem product={prod} key={prod.id} index={prod.id} />
            ))}
            {createdProducts.length === 0 && (
              <div className="order-container-placeholder">No Products Yet.</div>
            )}
          </div>
          {createdProducts.length > 0 && (
            <Fragment>
              <div className="divider"></div>
              <div className="total-container">
                <div className="total-container-row">
                  <div className="total-container-name">Shipping</div>
                  <div className="total-container-cost">£{shippingAmount}</div>
                </div>
                <div className="divider"></div>
                <div className="total-container-row">
                  <div className="total-container-name">Total</div>
                  <div className="total-container-cost">
                    £{!isNaN(parseFloat(totalAmount)) ? totalAmount : '0'}
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </Card>
        <Card style={{ marginTop: '2rem' }}>
          <div className="address-container">
            <div className="detail-col">
              <h1 className="page-title">
                <span className="page-title-label">Consumer Details</span>
              </h1>
              <div className="address-content">
                <div className="input-wrapper">
                  <label>First</label>
                  <input
                    value={consumer.givenNames}
                    disabled={!consumer}
                    onChange={(e) => changeFormField('consumer', 'first', e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Last</label>
                  <input
                    value={consumer.surname}
                    disabled={!consumer}
                    onChange={(e) => changeFormField('consumer', 'last', e.target.value)}
                  />
                </div>

                <div className="input-wrapper">
                  <label>Email</label>
                  <input
                    value={consumer.email}
                    disabled={!consumer}
                    onChange={(e) => changeFormField('consumer', 'email', e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Phone</label>
                  <input
                    value={consumer.phoneNumber}
                    disabled={!consumer}
                    onChange={(e) => changeFormField('consumer', 'phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="detail-col">
              <h1 className="page-title">
                <span className="page-title-label">Billing Details</span>
              </h1>
              <div className="address-content">
                <div className="input-wrapper">
                  <label>Full Name</label>
                  <input
                    value={billingDetails.name}
                    disabled={!billingDetails}
                    onChange={(e) =>
                      changeFormField('billing', 'fullname', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Address</label>
                  <input
                    value={billingDetails.line1}
                    disabled={!billingDetails}
                    onChange={(e) =>
                      changeFormField('billing', 'address', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Suburb</label>
                  <input
                    value={billingDetails.suburb}
                    disabled={!billingDetails}
                    onChange={(e) => changeFormField('billing', 'suburb', e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Postcode</label>
                  <input
                    value={billingDetails.postcode}
                    disabled={!billingDetails}
                    onChange={(e) =>
                      changeFormField('billing', 'postcode', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Country Code</label>
                  <input
                    value={billingDetails.countryCode}
                    disabled={!billingDetails}
                    onChange={(e) =>
                      changeFormField('billing', 'countrycode', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Phone</label>
                  <input
                    value={billingDetails.phoneNumber}
                    disabled={!billingDetails}
                    onChange={(e) => changeFormField('billing', 'phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="detail-col">
              <h1 className="page-title">
                <span className="page-title-label">Shipping Details</span>
              </h1>
              <div className="address-content">
                <div className="input-wrapper">
                  <label>Full Name</label>
                  <input
                    value={shippingDetails.name}
                    disabled={!shippingDetails}
                    onChange={(e) =>
                      changeFormField('shipping', 'fullname', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Address</label>
                  <input
                    value={shippingDetails.line1}
                    disabled={!shippingDetails}
                    onChange={(e) =>
                      changeFormField('shipping', 'address', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Suburb</label>
                  <input
                    value={shippingDetails.suburb}
                    disabled={!shippingDetails}
                    onChange={(e) =>
                      changeFormField('shipping', 'suburb', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Postcode</label>
                  <input
                    value={shippingDetails.postcode}
                    disabled={!shippingDetails}
                    onChange={(e) =>
                      changeFormField('shipping', 'postcode', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Country Code</label>
                  <input
                    value={shippingDetails.countryCode}
                    disabled={!shippingDetails}
                    onChange={(e) =>
                      changeFormField('shipping', 'countrycode', e.target.value)
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label>Phone</label>
                  <input
                    defaultValue={shippingDetails.phoneNumber}
                    key={shippingDetails.phoneNumber}
                    onChange={(e) => changeFormField('shipping', 'phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <div className="order-btn-container">
            {errorMsg.length > 0 && <span className="errorMsg">{errorMsg}</span>}
            <button onClick={submitOrder}>Order Now</button>
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default Member;
