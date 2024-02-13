
const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
const mysql = require('mysql');

/* criar conexão com o bando de dados  */
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'bd', 
    user            : process.env.MARIADB_USER,
    password        : process.env.MARIADB_PASSWORD,
    database        : process.env.MARIADB_DATABASE,
});
module.exports = pool;

/* identificar dados passados na URL */
app.use(bodyParser.urlencoded({ extended: false }))

/* imprimir no console data, hora e rota de cada solicitação */
const solicitacao = function (req, res, next) {
  req.solicitacao = new Date().toISOString();
  console.log(`${req.solicitacao}: ${req.method} ${req.url}`);
  next();
}
app.use(solicitacao);

/* padronizar a pasta public como base para acessar imagens e outros dados */
app.use(express.static('public'));

/* usar arquivos ejs como renderização */
app.set('view engine', 'ejs');


app.get('/index', (req, res) => {
  pool.query('SELECT livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
    if(erro){
      res.status(200).send(erro)
    }
    res.render('lista', {lista:listagem});
  });
});

/* rotas para páginas estáticas */
app.get('/sobre', (req, res) => {
    res.render('sobre')
  })
  
app.get('/cadastro', (req, res) => {
  res.render('cadastro', {livro:{}});
})

/* rota para pagina que mostra a lista como os ícones que vão permitir editar */
app.get('/edicao', (req, res) => {
  pool.query('SELECT livros.id, livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
    if(erro){
      res.status(200).send(erro)
    }
    res.render('edicao', {lista:listagem});
  });
})

/* rota para a pagina de cadastro com os dados puxados do item escolhido */
app.get('/edicao/:id', (req, res) => {
  pool.query('SELECT livros.id, livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id WHERE livros.id=?', [req.params.id], function(erro, resultado) {
    if(erro){
      res.status(200).send(erro)
    }
    console.log(resultado);
    res.render('cadastro', {livro:resultado[0]});    
  });
})

/* rota para atualizar os dados do item escolhido */
app.post('/edicao/:id', (req, res) => {
  pool.query('UPDATE livros SET titulo=?, autor=?, id_categoria=(SELECT id FROM categorias WHERE nome =?), resumo=? WHERE id=?', [req.body.titulo, req.body.autor, req.body.categoria, req.body.resumo, req.params.id], 

  function(erro) {
    if(erro){
      res.status(200).send(erro)
    } 
    res.redirect('/index');     
  });
})

/* rota para pagina que mostra a lista como os ícones que vão permitir exclui */
app.get('/exclusao', (req, res) => {
  pool.query('SELECT livros.id, livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
    if(erro){
      res.status(200).send(erro)
    }
    res.render('exclusao', {lista:listagem});
  });
})

/* rota para atualizar os dados do item escolhido */
app.get('/exclusao/:id', (req, res) => {
  pool.query('DELETE FROM livros WHERE id = ?', [req.params.id], 
  function(erro) {
    if(erro){
      res.status(200).send(erro)
    }
    res.redirect('/index');     
  });
})


/* rota para a cadastrar novos itens */
app.post('/cadastro', (req, res) => {
  console.log(req.body)
  pool.query('INSERT INTO livros(titulo, autor, id_categoria, resumo) VALUES (?,?, (SELECT id FROM categorias WHERE nome =?),?)', [req.body.titulo, req.body.autor, req.body.categoria, req.body.resumo,], function(erro) {
    if(erro){
      res.status(200).send(erro)
    }
    res.redirect('/index');
  });
})

/* imprime no console a porta e atesta que está conectado */
app.listen(port, () => {
  console.log(`App usando a porta ${port}`)
})


/* middleware para lidar com rotas não definidas */
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});


/* middleware para lidar com erros  */
app.use((req, res) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado');
});