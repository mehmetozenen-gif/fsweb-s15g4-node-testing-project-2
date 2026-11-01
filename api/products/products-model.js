
const db = require('../../data/db-config');

// Tüm ürünleri getir
function getAll() {
  return db('products').orderBy('id', 'asc');
}

// ID'ye göre ürün getir
function getById(id) {
  return db('products')
    .where({ id })
    .first();
}

// Yeni ürün oluştur
async function create(product) {
  const [id] = await db('products').insert(product);
  return getById(id);
}

module.exports = {
  getAll,
  getById,
  create,
};
