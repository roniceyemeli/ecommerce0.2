const Products = require("../models/Product");


// filter, sorting and paginating
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy)
    }
    else{
      this.query = this.query.sort('-createdAt')
    }
    return this;
  }

  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete(queryObj[el]));

    // console.log({after: queryObj})

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,(match) => "$" + match);

    // console.log({queryStr})

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 9
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit)
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering().sorting().paginating();

      const products = await features.query;

      res.json({
        status: 'success',
        result: products.length,
        products: products
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  newProducts: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        content,
        description,
        category,
        images,
      } = req.body;
      if (!images) return res.status(400).json({ msg: "no image uploaded" });

      const product = await Products.findOne({ product_id });
      if (product)
        return res.status(400).json({ msg: "product name exist already" });

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        category,
        images,
      });

      await newProduct.save();

      res.json({ msg: "new product added" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProducts: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "product deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProducts: async (req, res) => {
    try {
      const { title, price, description, content, category, images } = req.body;
      if (!images)
        return res.status(400).json({ msg: "you should upload an image :)" });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          category,
          images,
        }
      );
      res.json({ msg: "product updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productCtrl;
