const { MongoClient } = require('mongodb');
class Livro { 
    constructor(nome, autor, preco, id) {
        this.nome = nome;
        this.autor = autor;
        this.preco = preco;
        this.id = id
    }
}

module.exports = Livro;