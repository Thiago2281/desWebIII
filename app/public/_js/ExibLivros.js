export default {
    props: {
        livro: Object
    },
    template: `
    <div class="row justify-content-center my-5">
      <article class="card text-center">
        <p>{{livro.nome}}</p>
        <p>{{livro.autor}}</p>
        <p>{{livro.preco}}</p>
      </article>
    </div>
    `
}