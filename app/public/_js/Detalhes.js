export default {
    props: {
        livros: Array
    },
    setup(props, {emit}) {
        const route = VueRouter.useRoute();
        let id = route.params.id;
        const livro = props.livros.value.filter(e => { return e.id == id; })[0];
        return {
            livro
        }
    },
    template: `
    <h2>Detalhes</h2>
    <div class="row justify-content-center my-5">
        <div class="col" :style="{ color: livro.preco > 50 ? 'red' : 'green' }">
            <article class="card text-center">
                <p>ID: {{livro.id}}</p>
                <p>Titulo: {{livro.nome}}</p>
                <p>Autor: {{livro.autor}}</p>
                <p>Preco: {{livro.preco}}</p>
            </article>
        </div>
    </div>
    `
}