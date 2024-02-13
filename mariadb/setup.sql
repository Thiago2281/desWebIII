CREATE TABLE papeis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    senha VARCHAR(500),
    id_papel INT,
    FOREIGN KEY (id_papel) REFERENCES papeis(id)
);
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);

CREATE TABLE livros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(45),
    autor VARCHAR(45),
    resumo VARCHAR(500),
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);