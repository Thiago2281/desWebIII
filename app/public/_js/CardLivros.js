export default {
    props: {
        livros: Array,
    },
    setup(props, {emit}) {
        const nome = Vue.ref(props.nome2)        
        const autor = Vue.ref('')
        const preco = Vue.ref('')
        const livros = Vue.ref(props.livros || [])
        function inserir() {
          livros.value.push({
            nome: nome.value,   
            autor: autor.value,
            preco: preco.value
          });
        }
        function selecionar(livro) {
            emit('selecionado', livro);
        }
        return {
          nome,
          livros,
          autor,
          preco,
          inserir,
          selecionar
        }
    },
    template: `
    <div class="row justify-content-center my-5">
        <div class="col" v-for="livro of livros" :style="{ color: livro.preco > 50 ? 'red' : 'green' }">
            <article class="card text-center">
                    <p>{{livro.nome}}</p>
                    <button @click="selecionar(livro);">Selecionar</button>
            </article>
        </div>
    </div>
    `
}