const Livro = require("./Livro")
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;

class LivrosMongoDao {
    constructor(client) {
        this.client = client;
        this.banco = 'biblioteca';
        this.colecao = 'livros';
    }
    async listar() {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
        const livros = await collection.find({}).project({ _id: 0, id: '$_id', nome: 1, autor: 1, preco: 1 });
        return await livros.toArray()
    }
    async procurarPorId(id) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
        const livro = await collection.findOne({ _id: new ObjectId(id) });
        return livro;
    }

    async inserir(livro) {
        this.validar(livro);
        // livro.senha = bcrypt.hashSync(livro.senha, 10);

        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);

        return await collection.insertOne(livro);
    }

    async alterar(id, livro) {
        this.validar(livro);
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);

        return await collection.updateOne(
            { "_id": new ObjectId(id) }, { $set: livro }
        );
    }

    async apagar(id) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
        const livro = await collection.deleteOne({ _id: new ObjectId(id) });
        return livro;
    }

    validar(livro) {
        console.log(2, livro);
        if (!livro.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!livro.autor) {
            throw new Error('mensagem_autor_em_branco');
        }
        if (!livro.preco) {
            throw new Error('mensagem_preco_em_branco');
        }
    }

    async autenticar(nome, senha) {

        // await this.client.connect();
        // const database = this.client.db(this.banco);
        // const collection = database.collection(this.colecao);

        // const livro = await collection.findOne({nome});
        // if (bcrypt.compareSync(senha, livro.senha)) {
        //     let { id, nome, nota1, nota2, senha, papel } = livro;
        //     return new Livro(nome, nota1, nota2, senha, papel, id);
        // }
        // return null; 
    }
}

module.exports = LivrosMongoDao;