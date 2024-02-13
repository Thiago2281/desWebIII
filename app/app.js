const LivrosMysqlDao = require('./lib/projeto/LivrosMysqlDao');
const LivrosController = require('./controllers/LivrosControllers');
const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'bd', 
    user            : process.env.MARIADB_USER,
    password        : process.env.MARIADB_PASSWORD,
    database        : process.env.MARIADB_DATABASE,
});
module.exports = pool;

app.use(bodyParser.urlencoded({ extended: false }))

let livrosDao = new LivrosMysqlDao(pool);
/* let livrosController = new LivrosController(livrosDao);*/

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/index', (req, res) => {
  pool.query('SELECT livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
    if(erro){
      res.status(200).send(erro)
    }
    res.render('lista', {lista:listagem});
  });
});

app.get('/sobre', (req, res) => {
    res.render('sobre')
  })
  
app.get('/cadastro', (req, res) => {
  res.render('cadastro', {livro:{}});
})

app.get('/edicao', (req, res) => {
  pool.query('SELECT livros.id, livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
    if(erro){
      res.status(200).send(erro)
    }
    res.render('edicao', {lista:listagem});
  });
})

app.get('/edicao/:id', (req, res) => {
  pool.query('SELECT livros.id, livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id WHERE livros.id=?', [req.params.id], function(erro, resultado) {
    if(erro){
      res.status(200).send(erro)
    }
    console.log(resultado);
    res.render('cadastro', {livro:resultado[0]});
    

  });
})

app.post('/edicao/:id', (req, res) => {
  pool.query('UPDATE livros SET titulo=?, autor=?, id_categoria=(SELECT id FROM categorias WHERE nome =?), resumo=? WHERE id=?', [req.body.titulo, req.body.autor, req.body.categoria, req.body.resumo, req.params.id], 

  function(erro) {
    if(erro){
      res.status(200).send(erro)
    }
 
    res.redirect('/index');
     
  });
})

app.post('/cadastro', (req, res) => {
  console.log(req.body)
  pool.query('INSERT INTO livros(titulo, autor, id_categoria, resumo) VALUES (?,?, (SELECT id FROM categorias WHERE nome =?),?)', [req.body.titulo, req.body.autor, req.body.categoria, req.body.resumo,], function(erro) {
    if(erro){
      res.status(200).send(erro)
    }
    res.redirect('/index');
  });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})