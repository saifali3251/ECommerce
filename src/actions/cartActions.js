import axios from 'axios'
import { CART_ADD_ITEM, CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
   } from "../constants/cartConstants";


// getState. It helps you retrieve the current state of your Redux store. It's like useSelector
export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/products/${id}`)
    console.log("Inside cartAction addToCart", data);
    console.log('getState is ',getState());
    //this dispatch will trigger cartReducers.js
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id, 
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })
    //we want to store the cart item into local storage so that even if we close the page, item will still be in the cart.
    //using JSON.stringify since data is always stored as JSON format
    //getState() will take the current item
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}



export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}


export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data))
}



export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}
