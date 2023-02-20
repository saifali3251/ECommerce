import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { PayPalButton } from 'react-paypal-button-v2'
import GooglePayButton from "@google-pay/button-react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/OrderConstants";
import { ORDER_DELIVER_RESET } from '../constants/OrderConstants'

function OrderScreen({ match, history }) {
  const orderId = match.params.id;
  console.log(orderId);
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  console.log(
    "Outside useEffect order, orderId, error, loading are ",
    order,
    orderId,
    error,
    loading
  );

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector(state => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    console.log("Loding is ", loading);
    console.log("Error is ", error);
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  // adding paypal script to view the paypal button
  // const addPayPalScript = () => {
  //     const script = document.createElement('script')
  //     script.type = 'text/javascript'
  //     script.src = 'https://www.paypal.com/sdk/js?client-id=AeDXja18CkwFUkL-HQPySbzZsiTrN52cG13mf9Yz7KiV2vNnGfTDP0wDEN9sGlhZHrbb_USawcJzVDgn'
  //     script.async = true
  //     script.onload = () => {
  //         setSdkReady(true)
  //     }
  //     // appending once it is ready
  //     document.body.appendChild(script)
  // }

  const addPayPalScript = () => {
    setSdkReady(true);
  };

  useEffect(() => {
    if(!userInfo){
      history.push('/login')
    }
    console.log("Running UseEffect...");
    if (!order || order._id !== Number(orderId) || successPay || successDeliver ) {
      dispatch({type : ORDER_PAY_RESET})
      dispatch({type : ORDER_DELIVER_RESET})
      console.log("Inside if.. in useEffect. dispatch(getOrderDetails(orderId))");
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        //   setSdkReady(false)
        console.log("Not paid yet");
        addPayPalScript();
      } else {
        setSdkReady(true);
        console.log("Paid now");
      }
    }
  }, [dispatch, order, orderId]);

  const successPaymentHandler = (e,paymentResult) => {
      e.preventDefault();
    dispatch(payOrder(orderId, paymentResult));
    console.log("PAID!");
  };
  const returnHandler = (e) => {
    e.preventDefault();
    console.log("Returning to homeScreen");
    history.push("/");
  };

  const deliverHandler = () => {
      dispatch(deliverOrder(order))
  }

  return loading ? (
    <div>
      <Loader />
      Loading here
    </div>
  ) : error ? (
    <div>Error will display here</div>
  ) : (
    // <Message variant='danger'>{error}</Message>
    <div>
      <h1>Order: {order.Id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              {/* getting these name and email from backend from OrderSerializer */}
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {"  "}
                {order.shippingAddress.postalCode},{"  "}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    // <Button onClick={returnHandler}>
                    //   amount={order.totalPrice}
                    //   onSuccess={successPaymentHandler}
                    // </Button>
                    <GooglePayButton
                    //   onClick={successPaymentHandler}
                      environment="TEST"
                      buttonSizeMode="static"
                      paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                          {
                            type: "CARD",
                            parameters: {
                              allowedAuthMethods: [
                                "PAN_ONLY",
                                "CRYPTOGRAM_3DS",
                              ],
                              allowedCardNetworks: ["MASTERCARD", "VISA"],
                            },
                            tokenizationSpecification: {
                              type: "PAYMENT_GATEWAY",
                              parameters: {
                                gateway: "example",
                                gatewayMerchantId: "exampleGatewayMerchantId",
                              },
                            },
                          },
                        ],
                        merchantInfo: {
                          merchantId: "12345678901234567890",
                          merchantName: "Demo Merchant",
                        },
                        transactionInfo: {
                          totalPriceStatus: "FINAL",
                          totalPriceLabel: "Total",
                          totalPrice: 1,
                          currencyCode: "USD",
                          countryCode: "US",
                        },
                      }}
                      onLoadPaymentData={(paymentRequest) => {
                        console.log("load payment data", paymentRequest);
                      }}
                    />
                    // <PayPalButton
                    //     amount={order.totalPrice}
                    //     onSuccess={successPaymentHandler}
                    // />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
