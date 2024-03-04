const { MongoClient } = require('mongodb');

class Documento {
    constructor(titulo, autor, descricao) {
        this.titulo = titulo;
        this.autor = autor;
        this.descricao = descricao;
    }
}


module.exports = Documento;