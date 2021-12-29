import React from "react";
import BtnRender from "./BtnRender";

const ProductItem = ({ product, isAdmin, deleteProduct, handleCheck}) => {

  return (
    <div className="product-card">
      {
        isAdmin && <input type="checkbox" checked={product.checked}
        onChange={() => handleCheck(product._id)}/>
      }
      <img src={product.images.url} alt="pic" />

      <div className="product-box">
        <h5 title={product.title}>{product.title}</h5>
        <span>${product.price}</span>
        <p>{product.description}</p>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
};

export default ProductItem;

