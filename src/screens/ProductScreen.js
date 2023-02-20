import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

//ProductScreen contains the product datail
// match is the id we dynamically passing in App.js which is passed while clicking the products
// history is part of props that we are passing into it. We are using history to redirect to another page
function ProductScreen({ match, history }) {


  // console.log(match,history);
  // const product = products.find((p) => p._id == match.params.id )
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  // console.log('Product inside ProductScreen ',product);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  // console.log('User Login info : ',userInfo);

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate;

  console.log('Loading , Error , success status for review : ',loadingProductReview,errorProductReview,successProductReview);
  // console.log('Value of match,successProductReview before useEffect : ',match,successProductReview);
  useEffect(() => {
    console.log('Running useEffect..')

    // Once the review is submitted, we are clearing the rating and comments filed and clearing the Redux using dispatch
    if(successProductReview){
      setRating(0)
      setComment('Cleared')
      dispatch({type : PRODUCT_CREATE_REVIEW_RESET})
    }
    // added this dispatch to that for different products, the revies are fetched everytime. If commented, the error from once product
    // review will be shown at other product's review
    dispatch({type : PRODUCT_CREATE_REVIEW_RESET})

    // match.params.id will give the id for porduct
    // added this dispatch so that whenever the 'match' changes, the entire review state is reset so that we dont see the error of one product into another product
    // commen below line and see what difference we get
    dispatch(listProductDetails(match.params.id));

    // console.log(match)

    // async function fetchProduct(){
    // console.log(match)
    // const {data} = await axios.get(`/products/${match.params.id}`)
    // // const {data} = await axios.get('http://127.0.0.1:8000/products/')
    // // we can add a proxy in package.json as 'http://127.0.0.1:8001/'
    // setProduct(data)
    // }
    // fetchProduct()
    // console.log('Triggered!!')
  }, [dispatch, match,successProductReview]);

  // let product = {}
  //Once this fn is triggered, it triggers CartScreen bcs in CartScreen we have a dispatcher on the quantity button that is fired once the qty changes
  const addToCartHandler = () => {
    // console.log("Clicked addToCartHandler for id : ", match.params.id);
    //Now we want to redirect it to CartScreen component with clicked item id and quantity.
    // We will use useHistory hook for it
    // console.log(history);
    // checking if the user is logged in or not
    if(userInfo){
      // Redirecting to cart page
      history.push(`/cart/${match.params.id}?qty=${qty}`);
    }
    else{
      history.push('/login')
    }
    // console.log(qty)
    // history.push('/cart')
  };

  const submitHandler = (e) =>{
    e.preventDefault()
    // So here we are passing the data into Redux to create a review
    dispatch(createProductReview(match.params.id,{rating,comment}))
  }


  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/* <Rating value={product.rating} text={product.reviews} color={} /> */}
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color={"#f8e825"}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description : {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price :</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status :</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out Of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {
                              // This is how we initialize a array with integers([0,1,2,3..])
                              [...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )
                            }
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      // onClick={userInfo ? addToCartHandler : console.log('login')}
                      onClick={addToCartHandler}
                      className="w-100"
                      disabled={product.countInStock === 0}
                      type="button"
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* Below Row is for Reviews Part */}
          <Row>
            <Col md={6}>
              <h4>Reviews</h4>
              {product.reviews.length === 0 && (
                <Message variant="info">No Reviews</Message>
              )}

              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color="#f8e825" />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h4>Write a review</h4>

                  {/* while the review is being loaded, we are loading */}
                  {loadingProductReview && <Loader />}
                  {successProductReview && (
                    <Message variant="success">Review Submitted</Message>
                  )}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}

                  {/* Checking if user is logged In  */}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="5"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button
                      // button is disabled while the review is being loaded to avaoid clicking it before the review gets loaded
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant="info">
                      Please <Link to="/login">login</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
