DROP TABLE IF EXISTS productInCart;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    address TEXT,
    birthdate TEXT,
    role TEXT CHECK(role IN ('Customer', 'Manager', 'Admin')) NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
);

CREATE TABLE product (
    model TEXT PRIMARY KEY,
    arrivalDate TEXT NOT NULL,
    quantity INTEGER,
    sellingPrice REAL,
    details TEXT,
    category TEXT
);

CREATE TABLE cart (
    id INTEGER PRIMARY KEY,
    paid INTEGER CHECK(paid in (0,1)) NOT NULL,
    paymentDate TEXT,
    total REAL DEFAULT 0,
    username TEXT NOT NULL,
    FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE productInCart (
    id INTEGER NOT NULL,
    model TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    category TEXT NOT NULL,
    sellingPrice REAL NOT NULL,
    PRIMARY KEY (id, model),
    FOREIGN KEY(id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY(model) REFERENCES product(model) ON DELETE CASCADE
);

CREATE TABLE review (
    user TEXT NOT NULL,
    model TEXT NOT NULL,
    score INTEGER CHECK(score IN (1,2,3,4,5)),
    date TEXT, 
    comment TEXT,
    PRIMARY KEY (user, model),
    FOREIGN KEY(user) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY(model) REFERENCES product(model) ON DELETE CASCADE
);

INSERT INTO users (username, name, surname, role, password, salt) VALUES 
('user', 'Roberto', 'Candela', 'Customer', '01e20a15dfea30e987b5829c249115c9', 'f1f58f9b4b31d3df6c5dfb5829190e0f'),
('user2', 'Giorgio', 'Bongiovanni', 'Customer', 'c2dd21c2d3426fe4778b8c31cfa89234', '1f4b924eb411f6422334768b85e74bb3'),
('user3', 'Gianpiero', 'Cabodi', 'Customer', '8f635d3943bb657ffb6e5ed65e2b25d6', '57d20497a56e845fb2a313c9c07f9e1f'),
('admin', 'Paolo', 'Camurati', 'Admin', 'e4b0f94fc256ea6a8e0e7462c6e0bb1a', 'a4b03a8cf0348b2ffb26c97d6f7e5468'),
('manager', 'Luca', 'Ardito', 'Manager', 'd9b0b5412f5eaf5d2e1d27e357f5c732', 'b4f0a3b6c9a7d1a2e6c5d8a4f9b0d9e3');

INSERT INTO product (model, arrivalDate, quantity, sellingPrice, details, category) VALUES
('P001', '2023-01-10', 1, 699.99, 'Galaxy S21', 'Smartphone'),
('P002', '2023-02-20', 0, 999.99, 'Laptop 16GB RAM, 512GB SSD', 'Laptop'),
('P003', '2023-03-15', 1, 799.99, 'Fotocamera digitale EOS 200D', 'Appliance'),
('P004', '2023-04-05', 0, 699.99, 'Apple Watch', 'Appliance'),
('P005', '2023-05-10', 1, 499.99, 'Televisore 4K UHD da 55 pollici Bravia X90J', 'Appliance');

INSERT INTO cart (id, paid, paymentDate, total, username) VALUES
(1, 0, '2024-05-25', 4799.94, 'user'),
(2, 1, '2024-05-20', 2199.97, 'user'),
(3, 0, '2024-05-22', 150.00, 'user2'),
(4, 1, '2024-05-18', 300.40, 'user2'),
(5, 0, '2024-05-23', 250.60, 'user3');

INSERT INTO productInCart (id, model, quantity, category, sellingPrice) VALUES
(1, 'P001', 2, 'Smartphone', 699.99),
(1, 'P002', 1, 'Laptop', 999.99),
(1, 'P003', 3, 'Appliance', 799.99),
(2, 'P004', 1, 'Appliance', 699.99),
(2, 'P005', 2, 'Appliance', 499.99);

INSERT INTO review (user, model, score, date, comment) VALUES
('user', 'P003', 5, '2024-05-21', 'Eccellente fotocamera con ottime funzionalità.'),
('user', 'P002', 4, '2024-05-20', 'Leggero e potente, ma costoso.'),
('user', 'P001', 3, '2024-05-22', 'Buon telefono, ma la durata della batteria non è eccezionale.'),
('user', 'P005', 4, '2024-05-23', 'Ottimo televisore, ma sistema operativo non aggiornato con le ultime applicazioni.');
