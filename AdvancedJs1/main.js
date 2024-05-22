async function fetchRestaurantData() {
    try {
        const response = await fetch('https://10.120.32.94/restaurant/');
        if (!response.ok) {
            throw new Error('Failed to fetch restaurant data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

fetchRestaurantData()
    .then(data => {
        console.log('Restaurant data:', data);
        displayRestaurantData(data);
    })
    .catch(error => {    
        console.error('Error fetching restaurant data:', error);
    });
    
function displayRestaurantData(restaurants) {
    const restaurantList = document.getElementById('restaurant-list');

    restaurantList.innerHTML = '';

    restaurants.forEach(restaurant => {
        const restaurantItem = document.createElement('div');
        restaurantItem.classList.add('restaurant-item');
        restaurantItem.innerHTML = `
            <h2>${restaurant.name}</h2>
            <p>${restaurant.address}</p>
        `;
        restaurantList.appendChild(restaurantItem);
    });
}

const restaurantItems = document.querySelectorAll('.restaurant-item');

restaurantItems.forEach(item => {
    item.addEventListener('click', async () => {
        try {
            const menuResponse = await fetch(`https://10.120.32.94/restaurant/${item.id}/menu`);
            if (!menuResponse.ok) {
                throw new Error('Failed to fetch menu data');
            }
            const menuData = await menuResponse.json();
            displayModal(item, menuData);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
});

function displayModal(restaurant, menu) {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <h2>${restaurant.name}</h2>
        <p>${restaurant.address}</p>
        <h3>Menu</h3>
        <ul>
            ${menu.items.map(item => `<li>${item.name} - ${item.price}</li>`).join('')}
        </ul>
    `;    
    modal.style.display = 'block';
}
// main.js

// Import modular UI components
import { restaurantRow, restaurantModal } from './components.js';

// Import baseUrl from variables.js module
import { baseUrl } from './variables.js';

// Import fetchData function from utils.js module
import { fetchData } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchData(baseUrl)
        .then(data => {
            // Display restaurant data in a table
            const restaurantList = document.getElementById('restaurant-list');
            data.forEach(restaurant => {
                const row = restaurantRow(restaurant);
                restaurantList.appendChild(row);

                // Add click event listener to show modal on restaurant row click
                row.addEventListener('click', () => {
                    showRestaurantModal(restaurant);
                });
            });
        })
        .catch(error => {
            console.error('An error occurred:', error);
            // Handle error
        });
});

// Function to show modal with detailed restaurant and menu information
function showRestaurantModal(restaurant) {
    const modal = document.getElementById('modal');
    
    // Fetch menu data for the selected restaurant
    fetchData(`${baseUrl}/${restaurant.id}/menu`)
        .then(menu => {
            // Display restaurant and menu information in modal
            modal.innerHTML = restaurantModal(restaurant, menu);
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('An error occurred while fetching menu data:', error);
            // Handle error
        });
}
