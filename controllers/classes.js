const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "../data/stockSystem.db");

// This function opens a connection to the database.
function openDatabase() {
  const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
  return db;
}

class Product {
  constructor(
    name,
    supplier,
    salesPrice,
    purchacePrice,
    EAN,
    ABV,
    type,
    volume
  ) {
    this.name = name;
    this.supplier = supplier;
    this.salesPrice = salesPrice;
    this.purchacePrice = purchacePrice;
    this.EAN = EAN;
    this.ABV = ABV;
    this.type = type;
    this.volume = volume;
  }

  init(callback) {
    const db = openDatabase();
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        supplier TEXT,
        sales_price REAL,
        purchase_price REAL,
        EAN varchar(13),
        ABV REAL,
        Type TEXT,
        Volume REAL
        )`,
        (err) => {
          if (err) {
            console.error("Error creating table:", err.message);
            callback(err);
            return;
          }

          db.run(
            `INSERT INTO products (name, supplier, sales_price, purchase_price, EAN, ABV, Type, Volume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              this.name,
              this.supplier,
              this.salesPrice,
              this.purchacePrice,
              this.EAN,
              this.ABV,
              this.type,
              this.volume,
            ],
            function (err) {
              if (err) {
                console.error("Error inserting new product:", err.message);
                callback(err);
              }
              let id = this.lastID;
              db.close((err) => {
                if (err) {
                  console.error("Error closing database:", err.message);
                }
                callback(null, id); // Callback with the id after db is closed
              });
            }
          );
        }
      );
    });
  }
}

class Location {
  constructor(name, isBar) {
    this.id = null;
    this.name = name;
    this.isBar = isBar;
  }

  // Initialize the location asynchronously
  init(callback) {
    const db = openDatabase();
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS locations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          bar BOOLEAN
        )`,
        (err) => {
          if (err) {
            console.error("Error creating table:", err.message);
            callback(err);
            return;
          }

          db.run(
            `INSERT INTO locations (name, bar) VALUES (?, ?)`,
            [this.name, this.isBar],
            function (err) {
              if (err) {
                console.error("Error inserting new location:", err.message);
                callback(err);
              }
              let id = this.lastID;
              db.close((err) => {
                if (err) {
                  console.error("Error closing database:", err.message);
                }
                callback(null, id); // Callback with the id after db is closed
              });
            }
          );
        }
      );
    });
  }
}

class Stock {
  constructor(
    locationID,
    productID,
    quantity = 0,
    minQuantity = 0,
    maxQuantity
  ) {
    this.location = locationID;
    this.product = productID;
    this.quantity = quantity;
    this.minQuantity = minQuantity;
    this.maxQuantity = maxQuantity;
  }

  init(callback) {
    const db = openDatabase();
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS stock (
          locationID INTEGER,
          productID INTEGER,
          quantity INTEGER,
          min_quantity INTEGER,
          max_quantity INTEGER,
          FOREIGN KEY(productID) REFERENCES products(id),
          FOREIGN KEY(locationID) REFERENCES locations(id),
          PRIMARY KEY (locationID, productID)
        )`,
        (err) => {
          if (err) {
            console.error("Error creating table:", err.message);
            callback(err);
            return;
          }

          this.insertStock(callback);
        }
      );
    });
  }

  insertStock(callback) {
    const db = openDatabase();
    db.run(
      `INSERT INTO stock (locationID, productID, quantity, min_quantity, max_quantity) VALUES (?, ?, ?, ?, ?)`,
      [
        this.location,
        this.product,
        this.quantity,
        this.minQuantity,
        this.maxQuantity,
      ],
      function (err) {
        if (err) {
          console.error("Error inserting new instance of stock:", err.message);
          callback(err);
        } else {
          callback(null); // Callback with success
        }
        db.close();
      }
    );
  }

  getStock(callback) {
    const db = openDatabase();
    db.serialize(() => {
      db.get(
        `SELECT * FROM stock WHERE productID = ? AND locationID = ?`,
        [this.product, this.location],
        (err, row) => {
          if (err) {
            console.error("Error retrieving stock:", err.message);
            callback(err);
            return;
          }
          console.log("Stock retrieved successfully");
          callback(null, row);
        }
      );
    });
  }

  adjustStock(amount, callback) {
    const db = openDatabase();
    db.serialize(() => {
      db.get(
        `SELECT quantity FROM stock WHERE productID = ? AND locationID = ?`,
        [this.product, this.location],
        (err, row) => {
          if (err) {
            console.error("Error finding stock:", err.message);
            callback(err);
            return;
          }
          if (row) {
            let newQuantity = row.quantity + amount;
            if (newQuantity <= 0) {
              db.run(
                `DELETE FROM stock WHERE productID = ? AND locationID = ?`,
                [this.product, this.location],
                function (err) {
                  if (err) {
                    console.error("Error deleting stock:", err.message);
                    callback(err);
                    return;
                  }
                  console.log("Stock deleted successfully");
                  callback(null);
                }
              );
            } else {
              db.run(
                `UPDATE stock SET quantity = ? WHERE productID = ? AND locationID = ?`,
                [newQuantity, this.product, this.location],
                function (err) {
                  if (err) {
                    console.error("Error updating stock:", err.message);
                    callback(err);
                    return;
                  }
                  console.log(
                    `Stock updated successfully. New quantity: ${newQuantity}`
                  );
                  callback(null);
                }
              );
            }
          } else {
            // Stock does not exist, so insert it if the amount is greater than zero
            if (amount > 0) {
              this.quantity = amount; // Set this.quantity to the amount trying to add
              this.insertStock(callback);
            } else {
              console.log(
                "No stock to insert since the amount is zero or negative"
              );
              callback(null);
            }
          }
        }
      );
    });
  }
}

module.exports = {
  Product,
  Location,
  Stock,
};
