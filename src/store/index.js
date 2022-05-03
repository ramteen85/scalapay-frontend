import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth'; // authentication
import sidebarReducer from './sidebar'; // sidebar actions
import orderReducer from './order'; // order information

// merge all reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
    order: orderReducer,
  },
});

export default store;
