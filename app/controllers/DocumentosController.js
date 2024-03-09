const Documento = require('./../lib/projeto/Documento');

const express = require('express');

class DocumentosController {
    constructor(documentosDao) {
        this.documentosDao = documentosDao;
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
        return rotas;
    }

    index(req, res) {
        res.render('index');
    }
        
    async listar(req, res) {
        let documentos = await this.documentosDao.listar();
        let dados = documentos.map(documento => {
            return {
                ...documento,

            };
        })

        res.json(dados);
    }
    
    async inserir(req, res, next) {
        try {
            let documento = await this.getDocumentoDaRequisicao(req);
            documento.id = await this.documentosDao.inserir(documento);
            res.json({
                documento: {
                    ...documento,
                },
                mensagem: 'mensagem_documento_cadastrado'
            });
        } catch (e) {
            console.log("erro inserir", e)
            /*res.status(400).json({
                mensagem: e.message
            });*/
            next(e);
        }
    }

    async alterar(req, res) {
        let documento = await this.getDocumentoDaRequisicao(req);
        let id = req.params.id;
        try {
            this.documentosDao.alterar(id, documento);
            utils.renderizarJSON(res, {
                mensagem: 'mensagem_documento_alterado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }
    
    apagar(req, res) {
        let id = req.params.id;
        this.documentosDao.apagar(id);
        res.json({
            mensagem: 'mensagem_documento_apagado',
            id: id
        });
    }

    async getDocumentoDaRequisicao(req) {     
        var corpo = new Documento(req.body.titulo, req.body.autor, req.body.descricao);      
        return corpo;
    }

}

module.exports = DocumentosController;