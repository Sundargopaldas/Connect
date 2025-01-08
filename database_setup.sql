-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS user_authentication;

-- Usar o banco de dados
USE user_authentication;

-- Criar a tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar a tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar a tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50),
    client_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image LONGTEXT,
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, client_id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modificar a tabela de histórico de produtos
DROP TABLE IF EXISTS product_history;

-- Criar a tabela de movimentações com o novo campo
CREATE TABLE IF NOT EXISTS product_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50),
    client_id VARCHAR(100),
    action_type VARCHAR(50),
    old_stock INT,
    new_stock INT,
    observacoes TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;