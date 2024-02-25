const { Sequelize, DataTypes, Model } = require('sequelize');

class Usuario extends Model {
    /*constructor(nome, nota1, nota2, senha, papel, id) {
        this.nome = nome;
        this.nota1 = nota1;
        this.nota2 = nota2;
        this.senha = senha;
        this.papel = papel;
        this.id = id
    }
    media() {
        let media = (this.nota1 + this.nota2) / 2;
        return media;
    }

    estaAprovado() {
        return this.media() > 6;
    }*/

}




module.exports = Usuario;