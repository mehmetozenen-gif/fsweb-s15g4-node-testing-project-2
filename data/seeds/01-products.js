
exports.seed = async function (knex) {
  // Önce mevcut ürünleri temizle
  await knex('products').del();

  // ID sayacını sıfırla
  await knex('sqlite_sequence')
    .where({ name: 'products' })
    .del();

  // Örnek ürünleri ekle
  await knex('products').insert([
    {
      name: 'Laptop',
      price: 25000,
      stock: 10,
    },
    {
      name: 'Mouse',
      price: 500,
      stock: 50,
    },
    {
      name: 'Klavye',
      price: 1500,
      stock: 25,
    },
  ]);
};
