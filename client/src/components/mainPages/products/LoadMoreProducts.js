import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'

const LoadMoreProducts = () => {
    const state = useContext(GlobalState)
    const [page, setPage] = state.ProductsApi.page
    const [result] = state.ProductsApi.result
    return (
        <div className="load_more">
            {
                result < page * 9 ? "" :
                <button onClick={() =>setPage(page+1)}>View More</button>
            }
        </div>
    )
}

export default LoadMoreProducts
