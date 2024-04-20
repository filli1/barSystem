class Guest {
    constructor(name, email, postalCode, age, gender) {
      this.name = name;
      this.email = email;
      this.postalCode = postalCode;
      this.age = age;
      this.gender = gender;
    }
  }
  
  class Event {
    constructor(title, date, time, location, description, maxGuests, price) {
      this.title = title;
      this.date = date;
      this.time = time;
      this.price = price;
      this.location = location;
      this.description = description;
      this.maxGuests = maxGuests;
    }
  }
  
  class Ticket {
    constructor(event, guest) {
      if (!(event instanceof Event)) {
        throw new Error("Invalid event - must be an instance of Event");
      }
      if (!(guest instanceof Guest)) {
        throw new Error("Invalid artist - must be an instance of Artist");
      }
      this.event = event;
      this.guest = guest;
    }
  
    generateTicket() {
      //Send a ticket to the guest's email with a new unique ticket number
    }
  
    assignTicketToGuest(guest) {
      if (!(guest instanceof Guest)) {
        throw new Error("Invalid guest - must be an instance of Guest");
      }
      this.guest = guest;
    }
  
    scanTicket() {
      if (this.scanned) {
        throw new Error("Ticket already scanned");
      } else {
        this.scanned = true;
      }
    }
  
    getGuestDetails() {
      return {
        name: this.guest.name,
        email: this.guest.email,
        postalCode: this.guest.postalCode,
        age: this,
      };
    }
  }
  
  class Artist {
    constructor(name, genre, description) {
      this.name = name;
      this.genre = genre;
      this.description = description;
    }
  }
  
  class Lineup {
    constructor(artist, event) {
      if (!(artist instanceof Artist)) {
        throw new Error("Invalid artist - must be an instance of Artist");
      }
      if (!(event instanceof Event)) {
        throw new Error("Invalid event - must be an instance of Event");
      }
      this.artist = artist;
      this.event = event;
    }
  }
  
  class Product {
    constructor(name, salesPrice, purchacePrice, type) {
      this.name = name;
      this.salesPrice = salesPrice;
      this.purchacePrice = purchacePrice;
      this.type = type;
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
    constructor(name, isBar, location, capacity) {
      this.name = name;
      this.isBar = isBar;
      this.location = location;
      this.capacity = capacity;
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
  
  class Sale {
      constructor(product, quantity, location) {
          if (!(product instanceof Product)) {
          throw new Error("Invalid product - must be an instance of Product");
          }
          if (!(location instanceof Location)) {
          throw new Error("Invalid location - must be an instance of Location");
          }
          this.product = product;
          this.quantity = quantity;
          this.location = location;
      }
      
      calculateTotal() {
          return this.product.salesPrice * this.quantity;
      }
  }