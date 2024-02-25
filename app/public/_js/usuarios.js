async function formEditar(id) {
    const answer = confirm("Deseja realmente alterar este registro id " + id + "?");
    if (answer) {
        let senha = document.querySelector('[name=senha]').value;
        let papel = document.querySelector('[name=papel]').value;
        let nome = document.querySelector('[name=nome]').value;

        let dados = new URLSearchParams({nome, senha, papel, id});

        await fetch (id, {
            method: 'PUT',
            body: dados
        });
        
    };
}

function deletar(id) {
    const answer = confirm("Deseja realmente apagar este registro id " + id + "?");
    if (answer) {
        fetch (id, {
            method: 'DELETE'
        });
        
    };
}