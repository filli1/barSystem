const { get } = require("http");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../data/stockSystem.db");
//it should retrieve the classes from the classes.js file
const { Product, Location } = require("./classes");

exports.createLocation = async (req, res) => {
  const { name, isBar, maxCapacity } = req.body;
  const location = new Location(name, isBar, maxCapacity);

  location.init((err, id) => {
    if (err) {
      console.error("Failed to create location:", err.message);
      res
        .status(500)
        .json({ error: `Failed to create location due to internal error. ${err.message}` });
    } else {
      console.log("Location initialized with ID:", id);
      res
        .status(200)
        .json({ id: id, message: "Location successfully created." });
    }
  });
};

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
        console.log("Product initialized with ID:", id);
        res
            .status(200)
            .json({ id: id, message: "Product successfully created." });
        }
    });
}