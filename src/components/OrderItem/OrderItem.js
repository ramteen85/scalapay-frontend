import React, { Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderActions } from '../../store/order';

function OrderItem(props) {
  const dispatch = useDispatch();
  const quantityRef = useRef();
  const product = props.product;
  const productOptions = useSelector((state) => state.order?.products);
  let totalProductAmount =
    parseFloat(product?.price?.amount) * parseFloat(product?.quantity);
  totalProductAmount = totalProductAmount.toFixed(2);

  const deleteProduct = (e) => {
    e.preventDefault();
    dispatch(orderActions.deleteProduct(product.id));
  };

  const setProduct = (e) => {
    // reset qty input

    let payload;

    if (e.target.value === 0 || e.target.value === 'default') {
      quantityRef.current.value = 0;
      payload = {
        productIndex: 0,
        productId: product.id,
      };
    } else {
      quantityRef.current.value = 1;
      payload = {
        productIndex: e.target.value,
        productId: product.id,
      };
    }

    dispatch(orderActions.setProduct(payload));
  };

  const setProductQuantity = (e) => {
    if (e.target.value < 0) {
      e.target.value = 0;
    }
    const payload = {
      newQuantity: e.target.value,
      productId: product.id,
    };
    dispatch(orderActions.setProductQuantity(payload));
  };

  let isOpaque = { opacity: '0' };

  if (!isNaN(parseFloat(product?.price?.amount) * parseFloat(product?.quantity))) {
    isOpaque = { opacity: '1' };
  }

  return (
    <Fragment>
      <div className="product">
        <div className="product-img">
          {/* The Product Image */}
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-body">
          {/* The Product Selection */}
          <h3 className="product-qty-title">Selection</h3>
          <select
            defaultValue={productOptions.findIndex((p) => p.name === product.name)}
            className="product-select"
            onChange={setProduct}
          >
            {productOptions.map((prod, index) => (
              <option value={index} key={`${prod.name}-${index}`}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>
        <div className="product-quantity">
          {/* The Product Quantity Ordered */}
          <h3 className="product-qty-title">QTY</h3>
          <input
            ref={quantityRef}
            className="product-qty-selector"
            type="number"
            defaultValue={product.quantity}
            disabled={!product.price}
            onChange={setProductQuantity}
          />
        </div>
        <div className="product-price">
          {/* The Total Product Price */}
          {product.price && (
            <Fragment>
              <h3 className="product-qty-title">Price</h3>
              <span style={isOpaque} className="product-price-label">
                £{totalProductAmount}
              </span>
            </Fragment>
          )}
        </div>
        <div className="product-delete">
          {/* The Delete Button */}
          <h3 className="product-qty-title">Delete</h3>
          <i onClick={deleteProduct} className="bx bxs-x-square product-delete-icon" />
        </div>
      </div>
      <div className="divider" style={{ marginBottom: '0.5rem' }}></div>
    </Fragment>
  );
}

export default OrderItem;
