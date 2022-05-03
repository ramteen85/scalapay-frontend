import { createSlice, current } from '@reduxjs/toolkit';
import Config from '../helpers/config';
import smileyImg from '../assets/images/smiley.jpg';
import burgerImg from '../assets/images/cheeseburger.jpg';
import lasagneImg from '../assets/images/lasagne.jpeg';
import pieImg from '../assets/images/pie.jpeg';
import schnittyImg from '../assets/images/schnitty.jpg';

const initialState = {
  fetchedOrders: [],
  merchantReference: 'The Food King',
  merchant: {
    redirectConfirmUrl: 'https://portal.integration.scalapay.com/failure-url',
    redirectCancelUrl: 'https://portal.integration.scalapay.com/cancel-url',
  },
  discounts: [], // there are never any discounts on food :'(
  products: [
    {
      gtin: 'UPC',
      imageUrl: smileyImg,
      name: 'Select a Product',
      quantity: '0',
      total: '0',
      category: 'Food',
      subcategory: ['default'],
      sku: 'SKU-BLANK',
      brand: 'Eaten',
    },
    {
      gtin: 'UPC',
      imageUrl: burgerImg,
      name: 'Cheeseburger',
      quantity: '0',
      total: '0',
      price: {
        amount: '10.00',
        currency: 'EUR',
      },
      category: 'Food',
      subcategory: ['Burgers'],
      sku: 'SKU-CHEESEBURGER',
      brand: 'Burger King',
    },
    {
      gtin: 'UPC',
      imageUrl: schnittyImg,
      name: 'Chicken Schnitty Toastie',
      quantity: '0',
      total: '0',
      price: {
        amount: '20.00',
        currency: 'EUR',
      },
      category: 'Food',
      subcategory: ['Sandwiches'],
      sku: 'SKU-SCHNITTY-TOASTIE',
      brand: 'McDonalds',
    },
    {
      gtin: 'UPC',
      imageUrl: lasagneImg,
      name: 'Lasagne',
      quantity: '0',
      total: '0',
      price: {
        amount: '30.00',
        currency: 'EUR',
      },
      category: 'Food',
      subcategory: ['Italian'],
      sku: 'SKU-LASAGNE',
      brand: 'Nonnas',
    },
    {
      gtin: 'UPC',
      imageUrl: pieImg,
      name: 'Meat Pie',
      quantity: '0',
      total: '0',
      price: {
        amount: '5.00',
        currency: 'EUR',
      },
      category: 'Food',
      subcategory: ['Pies'],
      sku: 'SKU-AUSSIE-PIE',
      brand: 'The Servo',
    },
  ],
  // products get added here to display on the order screen
  createdProducts: [],
  shippingAmount: {
    amount: '10.00',
    currency: 'EUR',
  },
  totalAmount: {
    amount: '0.00',
    currency: 'EUR',
  },
  consumerDetails: {
    phoneNumber: '0242264660',
    givenNames: 'Joe',
    surname: 'Bloggs',
    email: 'joebloggs@gmail.com',
  },
  shippingDetails: {
    phoneNumber: '0422243778',
    countryCode: 'AU',
    name: 'The Shipyard',
    postcode: '2500',
    suburb: 'Wollongong',
    line1: 'Belmore Basin',
  },
  billingDetails: {
    phoneNumber: '0422243778',
    countryCode: 'AU',
    name: 'Joe Ram',
    postcode: '2500',
    suburb: 'Wollongong',
    line1: '13 Smith st',
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    updateUserInfo(state, action) {
      // update all shipping, billing and consumer fields

      // billing
      state.billingDetails.phoneNumber = action.payload.billing.phoneNumber;
      state.billingDetails.countryCode = action.payload.billing.countryCode;
      state.billingDetails.name = action.payload.billing.name;
      state.billingDetails.postcode = action.payload.billing.postcode;
      state.billingDetails.suburb = action.payload.billing.suburb;
      state.billingDetails.line1 = action.payload.billing.line1;

      // shipping
      state.shippingDetails.phoneNumber = action.payload.shipping.phoneNumber;
      state.shippingDetails.countryCode = action.payload.shipping.countryCode;
      state.shippingDetails.name = action.payload.shipping.name;
      state.shippingDetails.postcode = action.payload.shipping.postcode;
      state.shippingDetails.suburb = action.payload.shipping.suburb;
      state.shippingDetails.line1 = action.payload.shipping.line1;

      // consumer details
      state.consumerDetails.phoneNumber = action.payload.consumer.phoneNumber;
      state.consumerDetails.givenNames = action.payload.consumer.givenNames;
      state.consumerDetails.surname = action.payload.consumer.surname;
      state.consumerDetails.email = action.payload.consumer.email;
    },
    changeFormField(state, action) {
      // update [shipping - billing - consumer] form fields
      const section = action.payload.section;
      const label = action.payload.label;
      const value = action.payload.value;

      // if we are in consumer form
      if (section === 'consumer') {
        switch (label) {
          case 'first':
            state.consumerDetails.givenNames = value;
            break;
          case 'last':
            state.consumerDetails.surname = value;
            break;
          case 'email':
            state.consumerDetails.email = value;
            break;
          case 'phone':
            state.consumerDetails.phoneNumber = value;
            break;
          default:
            // do nothing
            break;
        }
      }

      // if we are in billing form
      if (section === 'billing') {
        switch (label) {
          case 'fullname':
            state.billingDetails.name = value;
            break;
          case 'address':
            state.billingDetails.line1 = value;
            break;
          case 'suburb':
            state.billingDetails.suburb = value;
            break;
          case 'postcode':
            state.billingDetails.postcode = value;
            break;
          case 'countrycode':
            state.billingDetails.countryCode = value;
            break;
          case 'phone':
            state.billingDetails.phoneNumber = value;
            break;
          default:
            // do nothing
            break;
        }
      }

      // if we are in shipping form
      if (section === 'shipping') {
        switch (label) {
          case 'fullname':
            state.shippingDetails.name = value;
            break;
          case 'address':
            state.shippingDetails.line1 = value;
            break;
          case 'suburb':
            state.shippingDetails.suburb = value;
            break;
          case 'postcode':
            state.shippingDetails.postcode = value;
            break;
          case 'countrycode':
            state.shippingDetails.countryCode = value;
            break;
          case 'phone':
            state.shippingDetails.phoneNumber = value;
            break;
          default:
            // do nothing
            break;
        }
      }
    },
    fetchOrders(state, action) {
      state.fetchedOrders = action.payload;
    },
    addProduct(state, action) {
      // add default product order entry to order
      const temp = { ...state.products[0], id: Date.now() };
      state.createdProducts.push(temp);
      state.totalAmount.amount = state.shippingAmount.amount;
    },
    deleteProduct(state, action) {
      // NOT REMOVING THE CORRECT ITEM

      // remove product order entry from order
      const id = action.payload;
      let tempArr = current(state.createdProducts);
      tempArr = tempArr.filter((p) => p.id !== id);
      state.createdProducts = [...tempArr];

      // calculate grand total
      let total = 0;
      for (let x = 0; x < state.createdProducts.length; x++) {
        if (state.createdProducts[x].name !== 'Select a Product') {
          // get quantity + cost and convert to float
          const tempQuantity = parseInt(state.createdProducts[x].quantity);
          const tempCost = parseFloat(state.createdProducts[x].price.amount);
          // calculate quantity * cost
          const result = tempQuantity * tempCost;
          // add to total
          total += result;
        }
      }
      // add shipping cost
      total += parseFloat(state.shippingAmount.amount);
      // convert total back to string with 2 d.p.
      total = total.toFixed(2);
      total = total.toString();
      // save grand total
      state.totalAmount.amount = total;
    },
    setProduct(state, action) {
      // set the product for the order entry
      const index = action.payload.productIndex; // selection index
      const id = action.payload.productId; // id of entry to replace

      // get selected product
      const prod = state.products[index];

      // find created product by ID
      const foundIndex = state.createdProducts.findIndex((x) => x.id === id);

      // set the created product entry to the product

      state.createdProducts[foundIndex] = { ...prod, id: id, quantity: 1 };

      // calculate grand total
      let total = 0;
      for (let x = 0; x < state.createdProducts.length; x++) {
        if (state.createdProducts[x].name !== 'Select a Product') {
          // get quantity + cost and convert to float
          const tempQuantity = parseInt(state.createdProducts[x].quantity);
          const tempCost = parseInt(state.createdProducts[x].price.amount);
          // calculate quantity * cost
          const result = tempQuantity * tempCost;
          // add to total
          total += result;
        }
      }
      // add shipping cost
      total += parseFloat(state.shippingAmount.amount);
      // convert total back to string with 2 d.p.
      total = total.toFixed(2);
      total = total.toString();
      // save grand total
      state.totalAmount.amount = total;
    },
    setProductQuantity(state, action) {
      // set product quantity for the order entry

      // find product by ID
      const id = action.payload.productId;
      const foundIndex = state.createdProducts.findIndex((x) => x.id === id);
      const prod = state.createdProducts[foundIndex];

      // change the value
      state.createdProducts[foundIndex] = {
        ...prod,
        quantity: action.payload.newQuantity,
      };

      // calculate grand total
      let total = 0;
      for (let x = 0; x < state.createdProducts.length; x++) {
        if (state.createdProducts[x].name !== 'Select a Product') {
          // get quantity + cost and convert to float
          const tempQuantity = parseInt(state.createdProducts[x].quantity);
          const tempCost = parseInt(state.createdProducts[x].price.amount);
          // calculate quantity * cost
          const result = tempQuantity * tempCost;
          // add to total
          total += result;
        }
      }
      // add shipping cost
      total += parseFloat(state.shippingAmount.amount);
      // convert total back to string with 2 d.p.
      total = total.toFixed(2);
      total = total.toString();
      // save grand total
      state.totalAmount.amount = total;
    },
    resetSelectedProducts(state, action) {
      state.createdProducts = [];

      // set grand total to 0
      state.totalAmount.amount = '0.00';
    },
  },
});

// actions
export const orderActions = orderSlice.actions;

// default
export default orderSlice.reducer;

// other actions
export const getUserInfo = () => {
  return async (dispatch) => {
    // get token
    const token = localStorage.getItem('token');

    const sendRequest = async () => {
      // Make API call
      let tokenString = `Bearer ${token}`;
      let response = await fetch(`${Config.url}:${Config.port}/order/getOrderInfo`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', Authorization: tokenString },
      });

      // get response
      let resData = await response.json();

      const isEmpty =
        Object.keys(resData.shippingInfo.billing).length === 0 &&
        Object.keys(resData.shippingInfo.consumer).length === 0 &&
        Object.keys(resData.shippingInfo.shipping).length === 0;

      // if no user info, back out
      if (isEmpty) {
        return;
      }

      // all good, update values
      await dispatch(orderActions.updateUserInfo(resData.shippingInfo));

      //---
    };

    try {
      if (token) {
        await sendRequest();
      }
    } catch (error) {
      throw error;
    }
  };
};
