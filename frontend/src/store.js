import { createStore, combineReducers, applyMiddleware } from 'redux'
import {thunk} from'redux-thunk'
import { composeWithDevTools} from 'redux-devtools-extension'


import { productsReducer,productDetailsReducer,newProductReducer,newReviewReducer, productReducer,productReviewsReducer, reviewReducer  } from './reducers/productReducers'
import { authReducer,userReducer,forgotPasswordReducer, allUsersReducer, userDetailsReducer } from './reducers/userReducer'
import { cartReducer } from './reducers/cartReducers'
import {newOrderReducer,myOrdersReducer,orderDetailsReducer,allOrdersReducer,orderReducer} from './reducers/orderReducers'



const reducer = combineReducers({
      products: productsReducer,
      productDetails: productDetailsReducer,
      newProduct: newProductReducer,
      product: productReducer,
      productReviews: productReviewsReducer,
      review: reviewReducer,  
      auth: authReducer,
      user: userReducer,
      allUsers: allUsersReducer,
      userDetails: userDetailsReducer,  
      forgotPassword: forgotPasswordReducer,
      cart: cartReducer,
      newOrder: newOrderReducer,
      myOrders: myOrdersReducer,
      allOrders: allOrdersReducer,
      orderDetails: orderDetailsReducer,
      order: orderReducer,
      newReview: newReviewReducer
  })

let initialState = {
      cart: {
          cartItems: localStorage.getItem('cartItems')
              ? JSON.parse(localStorage.getItem('cartItems'))
              : [],
          shippingInfo: localStorage.getItem('shippingInfo')
              ? JSON.parse(localStorage.getItem('shippingInfo'))
              : {},    
      },
  };


  
const middleWare= [thunk];
const store= createStore(reducer, initialState,composeWithDevTools(applyMiddleware(...middleWare)));

export default store;     