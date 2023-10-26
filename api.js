const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'mercado.c1rmsxzyhbjb.us-east-2.rds.amazonaws.com',
  user: 'root',
  password: 'SkyT3l1!$',
  database: 'mercado',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/produtos', (req, res) => {
  const { name, quantity_item, shelfs, sections, code_bar } = req.body;

  const sql = 'INSERT INTO products (name, quantity_item, shelfs, sections, code_bar) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, quantity_item, shelfs, sections, code_bar], (err, result) => {
    if (err) {
      console.error('Erro ao inserir produto:', err);
      res.status(500).json({ error: 'Erro ao inserir produto' });
    } else {
      res.status(201).json({ message: 'Produto inserido com sucesso' });
    }
  });
});

app.get('/produtos', (req, res) => {
  const sql = 'SELECT * FROM products';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao recuperar produtos:', err);
      res.status(500).json({ error: 'Erro ao recuperar produtos' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/produtos/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE id = ?';

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Erro ao recuperar produto:', err);
      res.status(500).json({ error: 'Erro ao recuperar produto' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

app.put('/produtos/:id', (req, res) => {
  const productId = req.params.id;
  const { name, quantity_item, shelfs, sections, code_bar } = req.body;

  const sql = 'UPDATE products SET name = ?, quantity_item = ?, shelfs = ?, sections = ?, code_bar = ? WHERE id = ?';

  db.query(sql, [name, quantity_item, shelfs, sections, code_bar, productId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar produto:', err);
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      res.status(200).json({ message: 'Produto atualizado com sucesso' });
    }
  });
});

app.delete('/produtos/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir produto:', err);
      res.status(500).json({ error: 'Erro ao excluir produto' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      res.status(200).json({ message: 'Produto excluído com sucesso' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
