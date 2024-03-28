async function listar() {
    let resposta = await fetch('/livros');
    let livros = await resposta.json();
    return livros;
}

async function adicionar(livro) {
    let dados = new URLSearchParams(livro);
    console.log(dados);
    let resposta = await fetch('/livros', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },   
        body: dados
    });
    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}

async function alterar(livro) {
    let dados = new URLSearchParams(livro);
    console.log(dados);
    let resposta = await fetch('/livros/'+livro.id, {
        method: 'put',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },   
        body: dados
    });
    if (resposta.status == 200) {
        return await resposta.json();
    }
    else {
        throw new Error(await resposta.text()); 
    }
}


async function deletar(id) {
    let resposta = await fetch('/livros/' + id, {
        method: 'delete',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });
    let respostaJson = await resposta.json();
}