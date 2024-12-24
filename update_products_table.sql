<<<<<<< HEAD
USE user_authentication;

-- Modifica a tabela products para permitir IDs duplicados em clientes diferentes
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS unique_id INT AUTO_INCREMENT PRIMARY KEY FIRST;

-- Remove a restrição de chave primária antiga do ID do produto
ALTER TABLE products 
DROP PRIMARY KEY,
ADD CONSTRAINT product_client_unique UNIQUE (id, client_id);

-- Remove outros índices únicos se existirem
ALTER TABLE products 
DROP INDEX IF EXISTS name,
DROP INDEX IF EXISTS product_name_unique,
=======
USE user_authentication;

-- Modifica a tabela products para permitir IDs duplicados em clientes diferentes
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS unique_id INT AUTO_INCREMENT PRIMARY KEY FIRST;

-- Remove a restrição de chave primária antiga do ID do produto
ALTER TABLE products 
DROP PRIMARY KEY,
ADD CONSTRAINT product_client_unique UNIQUE (id, client_id);

-- Remove outros índices únicos se existirem
ALTER TABLE products 
DROP INDEX IF EXISTS name,
DROP INDEX IF EXISTS product_name_unique,
>>>>>>> 20fda8206b51eb9ba8c85c9e33c1933aace16fde
DROP INDEX IF EXISTS unique_name;