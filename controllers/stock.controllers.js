const { get } = require("http");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../data/stockSystem.db");

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

//it should retrieve the classes from the classes.js file
const { Product, Location, Stock } = require("./classes");

exports.createLocation = async (req, res) => {
  const { name, isBar } = req.body;
  const location = new Location(name, isBar);

  location.init((err, id) => {
    if (err) {
      console.error("Failed to create location:", err.message);
      res
        .status(500)
        .json({ error: `Failed to create location due to internal error. ${err.message}` });
    } else {
        location.id = id;
      console.log("Location initialized with ID:", id);
      res
        .status(200)
        .json({ id: id, object: location, message: "Location successfully created." });
    }
  });
};

exports.retrieveLocations = async (req, res) => {
    const db = openDatabase();
    db.serialize(() => {
        db.all(`SELECT * FROM locations`, (err, rows) => {
            if (err) {
                console.error("Failed to retrieve locations:", err.message);
                res
                    .status(500)
                    .json({ error: `Failed to retrieve locations due to internal error. ${err.message}` });
            } else {
                console.log("Locations retrieved successfully.");
                res
                    .status(200)
                    .json({ locations: rows });
            }
        });
    });
}

exports.createProduct = async (req, res) => {
    const { name, supplier, salesPrice, purchasePrice, EAN, ABV, type, volume } = req.body;
    const product = new Product(name, supplier, salesPrice, purchasePrice, EAN, ABV, type, volume);
    

    product.init((err, id) => {
        if (err) {
        console.error("Failed to create product:", err.message);
        res
            .status(500)
            .json({ error: `Failed to create product due to internal error. ${err.message}` });
        } else {
            product.id = id;
        console.log("Product initialized with ID:", id);
        res
            .status(200)
            .json({ id: id, object:product, message: "Product successfully created." });
        }
    });
}

exports.retrieveProducts = async (req, res) => {
    const db = openDatabase();
    db.serialize(() => {
        db.all(`SELECT * FROM products`, (err, rows) => {
            if (err) {
                console.error("Failed to retrieve products:", err.message);
                res
                    .status(500)
                    .json({ error: `Failed to retrieve products due to internal error. ${err.message}` });
            } else {
                console.log("Products retrieved successfully.");
                res
                    .status(200)
                    .json({ products: rows });
            }
        });
    });
}

exports.findByEAN = async (req, res) => {
    const db = openDatabase();
    const { EAN } = req.query;
    db.serialize(() => {
        db.get(`SELECT * FROM products WHERE EAN = ?`, [EAN], (err, row) => {
            if (err) {
                console.error("Failed to retrieve product:", err.message);
                res
                    .status(500)
                    .json({ error: `Failed to retrieve product due to internal error. ${err.message}` });
            } else {
                console.log("Product retrieved successfully.");
                res
                    .status(200)
                    .json({ product: row });
            }
        });
    });

}

exports.createStock = async (req, res) => {
    const {productID, locationID, quantity, maxQuantity, minQuantity} = req.body;
    const stock = new Stock(productID, locationID, quantity, minQuantity, maxQuantity);

    stock.init((err, id) => {
        if (err) {
        console.error("Failed to create stock:", err.message);
        res
            .status(500)
            .json({ error: `Failed to create stock due to internal error. ${err.message}` });
        } else {
            stock.id = id;
        console.log("Stock initialized with ID:", id);
        res
            .status(200)
            .json({ id: id, object:stock, message: "Stock successfully created." });
        }
    })
}

exports.updateStock = async (req, res) => {
    const { productID, locationID, amount } = req.body;
    console.log(req.body)
    console.log(productID, locationID)
    let stock = new Stock(locationID, productID, 0, 0, 0);

    const updateCallback = (err, changes) => {
        if (err) {
            console.error("Failed to update stock:", err.message);
            res.status(500).json({ error: `Failed to update stock due to internal error: ${err.message}` });
        } else {
            console.log("Stock updated successfully.");
            res.status(200).json({ message: `Stock successfully updated, ${changes} rows affected.` });
        }
    };
    stock.adjustStock(amount, updateCallback)
}

exports.getStock = async (req, res) => {
    const { locationID, productID } = req.query;
    console.log(locationID, productID)
    let stock = new Stock(locationID, productID, 0, 0, 0);

    const getCallback = (err, row) => {
        if (err) {
            console.error("Failed to retrieve stock:", err.message);
            res.status(500).json({ error: `Failed to retrieve stock due to internal error: ${err.message}` });
        } else {
            console.log("Stock retrieved successfully.");
            res.status(200).json({ stock: row });
        }
    };
    stock.getStock(getCallback)
}