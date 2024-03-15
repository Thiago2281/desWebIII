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
        <div class="col" v-for="registro of registros" :style="{ color: registro.preco > 50 ? 'red' : 'green' }">
            <article class="card text-center">
                    <p>{{registro.nome}}</p>
                    <button @click="selecionar(registro);">Selecionar</button>
            </article>
        </div>
    </div>
    `
}