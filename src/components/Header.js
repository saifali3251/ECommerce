import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
// import { Link, LinkContainer } from 'react-router-bootstrap'
// import SearchBox from './SearchBox'
import { getUserDetails, logout } from '../actions/userActions'
import { Link } from 'react-router-dom'
// import { getUserDetails, updateUserProfile } from '../actions/userActions'

// use rfce to write skeleton

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
      console.log('Log Out');
    //   dispatch(getUserDetails('profile'))
        dispatch(logout())
    }

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Link to='/'>
                        <Navbar.Brand>ProShop</Navbar.Brand>
                    </Link>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* <SearchBox /> */}
                        <Nav className="ml-auto">

                            { userInfo && <Link to='/cart'>
                                {/* <Nav.Link ><i className="fas fa-shopping-cart"></i>Cart</Nav.Link> */}
                                <i className="fas fa-shopping-cart"></i>Cart
                            </Link>}

                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <Link to='/profile'>
                                        Profile
                                        {/* <NavDropdown.Item>Profile</NavDropdown.Item> */}
                                    </Link>

                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>

                                </NavDropdown>
                            ) : (
                                    <Link to='/login'>
                                        <i className="fas fa-user"></i>Login
                                        {/* <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link> */}
                                    </Link>
                                )}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenue'>
                                    <Link to='/admin/userlist'>
                                        Users
                                        {/* <NavDropdown.Item>Users</NavDropdown.Item> */}
                                    </Link>

                                    <Link to='/admin/productlist'>
                                        Products
                                        {/* <NavDropdown.Item>Products</NavDropdown.Item> */}
                                    </Link>

                                    <Link to='/admin/orderlist'>
                                        Orders
                                        {/* <NavDropdown.Item>Orders</NavDropdown.Item> */}
                                    </Link>

                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header