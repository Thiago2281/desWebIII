const Livro = require('./../lib/projeto/Livro');
const express = require('express');

class LivrosController {
    constructor(livrosDao) {
        this.livrosDao = livrosDao;
    }

    getRouter() {
        const rotas = express.Router();
        rotas.get('/', (req, res) => {
            this.listar(req, res)
        });
        rotas.put('/:id', (req, res) => {
            this.alterar(req, res);
        })
        rotas.delete('/:id', (req, res) => {
            this.apagar(req, res);
        })
        rotas.post('/', (req, res, next) => {
            this.inserir(req, res, next);
        })
        rotas.get('/:id', (req, res) => {
            this.procurarPorId(req, res);
        })
        return rotas;
    }

    index(req, res) {
        res.render('index');
    }

    async listar(req, res) {
        let livros = await this.livrosDao.listar();
        /**/
        // Alternativa com map()
        let dados = livros.map(livro => {
            return {
                ...livro,
                // media: livro.media(),
                // estaAprovado: livro.estaAprovado()
            };
        })
        /*/
        // Alternativa com for
        let dados = [];
        for (let livro of livros) {
            dados.push({
                ...livro,
                media: livro.media(),
                estaAprovado: livro.estaAprovado()
            });
        }
        /**/
        res.json(dados);
    }

    async procurarPorId(req, res) {
        let id = req.params.id;
        let livro = await this.livrosDao.procurarPorId(id);
        // let dados = livros.map(livro => {
        //     return {
        //         ...livro,
        //         media: livro.media(),
        //         estaAprovado: livro.estaAprovado()
        //     };
        // })
        res.json(livro);
    }
    
    async inserir(req, res, next) {
        console.log("inserir0")
        try {
            let livro = await this.getLivroDaRequisicao(req);
            console.log("inserir", livro)
            livro.id = await this.livrosDao.inserir(livro);
            res.json({
                livro: {
                    ...livro,
                    // media: livro.media(),
                    // estaAprovado: livro.estaAprovado()
                },
                mensagem: 'mensagem_livro_cadastrado'
            });
        } catch (e) {
            console.log("erro inserir", e)
            /*res.status(400).json({
                mensagem: e.message
            });*/
            next(e);
        }
        console.log("inserir2")
    }

    async alterar(req, res) {
        let livro = await this.getLivroDaRequisicao(req);
        let id = req.params.id;
        console.log(livro,id)
        try {
            this.livrosDao.alterar(id, livro);
            res.json({
                mensagem: 'mensagem_livro_alterado'
            });
        } catch (e) {
            res.status(400).json({
                mensagem: e.message
            });
        }
    }
    
    apagar(req, res) {
        let id = req.params.id;
        this.livrosDao.apagar(id);
        res.json({
            mensagem: 'mensagem_livro_apagado',
            id: id
        });
    }

    async getLivroDaRequisicao(req) {
        var corpo = new Livro(req.body.nome, req.body.autor, req.body.preco);      
        return corpo;
    }

}

module.exports = LivrosController;