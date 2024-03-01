const jwt = require('jsonwebtoken');

class AuthController {
    constructor(usuariosDao) {
        this.usuariosDao = usuariosDao;
        this.SEGREDO_JWT = process.env.SEGREDO_JWT;
    }

    index(req, res) {
        res.render('login');
    }

    async logar(req, res) {
        let usuario = await this.usuariosDao.autenticar(req.body.nome, req.body.senha);
        if (usuario) {
            console.log({usuario});
            let token = jwt.sign({
                ...usuario.toJSON()
            }, this.SEGREDO_JWT);
            res.cookie('jwt',token);
            res.json({
                token,
                mensagem: 'Usuário logado com sucesso!'
            });
        }
        else {
            res.json({
                mensagem: 'Usuário ou senha inválidos!'
            }, 401);
        }
    }

    // middleware
    autorizar(req, res, proximoControlador, papeisPermitidos) {
        console.log('autorizando', req.headers);
        try {
            let token = req.headers.authorization.split(' ')[1];
            let usuario = jwt.verify(token, this.SEGREDO_JWT);
            req.usuario = usuario;
            console.log({usuario}, papeisPermitidos);

            if (papeisPermitidos.includes(usuario.papel) || papeisPermitidos.length == 0) {
                proximoControlador();
            }
            else {
                utils.renderizarJSON(res, {
                    mensagem: 'Não autorizado!'
                }, 403);
            }

        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: 'Não autenticado!',
                error: e.message
            }, 401);
        }

    }
}

module.exports = AuthController;