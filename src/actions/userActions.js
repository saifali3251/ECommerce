import axios from "axios";
import { useState } from "react";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_LOGOUT,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  USER_DETAILS_RESET,

  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,

  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,

  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL, 
 } from "../constants/userConstants";

 import { ORDER_LIST_MY_RESET } from '../constants/OrderConstants'


export const login = (email,password) => async (dispatch) =>{
  try{
    dispatch({
      type : USER_LOGIN_REQUEST
    })
    const config = {
      headers : {'Content-type' : 'application/json'}
    }
    const {data} = await axios.post(
      '/users/login/',
      {'username' : email, 'password': password},
      config
      )
    dispatch({
      type : USER_LOGIN_SUCCESS,
      payload:data
    })
    // once we got data we want to store it in our local storage
    localStorage.setItem('userInfo',JSON.stringify(data))
    //we have set it in local which we will further use in store.js

  } catch(error){
    dispatch({
              type : USER_LOGIN_FAIL,
              //checkin if we have generic response or custom message(custom message is one we send from backend)
              payload : error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
    })
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({type : USER_LOGOUT})
  dispatch({type : USER_DETAILS_RESET})
  // reseting the order_list once user logs out
  dispatch({type : ORDER_LIST_MY_RESET})
  // we want to remove all the userlist once the logged in user(admin) logs out
  dispatch({type : USER_LIST_RESET})
}


// here we are passing name,email and pw by user bcs in backend we ae accepting only these fileds
export const register = (name,email,password) => async (dispatch) =>{
  try{
    dispatch({
      type : USER_REGISTER_REQUEST
    })
    const config = {
      headers : {'Content-type' : 'application/json'}
    }
    const {data} = await axios.post(
      '/users/register/',
      {'name' : name, 'email' : email, 'password': password},
      config
      )
    dispatch({
      type : USER_REGISTER_SUCCESS,
      payload:data
    })
    // Once register is success, we want to login User. This will allow user to log in automaticalled once the register is success
    // WE see below dispatch will trigger other reducer function
    dispatch({
      type : USER_LOGIN_SUCCESS,
      payload:data
    })

  } catch(error){
    dispatch({
              type : USER_REGISTER_FAIL,
              //checkin if we have generic response or custom message(custom message is one we send from backend)
              payload : error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
    })
  }
}


// we will pass id from frontend and then will fetch API using this id
// Also we are passing getState(which is more like useSelector) to get the current user which is logged in so that we can get the profile of that user
// Approach : We are passing getState to get current user logged in and then using array destructing we are getting that user's userInfo. Now in order to ake this api work we need to pass the token along with the API in header as we did in Postman. So we pass Authorization key with Bearer value in header and pased it as config in get() method. Thus we did same thing what we did in Postman.
export const getUserDetails = (id) => async (dispatch,getState) =>{
  try{
    dispatch({
      type : USER_DETAILS_REQUEST
    })
    // console.log('Requested..')
    const { userLogin : {userInfo}, } = getState() 
    // const { userInfo } = getState()
    console.log(userInfo)
    // console.log(userInfo.refresh)

    // const { userInfo } = getState()
    const config = {
      headers : {
        'Content-type' : 'application/json',
        // here we need to pass the uthorization token since in backend we are authoenticating the user
        Authorization : `Bearer ${userInfo.token}`
      }
    }
    // so this id will actually be a string 'profile' that we will pass from frontEnd. So we have used it as id here
    // So this is calling our 'getUserProfile' view in Backend
    const {data} = await axios.get(
      `/users/${id}/`,
      config
      )
      console.log('Get User Detail',data);

      dispatch({
      type : USER_DETAILS_SUCCESS,
      payload:data
    })

  } catch(error){
    dispatch({
              type : USER_DETAILS_FAIL,
              //checkin if we have generic response or custom message(custom message is one we send from backend)
              payload : error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
    })
  }
}


//we still need user information to update so we passed getState
// we are passing user field
export const updateUserProfile = (user) => async (dispatch,getState) =>{
  try{
    dispatch({
      type : USER_UPDATE_PROFILE_REQUEST
    })
    // console.log('Requested..')
    const { userLogin : {userInfo}, } = getState()
    // const { userInfo } = getState()
    // console.log(userInfo)
    // console.log(userInfo.refresh)

    // const { userInfo } = getState()
    const config = {
      headers : {
        'Content-type' : 'application/json',
        Authorization : `Bearer ${userInfo.token}`
      }
    }
    // so this id will actually be a string 'profile' that we will pass from frontEnd. So we have used it as id here
    // So this is calling our 'getUserProfile' view in Backend
    const {data} = await axios.put(
      // `/users/${id}/`,
      '/users/profile/update/',
      user,
      // {name:name,email:email,password:password}, or instad of it, we will pass the user object bcs user can update either one field or all fields
      config
      )
      console.log('Update User Detail',data);

      dispatch({
      type : USER_UPDATE_PROFILE_SUCCESS,
      payload:data
    })
    // Once success, we want to log the user with this new data.
    dispatch({
      type : USER_LOGIN_SUCCESS,
      payload:data
    })
    localStorage.setItem('userInfo',JSON.stringify(data))

  } catch(error){
    dispatch({
              type : USER_UPDATE_PROFILE_FAIL,
              //checkin if we have generic response or custom message(custom message is one we send from backend)
              payload : error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
    })
  }
}

export const listUsers = () => async (dispatch,getState) =>{
  try{
    dispatch({
      type : USER_LIST_REQUEST
    })
    // console.log('Requested..')
    const { userLogin : {userInfo}, } = getState()
    // const { userInfo } = getState()
    // console.log(userInfo)
    // console.log(userInfo.refresh)

    // const { userInfo } = getState()
    const config = {
      headers : {
        'Content-type' : 'application/json',
        Authorization : `Bearer ${userInfo.token}`
      }
    }
    // so this id will actually be a string 'profile' that we will pass from frontEnd. So we have used it as id here
    // So this is calling our 'getUserProfile' view in Backend
    const {data} = await axios.get(
      // `/users/${id}/`,
      '/users/',
      config
      )
      console.log('Update User Detail',data);

      dispatch({
      type : USER_LIST_SUCCESS,
      payload:data
    })
    // Once success, we want to log the user with this new data.
    // dispatch({
    //   type : USER_LOGIN_SUCCESS,
    //   payload:data
    // })
    // localStorage.setItem('userInfo',JSON.stringify(data))

  } catch(error){
    dispatch({
              type : USER_LIST_FAIL,
              //checkin if we have generic response or custom message(custom message is one we send from backend)
              payload : error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
    })
  }
}


export const deleteUser = (id) => async (dispatch, getState) => {
  try {
      dispatch({
          type: USER_DELETE_REQUEST
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

      const { data } = await axios.delete(
          `/users/delete/${id}/`,
          config
      )

      dispatch({
          type: USER_DELETE_SUCCESS,
          payload: data
      })


  } catch (error) {
      dispatch({
          type: USER_DELETE_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      })
  }
}


// passing entire object for update
export const updateUser = (user) => async (dispatch, getState) => {
  try {
      dispatch({
          type: USER_UPDATE_REQUEST
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
          `/users/update/${user._id}/`,
          user,
          config
      )

      dispatch({
          type: USER_UPDATE_SUCCESS,
      })

      // once the user is updated we are dispatching this to get the updated data
      dispatch({
          type: USER_DETAILS_SUCCESS,
          payload: data
      })


  } catch (error) {
      dispatch({
          type: USER_UPDATE_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      })
  }
}