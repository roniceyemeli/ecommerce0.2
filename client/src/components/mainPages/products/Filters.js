import React, { useContext } from 'react';
import {GlobalState} from '../../../GlobalState'


const Filters = () => {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesApi.categories


    const [category, setCategory] = state.ProductsApi.category
    const [sort, setSort] = state.ProductsApi.sort
    const [search, setSearch] = state.ProductsApi.search

    const handleCategory = (e) =>{
        setCategory(e.target.value)
        setSearch('')
    }
    
    return (
        <div className='filter_menu'>

            <div className='roww sort'>
                <span>Filters: </span>
                <select name='category' value={category} onChange={handleCategory}>
                    <option value=''>All Products</option>
                    {   
                        categories.map(category => (
                            <option value={'category=' + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" value={search} placeholder='Search...'
                onChange={(e) =>setSearch(e.target.value.toLowerCase())}/>
            
            <div className='roww'>
                <span>Sort by: </span>
                <select  value={sort} onChange={(e)=>setSort(e.target.value)}>
                    <option value=''>Newest</option>
                    <option value='sort=oldest'>Oldest</option>
                    <option value='sort=sold'>Best sales</option>
                    <option value='sort=price'>Price: Hight-Low</option>
                    <option value='sort=price'>Price: Low-Hight</option>           
                </select>
            </div>
        </div>
    )
}

export default Filters
