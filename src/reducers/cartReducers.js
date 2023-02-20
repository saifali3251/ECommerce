import { CART_ADD_ITEM, CART_REMOVE_ITEM,
         CART_SAVE_SHIPPING_ADDRESS,
         CART_SAVE_PAYMENT_METHOD,
        } from "../constants/cartConstants";

import { CART_CLEAR_ITEMS } from "../constants/cartConstants";

//We have added shippingAddress as our state value
export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
  // console.log(state)
  switch (action.type) {
      case CART_ADD_ITEM:
        console.log('State Inside CART_ADD_ITEM ',state)
          const item = action.payload
          //here product is id we defined in cartActions.js(it's not product object but just _id)
          const existItem = state.cartItems.find(x => x.product === item.product)

          if (existItem) {
              return {
                  ...state,
                  // We find the item that exists and then we replace that found item with x(new added item)
                  cartItems: state.cartItems.map(x =>
                      x.product === existItem.product ? item : x)
                    }

          } else {
              return {
                  ...state,
                  cartItems: [...state.cartItems, item]
              }
          }
      case CART_REMOVE_ITEM:
          return {
              ...state,
              cartItems: state.cartItems.filter(x => x.product !== action.payload)
          }
      case CART_SAVE_SHIPPING_ADDRESS:
        return {
          ...state,
          shippingAddress: action.payload
        }
      case CART_SAVE_PAYMENT_METHOD:
        return {
          ...state,
          paymentMethod : action.payload
        }
      case CART_CLEAR_ITEMS:
        return {
          ...state,
          cartItems : {}
        }
      default:
        return state
      }
    }