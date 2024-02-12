const LivrosMysqlDao = require('./lib/projeto/LivrosMysqlDao');
const LivrosController = require('./controllers/LivrosControllers');
const express = require('express')
const app = express()
const port = 3000

const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'bd', 
    user            : process.env.MARIADB_USER,
    password        : process.env.MARIADB_PASSWORD,
    database        : process.env.MARIADB_DATABASE,
});
module.exports = pool;

let livrosDao = new LivrosMysqlDao(pool);
/* let livrosController = new LivrosController(livrosDao);*/

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  pool.query('SELECT * FROM livros ORDER BY titulo, autor', [], function(erro, listagem) {
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
  res.render('cadastro')
})

app.post('/cadastro', (req, res) => {
  console.log(req.body)
})


app.get('/index', (req, res) => {
  res.render('index')
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})