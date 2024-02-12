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

INSERT INTO papeis(id, nome) VALUES (1, 'geral'), (2, 'admin');
INSERT INTO usuarios(id, nome, senha, id_papel) VALUES (1, 'Thiago', '123', 1), (2, 'Admin', '123', 2);
INSERT INTO categorias(id, nome) VALUES (1, 'Aventura'), (2, 'Ficcao'), (3, 'Historico');
INSERT INTO livros(id, titulo, autor, resumo, id_categoria) VALUES (1, 'Lorem', 'Ipsum', 'Lorem', 1), (2, 'Lorem', 'Ipsum', 'Lorem', 1);