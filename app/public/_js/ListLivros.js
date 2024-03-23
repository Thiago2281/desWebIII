export default {
    props: {
        livros: Array
    },
    setup(props, {emit}) {
        const livros = Vue.ref(props.livros)
        function selecionar(livro) {
            this.$router.push('/detalhes/' + livro.id);
        }
        return {
            livros,
            selecionar
        }
    },
    template: `
    <h2>Lista</h2>
    <div v-for="livro of livros">
        {{livro.nome}}
        <button @click="selecionar(livro);">Selecionar</button>
    </div>
    `
}