import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import { GlobalState } from '../../GlobalState'
import AddProducts from './addProducts/AddProducts'
import Login from './auth/Login'
import Register from './auth/Register'
import Cart from './cart/Cart'
import Categories from './categories/Categories'
import DetailProduct from './detailProduct/DetailProduct'
import OrderDetails from './history/OrderDetails'
import OrderHistory from './history/OrderHistory'

import Products from './products/Products'
import NotFound from './utils/notFound/NotFound'

const Home = () => {
    const state = useContext(GlobalState)
    const [isLogged] = state.userApi.isLogged
    const [isAdmin] = state.userApi.isAdmin

    return (
            <Switch>
                <Route  path="/" exact component={Products} />
                <Route  path="/detail/:id" exact component={DetailProduct} />

                <Route  path="/login" exact component={isLogged ? NotFound : Login} />
                <Route  path="/register" exact component={isLogged ? NotFound : Register} />

                <Route  path="/category" exact component={isAdmin ? Categories :NotFound } />
                <Route  path="/addproduct" exact component={isAdmin ? AddProducts :NotFound } />
                <Route  path="/editproduct/:id" exact component={isAdmin ? AddProducts :NotFound } />

                <Route  path="/history" exact component={isLogged ? OrderHistory: NotFound} />
                <Route  path="/history:id" exact component={isLogged ? OrderDetails: NotFound} />

                <Route  path="/cart" exact component={Cart} />

                <Route  path="*" exact component={NotFound} />
            </Switch>
    )
}

export default Home
