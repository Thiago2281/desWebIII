let db;
const request = indexedDB.open("Biblioteca", 1);
request.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = (event) => {
    db = event.target.result;
    console.log('sucesso', event);
};

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    console.log('upgrade', event);

    const objectStore = db.createObjectStore("livros", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("nome", "nome", { unique: false });
    objectStore.createIndex("autor", "autor", { unique: false });
    objectStore.createIndex("preco", "preco", { unique: false });

};

function adicionar(livro) {
    return new Promise((resolve, reject) => {
        let id;
        const transaction = db.transaction(["livros"], "readwrite");
        transaction.oncomplete = (event) => {
            resolve(id);
        };
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("livros");
        const request = objectStore.add(livro);
        request.onsuccess = (event) => {
            id = event.target.result;
        };
    
    });
}

function listar() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["livros"], "readonly");
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("livros");
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    
    });
}

function deletar(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["livros"], "readwrite");
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("livros");
        const request = objectStore.delete(id);
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    
    });
}