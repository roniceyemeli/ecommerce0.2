import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import PaypalButton from './PaypalButton'

const Cart = () => {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userApi.cart;
  const [total, setTotal] = useState(0);
  const [token] = state.token
  console.log(cart)

  useEffect(() => {
    const getTotal = () =>{
      const total = cart.reduce((prev,item) => {
        return prev + (item.price * item.quantity)
      }, 0)
      setTotal(total)
    }

    getTotal()
  }, [cart]);

  const addToCart = async(cart) => {
    await axios.patch('/user/addcart', {cart}, {
      headers: {Authorization: token}
    })
  }

  const increment = (id) =>{
    cart.forEach(item =>{
      if(item._id === id){
        item.quantity += 1
      }
    })
    setCart([...cart])
    addToCart(cart)
  }

  const decrement = (id) =>{
    cart.forEach(item =>{
      if(item._id === id){
        item.quantity === 1 ? item.quantity = 1 : item.quantity -=1
      }
    })
    setCart([...cart])
    addToCart(cart)
  }

  const deleteItem = (id) =>{
    if (window.confirm('Do you want to delete this item')){
      cart.forEach((item,index) => {
        if(item._id === id){
          cart.splice(index, 1)
        }
      })
      setCart([...cart])
      addToCart(cart)
    }
  }

  const tranSuccess = async(payment) =>{
    console.log(payment)
    const {paymentID, address} = payment ;

    await axios.post('/api/payment', {cart, paymentID, address}, {headers: {Authorization: token}})
    
    setCart([])
    addToCart([])
    alert('You have successuly placed an order')
  }

  if (cart.length === 0)
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "20%",
          textTransform: "uppercase",
        }}
      >
        Your cart is empty
      </h2>
    );
  return (
    <div className='blck'>
      {cart.map((product) => ( 
        <div className="detail-cart" key={product._id}>
          <img src={product.images.url} alt="" />

          <div className="box-detail">
            <h4>{product.title}</h4>

            <h5>Price: ${product.price * product.quantity}</h5>
            <p>Description: {product.description}</p>
            <p>Content: {product.content}</p>

            <div className="amount">
                <button onClick={() => decrement(product._id)}> - </button>
                <span>{product.quantity}</span>
                <button onClick={() => increment(product._id)}> + </button>
            </div>

            <div><i className="fas fa-trash" id='del'onClick={() =>deleteItem(product._id)}></i></div>
          </div>
        </div>
      ))}

      <div className="total">
          <h3>Total: $ {total}</h3>
          <PaypalButton total={total} tranSuccess={tranSuccess} />
      </div>
    </div>
  );
};

export default Cart;
