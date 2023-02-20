import axios from "axios";
import {
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_FAIL,
} from "../constants/productConstants";
import {
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,

  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,

  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,

  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,

  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,

  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} from "../constants/productConstants";

//Intead of using the API call in HomeScreen.js, we will use it in here and we will call the listProducts in HomeScreen.
//  Now we will dispatch our action from this fnction which will trigger the productReducers.js which will further update our state
// it is quite absolute to know that the actions of Redux are dispatched asynchronously. 
// It is quite a problem for non-trivial applications that need connection with Application Program Interface or 
// API to perform external effects side by side
// Thunk is a logical concept in programming where you deal with a function that is primarily used to delay the calculation or evaluation of any operation.
// Redux Thunk acts as a middleware that will return you a function instead of an object while calling through the action creators
// SO thunk allows returning a function instead of an action from the action creator methods/functions.
// Also this function DOESN'T have to be pure so it is allowed to have side effects like Async api calls.
//we are using async await to get data from the api using axios.

// setting default keyword as ''
// export const listProducts = (keyword = '') => async (dispatch) => { this is when we use searchbox
// we see below listProducts() is having fn within a function which is possible bcs of redux thunk
  export const listProducts = () => async (dispatch) => {
  try {
    //this dispatch will trigger the productReducers.js which will change the loading status as true untill we fetch the api
    dispatch({ type: PRODUCT_LIST_REQUEST });

    const { data } = await axios.get("/products");
    // console.log(data)
    //now this dispatch will set the loading status as false and also now we have the data so we will pass it to reducer
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    //we also handle any error while fetching the data
    dispatch({
      type: PRODUCT_LIST_FAIL,
      //checkin if we have generic response or custom message
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    //this dispatch will change the loading status as true untill we fetch the api
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/products/${id}`);
    // console.log(data)
    //now this dispatch will set the loading status as false and also now we have the data so we will pass it to reducer
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    //we also handle any error while fetching the data
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      //checkin if we have generic response or custom message(custom message is one we send from backend)
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/products/delete/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};


export const createProduct = () => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_CREATE_REQUEST
      })

      const {
          userLogin: { userInfo },
      } = getState()

      const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
          }
      }

      // Since we are not sending form data bcs in backend we simply modifying the product for createProduct API so for POST we will simply send empty object
      const { data } = await axios.post(
          `/products/create/`,
          {},
          config
      )
      dispatch({
          type: PRODUCT_CREATE_SUCCESS,
          payload: data,
      })

  } catch (error) {
      dispatch({
          type: PRODUCT_CREATE_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      })
  }
}


// export const listTopProducts = () => async (dispatch) => {
//   try {
//       dispatch({ type: PRODUCT_TOP_REQUEST })

//       const { data } = await axios.get(`/api/products/top/`)

//       dispatch({
//           type: PRODUCT_TOP_SUCCESS,
//           payload: data
//       })

//   } catch (error) {
//       dispatch({
//           type: PRODUCT_TOP_FAIL,
//           payload: error.response && error.response.data.detail
//               ? error.response.data.detail
//               : error.message,
//       })
//   }
// }


export const updateProduct = (product) => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_UPDATE_REQUEST
      })

      const {
          userLogin: { userInfo },
      } = getState()

      const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
          }
      }

      const { data } = await axios.put(
          `/products/update/${product._id}`,
          product,
          config
      )
      dispatch({
          type: PRODUCT_UPDATE_SUCCESS,
          payload: data,
      })

      // Once product is updated we want to load the updated product so we are calling this dispatch
      dispatch({
          type: PRODUCT_DETAILS_SUCCESS,
          payload: data
      })

  } catch (error) {
      dispatch({
          type: PRODUCT_UPDATE_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      })
  }
}


export const createProductReview = (productId, review) => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_CREATE_REVIEW_REQUEST
      })

      const {
          userLogin: { userInfo },
      } = getState()

      const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
          }
      }

      const { data } = await axios.post(
          `/products/${productId}/reviews/`,
          review,
          config
      )
      dispatch({
          type: PRODUCT_CREATE_REVIEW_SUCCESS,
          payload: data,
      })

  } catch (error) {
      dispatch({
          type: PRODUCT_CREATE_REVIEW_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      })
  }
}
