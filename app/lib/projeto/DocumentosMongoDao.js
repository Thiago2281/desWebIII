const Documento = require('./Documento');
const bcrypt = require('bcrypt')

class DocumentosMongoDao {
    constructor(client) {
        this.client = client;
        this.banco = 'biblioteca';
        this.colecao = 'documentos';
    }
    async listar() {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
        const documentos = await collection.find();
        return await documentos.toArray()
    }

    inserir(documento) {
        this.validar(documento);
        return new Promise(async (resolve, reject) => {
            let sql = `{titulo: '?', autor: '?', descricao: '?'}`;
            await documentos.insertOne(sql,[documento.titulo, documento.autor, documento.descricao],
                function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });
    }

    alterar(id, documento) {
        this.validar(documento);
        this.documentos[id] = documento;
    }

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = `{_id: '?'}`;
            this.pool.query(sql, [id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(id);
            });
        });
    }

    validar(documento) {
        console.log(2, documento);
        if (!documento.titulo) {
            throw new Error('mensagem_titulo_em_branco');
        }
        if (!documento.autor) {
            throw new Error('mensagem_autor_em_branco');
        }
        if (!documento.descricao) {
            throw new Error('mensagem_descricao_invalida');
        }
    }
}

module.exports = DocumentosMongoDao;