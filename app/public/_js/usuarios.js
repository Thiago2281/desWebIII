async function formEditar(id) {
    const answer = confirm("Deseja realmente alterar este registro id " + id + "?");
    if (answer) {
        let senha = document.querySelector('[name=senha]').value;
        let papel = document.querySelector('[name=papel]').value;
        let nome = document.querySelector('[name=nome]').value;

        let dados = new URLSearchParams({nome, senha, papel, id});

        let resposta = await fetch (id, {
            method: 'PUT',
            body: dados
        });
        if (resposta.status==200){
            window.location='/usuarios/edicao'
        }
        else{
            let divusuarios = document.querySelector('#erro');
            divusuarios.innerText = 'Erro ao alterar...'
        }
    };
}

async function deletar(id) {
    const answer = confirm("Deseja realmente apagar este registro id " + id + "?");
    if (answer) {
        let resposta = await fetch (id, {
            method: 'DELETE'
        });
        if (resposta.status==200){
            window.location='/usuarios/exclusao'
        }
        
    };
}