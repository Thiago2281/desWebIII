const Usuario = require("./Usuario")
const bcrypt = require('bcrypt')
const { Sequelize, DataTypes, Model } = require('sequelize');


class UsuariosSequelizeDao {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.Usuario = Usuario.init({
            nome: DataTypes.TEXT,
            senha: DataTypes.TEXT,
            papel: DataTypes.TEXT,
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            createdAt: {
                default: 'now()',
                type: DataTypes.DATE
            },
            updatedAt: {
                default: 'now()',
                type: DataTypes.DATE
            }
        }, { sequelize });

        (async () => {
            await this.Usuario.sync();
            console.log('Tabela criada com sucesso!');
        })();
    }
    listar() {
        return this.Usuario.findAll();
    }

    inserir(usuario) {
        this.validar(usuario);
        usuario.senha = bcrypt.hashSync(usuario.senha, 10);
        
        return usuario.save();
    }

    async alterar(id, usuario) {
        this.validar(usuario);
        let obj = {...usuario.dataValues};
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        });
        console.log("alterar", obj);
        Usuario.update(obj, { where: { id: id } });
        return obj
    }

    apagar(id) {
        return Usuario.destroy({ where: { id: id } });
        
    }

    validar(usuario) {
        if (!usuario.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!usuario.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
    }

    async autenticar(nome, senha) {
        let usuario = await this.Usuario.findOne({where: {nome}});
        if (bcrypt.compareSync(senha, usuario.senha)) {
            return usuario;
        } else {
            return null; 
        }   
        // return usuario;
    }
}

module.exports = UsuariosSequelizeDao;