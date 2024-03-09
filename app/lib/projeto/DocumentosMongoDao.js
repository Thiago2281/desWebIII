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

    async inserir(documento) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
        this.validar(documento);
        let resultado = await collection.insertOne(documento);
        return resultado.insertedId;                       
    }

    alterar(id, documento) {
        this.validar(documento);
        this.documentos[id] = documento;
    }

    async apagar(id) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
        const ObjectId = require('mongodb').ObjectId;
        let resultado = await collection.deleteOne({_id: new ObjectId(id)});
        if (resultado.deletedCount === 1) {
            console.log("Um documento deletado com sucesso.");  
          } else {     
            console.log("Nenhum documento com esse _id. 0 documentos deletados.");    
          }
        return resultado
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