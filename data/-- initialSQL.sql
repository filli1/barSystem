-- SQLite
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    supplier TEXT,
    sales_price REAL,
    purchase_price REAL,
    EAN varchar(13),
    ABV REAL,
    Type TEXT,
    Volume REAL
    );

CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    max_capacity INTEGER,
    bar BOOLEAN
);

SELECT * FROM locations

SELECT * FROM products

CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    location_id INTEGER,
    quantity INTEGER,
    max_capacity INTEGER,
    min_capacity INTEGER,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(location_id) REFERENCES locations(id)
);

DROP TABLE IF EXISTS products;