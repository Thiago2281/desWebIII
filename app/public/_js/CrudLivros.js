export default {
    props: {
        livros: Array,
    },
    setup(props, {emit}) {       
        const autor = Vue.ref('')
        const preco = Vue.ref('')
        const nome = Vue.ref('')
        const id = Vue.ref('')
        const livros = Vue.ref(props.livros || [])
        function inserir() {
        //   livros.value.push({
        //     nome: nome.value,   
        //     autor: autor.value,
        //     preco: preco.value,
        //     id: livros.value.length + 1
        //   });
        (async () => {
            let id = await adicionar({nome: nome.value, autor: autor.value, preco: preco.value})
            alert('Registro #' + id + ' adicionado!')
        })()
        }
        function selecionar(livro) {
            // emit('selecionado', livro);
            this.$router.push('/detalhes/' + livro.id);
        }
        async function apagar(id) {
            if (confirm('Quer apagar o #' + id + '?')) {
                console.log('apagado', await deletar(id));
            }
        }
        return {
          livros,
          nome,
          autor,
          preco,
          id,
          inserir,
          selecionar, 
          apagar
        }
    },
    template: `
    <div class="row justify-content-center my-5">
        <div class="col">
            <form method="POST" @submit.prevent="inserir" class="form">
                <label for="titulo" class="form-label">Título:</label>
                <div class="input-group mb-4">
                    <span class="input-group-text">
                    <i class="bi bi-envelope-fill text-secondary"></i>
                    </span>
                    <input type="text" name="titulo" v-model="nome" id="titulo" class="form-control"
                    placeholder="Título do livro" required />
                </div>
                <label for="autor" class="form-label">Autor:</label>
                <div class="mb-4 input-group">
                    <span class="input-group-text">
                    <i class="bi bi-person-fill text-secondary"></i>
                    </span>
                    <input type="text" name="autor" v-model="autor" id="autor" class="form-control"
                    placeholder="Exemplo: Mario Quintana" required />
                </div>                      
                <label for="preco" class="form-label">Preco:</label>
                <div class="mb-4 input-group">
                    <span class="input-group-text">
                    <i class="bi bi-person-fill text-secondary"></i>
                    </span>
                    <input type="number" name="preco" v-model="preco" id="preco" step="0.01" class="form-control" required />
                </div>
                <div class="mb-4 text-center">
                    <button type="submit" class="btn btn-secondary">Enviar</button>
                </div>
            </form>
        </div>
        <div class="col">
            <table>
                <tr>
                    <th class="px-3">Nome</th>
                    <th class="px-3">Autor</th>
                    <th class="px-3">Preco</th>
                </tr>
                <tbody>
                    <tr v-for="livro of livros" :style="{ color: livro.preco > 50 ? 'red' : 'green' }">
                        <td>{{livro.nome}}</td>
                        <td>{{livro.autor}}</td>
                        <td>{{livro.preco}}</td>
                        <button @click="selecionar(livro);">Selecionar</button>
                        <button onclick="editar({{livro.id}});">Editar</button>
                        <button @click="apagar(livro.id);">Apagar</button>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
}