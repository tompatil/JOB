
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

let products = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 200 },
  { id: 3, name: "Product C", price: 300 },
  { id: 4, name: "Product D", price: 400 },
  { id: 5, name: "Product E", price: 500 },
  { id: 6, name: "Product F", price: 600 },
  { id: 7, name: "Product G", price: 700 },
  { id: 8, name: "Product H", price: 800 },
  { id: 9, name: "Product I", price: 900 },
  { id: 10, name: "Product J", price: 1000 }
];

// Pagination + Sorting + Search
app.get('/api/products', (req, res) => {
  let { page, sort, search } = req.query;
  page = parseInt(page) || 1;
  const limit = 5; //  Always 5 items per page

  let filtered = [...products];
  if (search) {
    search = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  }

  if (sort === 'asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'desc') filtered.sort((a, b) => b.price - a.price);

  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  res.json({
    page,
    totalPages: Math.ceil(filtered.length / limit),
    totalItems: filtered.length,
    data: paginated
  });
});

// Add product
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Missing name or price" });
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price
  };
  products.push(newProduct);
  res.json(newProduct);
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;
  const p = products.find(pr => pr.id === id);
  if (!p) return res.status(404).json({ message: "Not found" });
  p.name = name;
  p.price = price;
  res.json(p);
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log(" Server running on http://localhost:3000/app.html"));
