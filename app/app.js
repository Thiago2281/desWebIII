
const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
const mysql = require('mysql');
const UsuariosSequelizeDao = require('./lib/projeto/UsuariosSequelizeDao');
const UsuariosController = require('./controllers/UsuariosController');
const DocumentosController = require('./controllers/DocumentosController');
const AuthController = require('./controllers/AuthController');
const DocumentosMongoDao = require('./lib/projeto/DocumentosMongoDao');
const LivrosController = require('./controllers/LivrosController');
const LivrosMongoDao = require('./lib/projeto/LivrosMongoDao');
/* criar conexão com o bando de dados  */
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'bd', 
    user            : 'root',
    password        : process.env.MARIADB_PASSWORD,
    database        : process.env.MARIADB_DATABASE,
});
module.exports = pool;

const { MongoClient } = require("mongodb");

const uri = `mongodb://${process.env.MONGODB_INITDB_ROOT_USERNAME}:${process.env.MONGODB_INITDB_ROOT_PASSWORD}@mongo`;
const mongoClient = new MongoClient(uri);
const webpush = require('web-push');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('verificação jwt', jwt_payload);
    return done(null, jwt_payload);
}));

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.MARIADB_DATABASE,
    'root',
    process.env.MARIADB_PASSWORD,
    {
        host: 'bd',
        dialect: 'mysql'
    }
);

let usuariosDao = new UsuariosSequelizeDao(sequelize);
let usuariosController = new UsuariosController(usuariosDao);
let authController = new AuthController(usuariosDao);
let documentosDao = new DocumentosMongoDao(mongoClient);
let documentosController = new DocumentosController(documentosDao);
let livrosDao = new LivrosMongoDao(mongoClient);
let livrosController = new LivrosController(livrosDao);

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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Defina as chaves VAPID - você pode gerar essas chaves usando o web-push
webpush.setVapidDetails(
  'mailto:seuemail@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

let subscriptions = [];
// Rota para salvar as subscrições
app.post('/subscribe', (req, res) => {
  subscription = req.body;
  subscriptions.push(subscription);
  console.log({ subscriptions });
  res.status(201).json({});
});

app.get('/push', (req, res) => {
  res.render('push');
})

// Rota para enviar notificações
app.get('/notificar', (req, res) => {
  const payload = JSON.stringify({ title: req.query.msg });
  console.log('notificando', subscriptions);
  for (let subscription of subscriptions) {
      webpush.sendNotification(subscription, payload)
          .catch(error => console.error('Erro ao notificar:', error));
      console.log('notificando', subscription);
  }
  res.send('ok');
});

/* usar arquivos ejs como renderização */
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('indexVue')
})

app.use('/livros', livrosController.getRouter());

app.get([
  '/',
  '/index'
  ], (req, res) => {
      livrosController.index(req, res)
});

app.get('/lista', async (req, res) => {
  let livros = await livrosDao.listar();
  res.render('lista', {livros});
  if (req.headers.accept == 'application/json') { 
      res.json(livros);
  }
  else {
      res.render('lista', {livros});
  }
});

app.get('/index', (req, res) => {
  pool.query('SELECT livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
    if(erro){
      res.status(200).send(erro)
    }
    console.log(req.headers)
    if (req.headers.accept == 'application/json') {
      res.json(listagem)
    } else {
      res.render('lista', {livros: listagem});
    }
  });
});

/* rotas para páginas estáticas */
app.get('/sobre', (req, res) => {
    res.render('sobre')
  })

app.get('/teste', (req, res) => {
    res.render('teste')
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
    res.render('edicao', {livros: listagem});
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
    res.render('exclusao', {livros: listagem});
  });
})

/* rota para excluir os dados do item escolhido */
app.delete('/exclusao/:id', (req, res) => {
  pool.query('DELETE FROM livros WHERE id = ?', [req.params.id], 
  function(erro) {
    if(erro){
      res.status(200).send(erro)
    }else{
      res.status(200).send('OK');
    }   
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


app.use('/usuarios', usuariosController.getRouter());

app.use('/documentos', documentosController.getRouter());

app.get('/perfil', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
  res.json({'usuario': req.user});
});

app.get('/login', (req, res) => {
  authController.index(req, res);
});

app.post('/login', (req, res) => {
  authController.logar(req, res);
});

app.get('*', (req, res, next) => {
  res.status(404).send('Nao encontrado')
});

app.use(function (err, req, res, next) {
  console.error('registrando erro: ', err.stack)
  res.status(500).send('Erro no servidor: ' + err.message);
});

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