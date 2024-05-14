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
        return; 
    }

    const locationLists = document.querySelectorAll('.location-list');
    locationLists.forEach(locationlist => {
        locations.forEach(location => {
            let option = document.createElement('option');
            option.value = location.id; 
            option.innerHTML = location.name; 
            locationlist.appendChild(option); 
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
        return; 
    }

    const productLists = document.querySelectorAll('.product-list');
    productLists.forEach(productlist => {
        products.forEach(product => {
            let option = document.createElement('option');
            option.value = product.id; 
            option.innerHTML = product.name; 
            productlist.appendChild(option);
        });
    });
}

updateStockDisplay = async (locationID, productID) => {
    try {
        const response = await fetch(`../api/stock/getStock?locationID=${locationID}&productID=${productID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data.stock);
        return data.stock;
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const lists = document.querySelectorAll('.location-list, .product-list');
    const locationLists = document.querySelectorAll('.location-list');
    const hiddenElements = document.querySelectorAll('.confirm-button, .quantity-box, .stock-info');
    const locationFrom = document.querySelector('#locationFromName');
    const locationFromStock = document.querySelector('#locationFromStock');
    const locationTo = document.querySelector('#locationToName');
    const locationToStock = document.querySelector('#locationToStock');
    const quantityBox = document.querySelector('#quantity');
    const confirmButton = document.querySelector('.confirm-button');
    retrieveLocations();
    retrieveProducts();

    let fromStock
    let toStock

    lists.forEach(list => {
        list.addEventListener('change', async () => {
            listValues = [];
            lists.forEach(list => {
                listValues.push(list.value);
            })
            console.log(listValues);

            if (listValues.includes('null')) {
                hiddenElements.forEach(element => {
                    element.style.display = 'none';
                });
                return;
            } else {
                
                locationFrom.innerHTML = `Beholdning ${locationLists[0].options[locationLists[0].selectedIndex].text.toLowerCase()}`;
                locationTo.innerHTML = `Beholdning ${locationLists[1].options[locationLists[1].selectedIndex].text.toLowerCase()}`;

                hiddenElements.forEach(element => {
                    element.style.display = 'block';
                });

                let stock = [];
                for (const locationList of locationLists) {
                    try {
                        let thisStock = await updateStockDisplay(locationList.value, listValues[2]);
                        stock.push(thisStock.quantity);
                    } catch (error) {
                        console.error('Error updating stock:', error);
                    }
                }

                locationFromStock.innerHTML = stock[0];
                fromStock = stock[0];
                locationToStock.innerHTML = stock[1];
                toStock = stock[1];
            }
        })
    })

    quantityBox.addEventListener('input', () => {
        const quantity = parseInt(quantityBox.value, 10) || 0; // Default to 0 if NaN
        const currentFromStock = fromStock || 0;
        const currentToStock = toStock || 0;
    
        locationFromStock.innerHTML = currentFromStock - quantity;
        locationToStock.innerHTML = currentToStock + quantity;
    });
    
    confirmButton.addEventListener('click', async () => {
        let switchSign = -1;
        let updateResults = [];
        let allUpdatesSuccessful = true;
    
        for (const locationList of locationLists) {
            if (locationList.value === 'null') {
                alert('Please select a location');
                return; // Stops processing more locations
            }
            try {
                const response = await fetch(`../api/stock/updateStock`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productID: lists[2].value,
                        locationID: locationList.value,
                        amount: parseInt(quantityBox.value, 10) * switchSign
                    })
                });
                if (!response.ok) throw new Error('Failed to update stock');
                const data = await response.json();
                console.log(data);
                updateResults.push(data.stock); // Collect results from each update
                switchSign *= -1; // Switch the sign for the second location
            } catch (error) {
                console.error('Error:', error);
                allUpdatesSuccessful = false; // Flag to indicate at least one update failed
            }
        }
    
        if (allUpdatesSuccessful) {
            console.log("All updates were successful", updateResults);
        } else {
            console.error("One or more updates failed");
        }

        hiddenElements.forEach(element => {
            element.style.display = 'none';
        });
        lists.forEach(list => {
            list.value = 'null';
        });

    });
    
});
