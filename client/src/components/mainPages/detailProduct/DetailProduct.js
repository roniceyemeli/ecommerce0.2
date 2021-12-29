import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productsItem/ProductItem'

const DetailProduct = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.ProductsApi.products
    const addCart = state.userApi.addCart
    const [detailProduct, setDetailProduct] = useState([])

    useEffect(() => {
        if(params.id){
            products.forEach(product => {
                if(product._id === params.id) return setDetailProduct(product)
            });
        }
    }, [params.id, products])

    if(detailProduct.length===0) return null

    return (
    <>
            <div className="detail" >
                <img src={detailProduct.images.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h4>{detailProduct.title}</h4>
                        <h6>#{detailProduct.product_id}</h6>
                    </div>
                    <span>Price: ${detailProduct.price}</span>
                    <p>Description: {detailProduct.description}</p>
                    <p>Content: {detailProduct.content}</p>
                    <p>Sold: {detailProduct.sold}</p>
                    <Link to="/cart" className="cart" onClick={()=> addCart(detailProduct)}>purchase now</Link>
                </div>
            </div>
            <div>
                <h4>Related Products</h4>
                <div className="products">
                    {
                        products.map(product =>{
                            return product.category === detailProduct.category ?
                            <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
            </div>

    </>
        
    )
}

export default DetailProduct
