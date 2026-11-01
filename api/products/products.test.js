
const request = require('supertest');
const server = require('../server');
const db = require('../../data/db-config');

// Her testten önce test veritabanını temizle
// ve örnek ürünleri yeniden oluştur.
beforeEach(async () => {
  await db('products').del();

  await db('products').insert([
    { id: 1, name: 'Laptop', price: 25000, stock: 10 },
    { id: 2, name: 'Mouse', price: 500, stock: 50 },
    { id: 3, name: 'Klavye', price: 1500, stock: 25 },
  ]);
});

// Testler tamamlandığında bağlantıyı kapat
afterAll(async () => {
  await db.destroy();
});

describe('GET /api/products', () => {
  test('1. HTTP 200 döndürür', async () => {
    const res = await request(server).get('/api/products');
    expect(res.status).toBe(200);
  });

  test('2. JSON formatında yanıt döndürür', async () => {
    const res = await request(server).get('/api/products');
    expect(res.type).toMatch(/json/);
  });

  test('3. Ürünleri dizi olarak döndürür', async () => {
    const res = await request(server).get('/api/products');
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('4. Üç ürün döndürür', async () => {
    const res = await request(server).get('/api/products');
    expect(res.body).toHaveLength(3);
  });

  test('5. Ürünleri ID sırasına göre döndürür', async () => {
    const res = await request(server).get('/api/products');
    expect(res.body.map(p => p.id)).toEqual([1, 2, 3]);
  });
});

describe('GET /api/products/:id', () => {
  test('6. Doğru ürünü getirir', async () => {
    const res = await request(server).get('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Laptop');
  });

  test('7. Ürünün tüm alanlarını döndürür', async () => {
    const res = await request(server).get('/api/products/2');

    expect(res.body).toEqual({
      id: 2,
      name: 'Mouse',
      price: 500,
      stock: 50,
    });
  });

  test('8. Olmayan ürün için 404 döndürür', async () => {
    const res = await request(server).get('/api/products/999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });
});

describe('POST /api/products', () => {
  test('9. Yeni ürün oluşturur ve 201 döndürür', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({
        name: 'Monitor',
        price: 4500,
        stock: 8,
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Monitor');
    expect(res.body.id).toBeDefined();
  });

  test('10. Ürünü gerçekten veritabanına kaydeder', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({
        name: 'Kulaklık',
        price: 2000,
        stock: 12,
      });

    const product = await db('products')
      .where({ id: res.body.id })
      .first();

    expect(product.name).toBe('Kulaklık');
  });

  test('11. İsim eksikse 400 döndürür', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({ price: 1000, stock: 5 });

    expect(res.status).toBe(400);
  });

  test('12. Negatif fiyatı reddeder', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({
        name: 'Hatalı Ürün',
        price: -100,
        stock: 5,
      });

    expect(res.status).toBe(400);
  });

  test('13. Negatif stok değerini reddeder', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({
        name: 'Hatalı Ürün',
        price: 100,
        stock: -5,
      });

    expect(res.status).toBe(400);
  });

  test('14. İsimdeki boşlukları temizler', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({
        name: '  Tablet  ',
        price: 8000,
        stock: 4,
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Tablet');
  });

  test('15. Stok belirtilmezse sıfır kabul eder', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({
        name: 'USB Kablo',
        price: 150,
      });

    expect(res.status).toBe(201);
    expect(res.body.stock).toBe(0);
  });
});
