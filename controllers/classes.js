const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "../data/stockSystem.db");

// This function opens a connection to the database.
// Consider managing database connections outside of the class in a real application.
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
  constructor(name, supplier, salesPrice, purchacePrice, EAN, ABV, type, volume) {
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
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        supplier TEXT,
        sales_price REAL,
        purchase_price REAL,
        EAN varchar(13),
        ABV REAL,
        Type TEXT,
        Volume REAL
        )`, err => {
          if (err) {
            console.error('Error creating table:', err.message);
            callback(err);
            return;
          }

          db.run(`INSERT INTO products (name, supplier, sales_price, purchase_price, EAN, ABV, Type, Volume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.name, this.supplier, this.salesPrice, this.purchacePrice, this.EAN, this.ABV, this.type, this.volume], function (err) {
              if (err) {
                console.error('Error inserting new product:', err.message);
                callback(err);
              }
                console.log(`Inserted ID: ${this.lastID}`);  // Direct logging
                let id = this.lastID;
                db.close((err) => {
                  if (err) {
                    console.error('Error closing database:', err.message);
                  }
                  callback(null, id);  // Callback with the id after db is closed
                });
              }  // Binding `this` to ensure context
          );
        });
    });
  }

  getProductDetails() {
    return {
      name: this.name,
      salesPrice: this.salesPrice,
      purchacePrice: this.purchacePrice,
      type: this.type,
    };
  }

  getTotalStock(stocks) {
    let total = 0;
    let data = {};
    for (let stock of stocks) {
      data[stock.location.name] = stock.getProductAmount(this.name);
      total += stock.getProductAmount(this.name);
    }
    return { total, data };
  }
}

class Location {
  constructor(name, isBar, capacity) {
    this.id = null;
    this.name = name;
    this.isBar = isBar;
    this.capacity = capacity;
  }

  // Initialize the location asynchronously
  init(callback) {
    const db = openDatabase();
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS locations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          max_capacity INTEGER,
          bar BOOLEAN
        )`, err => {
          if (err) {
            console.error('Error creating table:', err.message);
            callback(err);
            return;
          }

          db.run(`INSERT INTO locations (name, max_capacity, bar) VALUES (?, ?, ?)`,
            [this.name, this.capacity, this.isBar], function (err) {
              if (err) {
                console.error('Error inserting new location:', err.message);
                callback(err);
              }
                console.log(`Inserted ID: ${this.lastID}`);  // Direct logging
                let id = this.lastID;
                db.close((err) => {
                  if (err) {
                    console.error('Error closing database:', err.message);
                  }
                  callback(null, id);  // Callback with the id after db is closed
                });
              }  // Binding `this` to ensure context
          );
        });
    });
  }
}

class Stock {
  constructor(location) {
    if (!(location instanceof Location)) {
      throw new Error("Invalid location - must be an instance of Location");
    }
    this.location = location;
    this.inventory = {}; // This will store Product instances as keys and their quantities as values
  }

  addStock(product, amount) {
    if (!(product instanceof Product)) {
      throw new Error("Invalid product - must be an instance of Product");
    }
    if (!this.inventory[product.name]) {
      this.inventory[product.name] = {
        product: product,
        quantity: 0,
      };
    }
    this.inventory[product.name].quantity += amount;
  }

  takeStock(productName, amount) {
    if (
      this.inventory[productName] &&
      this.inventory[productName].quantity >= amount
    ) {
      this.inventory[productName].quantity -= amount;
      if (this.inventory[productName].quantity === 0) {
        delete this.inventory[productName];
      }
    } else {
      throw new Error("Not enough stock or product does not exist");
    }
  }

  getProductAmount(productName) {
    return this.inventory[productName]
      ? this.inventory[productName].quantity
      : 0;
  }
}

module.exports = {
  Product,
  Location,
  Stock,
};
