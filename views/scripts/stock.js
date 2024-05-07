const { updateStock } = require("../../controllers/stock.controllers");

async function retrieveLocations() {
    let locations;
    try {
        const response = await fetch('../api/stock/retrieveLocations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        locations = data.locations;
    } catch (error) {
        console.error('Error:', error);
        return; // Early return on error to avoid further execution
    }

    const locationLists = document.querySelectorAll('.location-list');
    locationLists.forEach(locationlist => {
        locations.forEach(location => {
            let option = document.createElement('option');
            option.value = location.id; // Set the value on the option element
            option.innerHTML = location.name; // Set the display text
            locationlist.appendChild(option); // Append the option to the select element
        });
    });
}

async function retrieveProducts() {
    let products;
    try {
        const response = await fetch('../api/stock/retrieveProducts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        products = data.products;
    } catch (error) {
        console.error('Error:', error);
        return; // Early return on error to avoid further execution
    }

    const productLists = document.querySelectorAll('.product-list');
    productLists.forEach(productlist => {
        products.forEach(product => {
            let option = document.createElement('option');
            option.value = product.id; // Set the value on the option element
            option.innerHTML = product.name; // Set the display text
            productlist.appendChild(option); // Append the option to the select element
        });
    });
}

updateStockDisplay = async (locationID, productID) => {
    try {
        const response = await fetch('../api/stock/getStock', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    locationID: locationID,
                    productID: productID
                }
            )
        });
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error:', error);
    }

    //For each location, retrieve stock for the selected product, but first when the user selects the product the first time
    //The product selector shuld only be seen when from and to locations are selected
    //the stock display should only be seen when the product is selected
    //Every time one of the locations or products is changed, the stock display should be updated
    //The quantity selector should only be in positive numbers
    //The updateStock PUT endpoint should be called when the user clicks the update button
}

document.addEventListener('DOMContentLoaded', function() {
    retrieveLocations();
    retrieveProducts();
});
