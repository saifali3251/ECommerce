import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Row, Col} from 'react-bootstrap'
// import products from '../products'
import Product from '../components/Product'
// import axios from 'axios'
import {listProducts} from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

// history is being passed from searchBox.js
// function HomeScreen({history}) {
  function HomeScreen() {
  // const [products,setProducts] = useState([]) commenting it bcs now we will use productAction to fetch data using api
  //we have used useDispatch() to dispatch the listProducts() function
  const dispatch = useDispatch()
  // console.log('dispatch is ',dispatch);
  //now we will use useSelector to select the part of state we need to render
  //here we are selecting productList from state which contains the productListReducer.
  //this productListReducer further contain error,loading and products which we can use now
  const productList = useSelector(state => state.productList)
  const {error, loading, products} = productList
  console.log('error, loading,products ', error,loading,products);

  // we will use passed keyword to get resuts
  // let keyword = history.location.search

  useEffect(()=>{
    console.log('Inside useEffect');
    dispatch(listProducts())
    // So now listProducts takes keyworkd as an argument. We need pass in this function defn too
    // dispatch(listProducts(keyword))

    //below code is moved to listProducts method and we are using this moethod here now
    // async function fetchProducts(){
    //   const {data} = await axios.get('/products/')
    //   // const {data} = await axios.get('http://127.0.0.1:8001/api/products/')
    //   // we can add a proxy in package.json as 'http://127.0.0.1:8001/'
    //   setProducts(data)
    // }
    // fetchProducts()
  }, [dispatch])

  return (
    <div>
      <h1>Latest Products</h1>
      {loading ? <Loader />
               : error ? <Message variant='danger'>{error}</Message>
               : <Row>
               {products.map(product =>(
                 <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                 <Product product={product} />
                 </Col>
               ))}
             </Row>
    }
    </div>
  )
}

export default HomeScreen