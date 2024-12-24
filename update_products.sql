<<<<<<< HEAD
-- Modificar a chave primária da tabela products
ALTER TABLE products
DROP PRIMARY KEY,
=======
-- Modificar a chave primária da tabela products
ALTER TABLE products
DROP PRIMARY KEY,
>>>>>>> 20fda8206b51eb9ba8c85c9e33c1933aace16fde
ADD PRIMARY KEY (id, client_id);