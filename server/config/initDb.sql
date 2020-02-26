CREATE TABLE IF NOT EXISTS users (
    id serial NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL UNIQUE,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    role text NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS admins (
    id serial NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL UNIQUE,
    username text NOT NULL,
    password text NOT NULL,
    CONSTRAINT admins_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS products (
    id serial NOT NULL,
    description text,
    name text UNIQUE NOT NULL,
    price numeric(15, 2) NOT NULL,
    stock int NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS items (
    id serial NOT NULL,
    cart_id int NOT NULL,
    product_id int NOT NULL,
    stock int,
    CONSTRAINT items_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS carts (
    id serial NOT NULL,
    user_id int NOT NULL UNIQUE,
    CONSTRAINT cart_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS resetpasswordtokens (
    id int UNIQUE NOT NULL,
    token text UNIQUE NOT NULL,
    expire text NOT NULL,
    CONSTRAINT resetpasswordtokens_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS orders (
    id serial NOT NULL,
    user_id int NOT NULL,
    status text NOT NULL,
    date text NOT NULL,
    total numeric(15, 2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ordereditems (
    id serial NOT NULL,
    order_id int NOT NULL,
    product_id int NOT NULL,
    ordered_price numeric(15, 2) NOT NULL,
    ordered_total numeric(15, 2) NOT NULL,
    stock int,
    CONSTRAINT ordereditems_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pendingpayments (
    id serial NOT NULL,
    order_id int NOT NULL,
    payment_id text NOT NULL UNIQUE,
    total text NOT NULL,
    CONSTRAINT pendingpayments_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS roles (
    id serial NOT NULL,
    role text NOT NULL UNIQUE,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS userroles (
    id serial NOT NULL,
    user_id int NOT NULL,
    role_id int NOT NULL,
    CONSTRAINT userroles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS permissionroles (
    id serial NOT NULL,
    permission_id int NOT NULL,
    role_id int NOT NULL,
    CONSTRAINT permissionroles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tags (
    tag_id serial NOT NULL,
    name text UNIQUE NOT NULL,
    CONSTRAINT tags_pkey PRIMARY KEY (tag_id)
);

CREATE TABLE IF NOT EXISTS permissions (
    id serial NOT NULL,
    name text UNIQUE NOT NULL,
    permission text UNIQUE NOT NULL,
    CONSTRAINT permissons_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS producttags (
    id serial NOT NULL,
    product_id int NOT NULL,
    tag_id int NOT NULL,
    CONSTRAINT producttags_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS verifyemailtokens(
    user_id int UNIQUE NOT NULL,
    token text UNIQUE NOT NULL,
    CONSTRAINT verifyemailtokens_pkey PRIMARY KEY(token)
);

ALTER TABLE carts DROP CONSTRAINT IF EXISTS fk_user_id;
ALTER TABLE items DROP CONSTRAINT IF EXISTS fk_cart_id;
ALTER TABLE items DROP CONSTRAINT IF EXISTS fk_product_id;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_user_id;
ALTER TABLE ordereditems DROP CONSTRAINT IF EXISTS fk_order_id;
ALTER TABLE ordereditems DROP CONSTRAINT IF EXISTS fk_product_id;
ALTER TABLE producttags DROP CONSTRAINT IF EXISTS fk_product_id;
ALTER TABLE producttags DROP CONSTRAINT IF EXISTS fk_tag_id;
ALTER TABLE verifyemailtokens DROP CONSTRAINT IF EXISTS fk_user_id;
ALTER TABLE
    verifyemailtokens
ADD
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE
    carts
ADD
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE
    items
ADD
    CONSTRAINT fk_cart_id FOREIGN KEY (cart_id) REFERENCES carts(id);

ALTER TABLE
    items
ADD
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE
    orders
ADD
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE
    ordereditems
ADD
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(id);

ALTER TABLE
    ordereditems
ADD
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE
    producttags
ADD
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE
    producttags
ADD
    CONSTRAINT fk_tag_id FOREIGN KEY (tag_id) REFERENCES tags(tag_id);
