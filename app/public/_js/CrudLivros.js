export default {
    props: {
        registros: Array,
        nome2: String
    },
    setup(props, {emit}) {
        const nome = Vue.ref(props.nome2)        
        const autor = Vue.ref('')
        const preco = Vue.ref('')
        const registros = Vue.ref(props.registros || [])
        function inserir() {
          registros.value.push({
            nome: nome.value,   
            autor: autor.value,
            preco: preco.value
          });
        }
        function selecionar(registro) {
            emit('selecionado', registro);
        }
        return {
          nome,
          registros,
          autor,
          preco,
          inserir,
          selecionar
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
                    <tr v-for="registro of registros" :style="{ color: registro.preco > 50 ? 'red' : 'green' }">
                        <td>{{registro.nome}}</td>
                        <td>{{registro.autor}}</td>
                        <td>{{registro.preco}}</td>
                        <button @click="selecionar(registro.nome);">Selecionar</button>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
}