
const express = require('express');
const productsRouter = require('./products/products-router');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({
    api: 'running',
  });
});

server.use('/api/products', productsRouter);

server.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: 'Internal server error',
  });
});

module.exports = server;
