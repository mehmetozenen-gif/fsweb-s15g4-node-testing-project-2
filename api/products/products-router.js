
const express = require('express');
const router = express.Router();

const Products = require('./products-model');

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const products = await Products.getAll();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Products.getById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const { name, price, stock = 0 } = req.body || {};

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof price !== 'number' ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        message: 'Invalid product data',
      });
    }

    const product = await Products.create({
      name: name.trim(),
      price,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
