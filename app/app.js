
const express    = require('express')
const app        = express()
const port       = 3000
var   bodyParser = require('body-parser')
const mysql      = require('mysql');

  /* criar conexão com o bando de dados  */
const pool  = mysql.createPool({
    connectionLimit: 10,
    host           : 'bd',
    user           : 'root',
    password       : 'senha_root',
    database       : process.env.MARIADB_DATABASE,
});
module.exports = pool;

  /* identificar dados passados na URL */
app.use(bodyParser.urlencoded({ extended: false }))

  /* padronizar a pasta public como base para acessar imagens e outros dados */
app.use(express.static('public'));

  /* usar arquivos ejs como renderização */
app.set('view engine', 'ejs');


  // app.get('/index', (req, res) => {
  //   pool.query('SELECT livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
  //     if(erro){
  //       res.status(200).send(erro)
  //     }
  //     res.render('lista', {lista:listagem});
  //   });
  // });

  // /* rotas para páginas estáticas */
  // app.get('/sobre', (req, res) => {
  //     res.render('sobre')
  //   })
  
app.get('/cadastro', (req, res) => {
  res.render('cadastro');  //{livro:{}});
})

  // /* rota para pagina que mostra a lista como os ícones que vão permitir editar */
  // app.get('/edicao', (req, res) => {
  //   pool.query('SELECT livros.id, livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
  //     if(erro){
  //       res.status(200).send(erro)
  //     }
  //     res.render('edicao', {lista:listagem});
  //   });
  // })

  // /* rota para a pagina de cadastro com os dados puxados do item escolhido */
  // app.get('/edicao/:id', (req, res) => {
  //   pool.query('SELECT livros.id, livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id WHERE livros.id=?', [req.params.id], function(erro, resultado) {
  //     if(erro){
  //       res.status(200).send(erro)
  //     }
  //     console.log(resultado);
  //     res.render('cadastro', {livro:resultado[0]});    
  //   });
  // })

  // /* rota para atualizar os dados do item escolhido */
  // app.post('/edicao/:id', (req, res) => {
  //   pool.query('UPDATE livros SET titulo=?, autor=?, id_categoria=(SELECT id FROM categorias WHERE nome =?), resumo=? WHERE id=?', [req.body.titulo, req.body.autor, req.body.categoria, req.body.resumo, req.params.id], 

  //   function(erro) {
  //     if(erro){
  //       res.status(200).send(erro)
  //     } 
  //     res.redirect('/index');     
  //   });
  // })

  // /* rota para pagina que mostra a lista como os ícones que vão permitir exclui */
  // app.get('/exclusao', (req, res) => {
  //   pool.query('SELECT livros.id, livros.titulo, livros.autor, categorias.nome AS categoria, livros.resumo FROM livros JOIN categorias ON livros.id_categoria=categorias.id ORDER BY titulo, autor', [], function(erro, listagem) {
  //     if(erro){
  //       res.status(200).send(erro)
  //     }
  //     res.render('exclusao', {lista:listagem});
  //   });
  // })

  // /* rota para excluir os dados do item escolhido */
  // app.delete('/exclusao/:id', (req, res) => {
  //   pool.query('DELETE FROM livros WHERE id = ?', [req.params.id], 
  //   function(erro) {
  //     if(erro){
  //       res.status(200).send(erro)
  //     }else{
  //       res.status(200).send('OK');
  //     }   
  //   });
  // })


  // /* rota para a cadastrar novos itens */
app.post('/cadastro', (req, res) => {
 console.log(req.body);
 var situacao             = 'DSP101';
 var contaEstoque         = '115610100';
 var contaApagar          = '213110400';
 var tipo                 = req.body.tipo;
 var nf                   = req.body.numero;
 var dataNf               = new Date (req.body.dataNF);
 let yyyy                 = dataNf.getFullYear();
 let mm                   = dataNf.getMonth() + 1;           // Months start at 0!
 let dd                   = dataNf.getDate();
 if  (dd < 10) dd         = '0' + dd;
 if  (mm < 10) mm         = '0' + mm;
 var formatteddataNf      = dd + '/' + mm + '/' + yyyy;
 var dataAt               = new Date (req.body.dataAteste);
 var aaaa                 = dataAt.getFullYear();
 var me                   = dataAt.getMonth() + 1;           // Months start at 0!
 var dia                  = dataAt.getDate();
 if  (dia < 10) dia       = '0' + dia;
 if  (me < 10) me         = '0' + me;
 var formatteddataAt      = dia + '/' + me + '/' + aaaa;
 var dataVenc             = new Date (req.body.dataVenc);
 var aaaa                 = dataVenc.getFullYear();
 var me                   = dataVenc.getMonth() + 1;         // Months start at 0!
 var dia                  = dataVenc.getDate();
 if  (dia < 10) dia       = '0' + dia;
 if  (me < 10) me         = '0' + me;
 var formatteddataVenc    = dia + '/' + me + '/' + aaaa;
 var subitem              = req.body.subitem;
 if  (subitem<10) subitem = '0' + subitem;

 var opcao         = req.body.opcao;
 var valorBruto    = req.body.valorBruto;
 var cnpj          = req.body.cnpj;
 var anoEmpenho    = req.body.anoEmpenho;
 var numeroEmpenho = req.body.numeroEmpenho;
 var empenho       = anoEmpenho + 'NE' + '000' + numeroEmpenho;

 if (req.body.tipo == 'SERVICO') {
  var situacao     = 'DSP001';
  var contaEstoque = '332310200';
  var ug           = '160046';
  var cc           = 'F020404S';
  let dataHoje     = new Date();
  var mes1         = dataHoje.getMonth() + 1;
  if (mes1<10){
    var mes = '0' + mes1;
  }
  var ano   = dataHoje.getFullYear();
  var siorg = '30320'
  
  pool.query('select descricao from servico where id=?', [req.body.subitem], function (erro, resultado) {
     if (erro) {
       res.status(200).send(erro);
     }

     var descricao = 'APROPRIACAO DE '+tipo+' - '+ [resultado[0].descricao] +'\nNF DATA/NR: '+nf+' '+formatteddataNf+'\nEMPRESA '+opcao;
 console.log(descricao);
     res.render('lista', {siDesc:resultado[0], cc: cc, ug: ug, situacao:situacao, contaEstoque:contaEstoque, contaApagar:contaApagar, tipo:tipo, nf:nf, dataNoF: formatteddataNf, dataAt:dataAt, opcao:opcao, descricao:descricao, valorBruto:valorBruto, cnpj:cnpj, empenho:empenho, subitem:subitem});
   });
 }

 if (req.body.tipo == 'MATERIAL PERMANENTE') {
  var situacao     = 'DSP201';
  var contaEstoque = '123110801';
  pool.query('select descricao from permanente where id=?', [req.body.subitem], function (erro, resultado) {
    if (erro) {
      res.status(200).send(erro);
    }

    var descricao = 'APROPRIACAO DE '+tipo+' - '+ [resultado[0].descricao] +'\nNF DATA/NR: '+nf+' '+formatteddataNf+'\nEMPRESA '+opcao;
console.log(descricao);
    res.render('lista', {siDesc:resultado[0], cc: cc, ug: ug, situacao:situacao, contaEstoque:contaEstoque, contaApagar:contaApagar, tipo:tipo, nf:nf, dataNoF: formatteddataNf, dataAt:dataAt, opcao:opcao, descricao:descricao, valorBruto:valorBruto, cnpj:cnpj, empenho:empenho,subitem:subitem});
  });
 }
 
 if (req.body.tipo == 'MATERIAL DE CONSUMO') {
  pool.query('select descricao from consumo where id=?', [req.body.subitem], function (erro, resultado) {
    if (erro) {
      res.status(200).send(erro);
    }

    var descricao = 'APROPRIACAO DE '+tipo+' - '+ [resultado[0].descricao] +'\nNF DATA/NR: '+nf+' '+formatteddataNf+'\nEMPRESA '+opcao;
console.log(descricao);
    res.render('lista', {siDesc:resultado[0], cc: cc, ug: ug, situacao:situacao, contaEstoque:contaEstoque, contaApagar:contaApagar, tipo:tipo, nf:nf, dataNoF: formatteddataNf, dataAt:dataAt, opcao:opcao, descricao:descricao, valorBruto:valorBruto, cnpj:cnpj, empenho:empenho,subitem:subitem});
  });
 }

 if (req.body.tipo == 'MATERIAL DE PNAE') {
  var contaEstoque = '115810301';

    var descricao = 'APROPRIACAO DE '+tipo+' - MAT DE ASSISTENCIA SOCIAL'+'\nNF DATA/NR: '+nf+' '+formatteddataNf+'\nEMPRESA '+opcao;
console.log(descricao);
    res.render('lista', {cc: cc, ug: ug, situacao:situacao, contaEstoque:contaEstoque, contaApagar:contaApagar, tipo:tipo, nf:nf, dataNoF: formatteddataNf, dataAt:dataAt, opcao:opcao, descricao:descricao, valorBruto:valorBruto, cnpj:cnpj, empenho:empenho, subitem:subitem});
  };
 
 if (req.body.tipo == 'MATERIAL DE COOPERATIVA (PNAE)') {
  var contaEstoque = '115810301';
  var descricao    = 'APROPRIACAO DE '+tipo+' - MAT DE ASSISTENCIA SOCIAL' + '\nNF DATA/NR: '+nf+' '+formatteddataNf+'\nEMPRESA '+opcao;
  console.log(descricao);
      res.render('lista', {cc: cc, ug: ug, situacao:situacao, contaEstoque:contaEstoque, contaApagar:contaApagar, tipo:tipo, nf:nf, dataNoF: formatteddataNf, dataAt:dataAt, opcao:opcao, descricao:descricao, valorBruto:valorBruto, cnpj:cnpj, empenho:empenho, subitem:subitem});

 }

 if (req.body.tipo == 'MATERIAL DE COOPERATIVA') {
  pool.query('select descricao from consumo where id=?', [req.body.subitem], function (erro, resultado) {
    if (erro) {
      res.status(200).send(erro);
    }

    var descricao = 'APROPRIACAO DE '+tipo+' - '+ [resultado[0].descricao] +'\nNF DATA/NR: '+nf+' '+formatteddataNf+'\nEMPRESA '+opcao;
console.log(descricao);
    res.render('lista', {siDesc:resultado[0], cc: cc, ug: ug, situacao:situacao, contaEstoque:contaEstoque, contaApagar:contaApagar, tipo:tipo, nf:nf, dataNoF: formatteddataNf, dataAt:dataAt, opcao:opcao, descricao:descricao, valorBruto:valorBruto, cnpj:cnpj, empenho:empenho,subitem:subitem});
  });
  }


})



  //   pool.query('INSERT INTO livros(titulo, autor, id_categoria, resumo) VALUES (?,?, (SELECT id FROM categorias WHERE nome =?),?)', [req.body.titulo, req.body.autor, req.body.categoria, req.body.resumo,], function(erro) {
  //     if(erro){
  //       res.status(200).send(erro)
  //     }
  //     res.redirect('/index');
  //   });
  // })

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
  res.status(500).send('Algo deu errado');})
