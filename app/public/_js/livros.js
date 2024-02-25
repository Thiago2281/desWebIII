async function deletar(id) {
    const answer = confirm("Deseja realmente excluir este registro id " + id + "?");
    if (answer) {
        let resposta = await fetch ('exclusao/' + id, {
        method: 'delete',
        });
        window.location.reload()
    };
}