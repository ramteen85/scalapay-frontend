import React, { Fragment, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderActions } from '../../store/order';

function RecordItem(props) {
  const order = props.order;

  return (
    <Fragment>
      <div className="fetched-order">
        <div className="fetched-order-name">
          <h3 className="fetched-order-name-heading">Consumer: {order.name}</h3>
          <div className="fetched-order-name-total">Total: £{order.amount}</div>
        </div>
        <div className="fetched-order-name">
          <h3 className="fetched-order-name-subheading">
            Shipping Amount: £{order.shippingAmount}
          </h3>
          <div className="fetched-order-name-total"></div>
        </div>
        <div className="fetched-item-row">
          <h3 className="fetched-order-name-heading">Items:</h3>
        </div>
        <div className="fetched-item-column">
          <ul className="fetched-item-list">
            {order.items.map((itm, index) => (
              <li key={index} className="fetched-item-list-item">
                <h5 className="fetched-item-text">
                  {itm.name}: £{itm.price.amount}
                </h5>
                <h5 className="fetched-item-text">QTY: {itm.quantity}</h5>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="divider" style={{ marginBottom: '0.5rem' }}></div>
    </Fragment>
  );
}

export default RecordItem;
