import axios from 'axios'
import React, { useContext, useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import ProductItem from '../utils/productsItem/ProductItem';
import Filters from './Filters'
import LoadMoreProducts from './LoadMoreProducts';

const Products = () => {
    const state = useContext(GlobalState);
    const [products, setProducts] = state.ProductsApi.products;
    const [isAdmin] = state.userApi.isAdmin
    const [token] = state.token
    const [callback,  setCallback] = state.ProductsApi.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const handleCheck = (id) =>{
        products.forEach(product => {
            if(product._id === id) return product.checked = !product.checked
        })
        setProducts([...products])
    }

    const deleteProduct = async(id, public_id)=>{
        console.log({id, public_id})
        try {
          setLoading(true)
          const eraseImg =  axios.post('/api/erase', {public_id}, {
            headers: {Authorization: token}
          })
          const deleteProduct =  axios.delete(`/api/products/${id}`, {
            headers: {Authorization: token}
          })
    
          await eraseImg
          await deleteProduct
          setCallback(!callback)
          setLoading(false)
        } catch (error) {
          alert(error.response.data.lsg) 
        }
    }

    const checkAll = () =>{
        products.forEach(product =>{
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteSelected = () =>{
        products.forEach(product =>{
            if(product.checked) return deleteProduct(product._id, product.images.public_id)
        })
    }

    if(loading) return <div className="products"><Loading/></div>
    return (
        <>
        <Filters/>
        
        {
            isAdmin && 
            <div className='delete-all'>
                <span>Select All</span>
                <input type="checkbox" checked ={isCheck} onChange={checkAll} />
                <button onClick={deleteSelected}>Delete All</button>
            </div>
        }

        <div className="products">
            {
                products.map(product =>{
                    return <ProductItem key={product._id} product={product}
                    isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck}/>
                } )
            }
        </div>

        <LoadMoreProducts/>
        {products.length === 0 && <Loading/>}
        </>
    )
}

export default Products
