-- Modificar a chave primária da tabela products
ALTER TABLE products
DROP PRIMARY KEY,
ADD PRIMARY KEY (id, client_id);