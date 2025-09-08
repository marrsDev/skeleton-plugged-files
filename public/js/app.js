// public/js/app.js - Vanilla JavaScript version
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize variables
    let cost = 0;
    let cart = [];
    
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('windowCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartPreview();
    }
    
    // Add event listener to calculate button
    const calculateButton = document.querySelector('.startButton');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateCost);
        console.log('Calculate button event listener added');
    } else {
        console.error('Calculate button not found');
    }
    
    // Add event listener to add to cart button
    const addToCartButton = document.getElementById('add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addToCart);
    }
    
    // Add event listeners for preview updates
    document.getElementById('noOfPanels').addEventListener('change', updatePreview);
    document.getElementById('fixedPartition').addEventListener('change', updatePreview);
    document.getElementById('profileColour').addEventListener('change', updateProfileConfig);
    
    
    async function calculateCost() {
        console.log('Calculate cost button clicked');
        
        // Get values from form
        const height = parseInt(document.getElementById('heightId').value);
        const width = parseInt(document.getElementById('widthId').value);
        const profileColour = document.getElementById('profileColour').value;
        const noOfPanels = document.getElementById('noOfPanels').value;
        const fixedPartition = document.getElementById('fixedPartition').value;
        const glassType = document.getElementById('glassType').value;
        const glassThickness = document.getElementById('glassThickness').value;
        
        // Validate inputs
        if (!height || !width || height <= 0 || width <= 0) {
            alert('Please enter valid height and width values');
            return;
        }
        
        console.log('Sending request to server with data:', {
            height, width, profileColour, noOfPanels, fixedPartition, glassType, glassThickness
        });
        
        try {
            // Prepare data for API
            const requestData = {
                height,
                width,
                noOfPanels,
                fixedPartition,
                glassType,
                glassThickness,
                profileColour
            };
            
            // Send request to backend
            const response = await fetch('/api/calculations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            console.log('Full response data:', JSON.stringify(data, null, 2)); // This will show the complete structure
            
            // Check if the response has the expected structure
            if (data.success && data.totalCost !== undefined) {
                cost = data.totalCost;
                document.getElementById('cost').value = `KSh ${cost.toLocaleString()}`;
            } else if (data.cost !== undefined) {
                // Fallback: if cost is directly in data
                cost = data.cost;
                document.getElementById('cost').value = `KSh ${cost.toLocaleString()}`;
            } else {
                throw new Error('Invalid response format from server');
            }
            
        } catch (error) {
            console.error('Error calculating cost:', error);
            alert('Error calculating cost. Please try again.');
        }
    }
    
    function updatePreview() {
        console.log('Updating preview');
        
        // Get values from form
        const noOfPanels = document.getElementById('noOfPanels').value;
        const fixedPartition = document.getElementById('fixedPartition').value;
        
        // Determine image based on selections
        let imageName = 'type-1'; // default
        
        if (noOfPanels === '2') {
            if (fixedPartition === 'noPartition') imageName = 'type-1';
            else if (fixedPartition === 'doubleFixed') imageName = 'type-5';
            else if (fixedPartition === 'fixedTop') imageName = 'type-3';
            else if (fixedPartition === 'fixedBottom') imageName = 'type-3';
            else if (fixedPartition === 'openAbleTopFxBtm') imageName = 'type-10';
            else if (fixedPartition === 'openAbleTop') imageName = 'type-69';
        } else if (noOfPanels === '3') {
            if (fixedPartition === 'noPartition') imageName = 'type-2';
            else if (fixedPartition === 'doubleFixed') imageName = 'type-6';
            else if (fixedPartition === 'fixedTop') imageName = 'type-4';
            else if (fixedPartition === 'fixedBottom') imageName = 'type-4';
            else if (fixedPartition === 'openAbleTopFxBtm') imageName = 'type-11';
            else if (fixedPartition === 'openAbleTop') imageName = 'type-69';
        } else if (noOfPanels === '4') {
            if (fixedPartition === 'noPartition') imageName = 'type-69';
            else if (fixedPartition === 'doubleFixed') imageName = 'type-69';
            else if (fixedPartition === 'fixedTop') imageName = 'type-69';
            else if (fixedPartition === 'fixedBottom') imageName = 'type-69';
            else if (fixedPartition === 'openAbleTopFxBtm') imageName = 'type-69';
            else if (fixedPartition === 'openAbleTop') imageName = 'type-69';
        }
        
        // Update image and type code
        document.getElementById('img-type').src = `img/previewLabels/${imageName}.png`;
        document.getElementById('type-code').textContent = `#${imageName}`;
    }

    // function updateProfileConfig() {
    //     console.log('Profile color changed');
    //     const profileColour = document.getElementById('profileColour').value;
    //     console.log('Selected profile color:', profileColour);
    //     // You can add any color-specific logic here
    // }

    // Make sure these functions are available globally
    window.updatePreview = updatePreview;
    window.updateProfileConfig = updateProfileConfig;
    
    function addToCart() {
        console.log('Add to cart clicked');
        
        if (cost <= 0) {
            alert('Please calculate cost first before adding to cart');
            return;
        }
        
        // Get values from form
        const height = parseInt(document.getElementById('heightId').value);
        const width = parseInt(document.getElementById('widthId').value);
        const profileColour = document.getElementById('profileColour').value;
        const noOfPanels = document.getElementById('noOfPanels').value;
        const fixedPartition = document.getElementById('fixedPartition').value;
        const glassType = document.getElementById('glassType').value;
        const glassThickness = document.getElementById('glassThickness').value;
        
        // Create cart item
        const item = {
            id: Date.now(), // unique ID
            height,
            width,
            profileColour,
            noOfPanels,
            fixedPartition,
            glassType,
            glassThickness,
            cost,
            timestamp: new Date().toLocaleString()
        };
        
        // Add to cart
        cart.push(item);
        
        // Save to localStorage
        localStorage.setItem('windowCart', JSON.stringify(cart));
        
        // Update cart preview
        updateCartPreview();
        
        alert('Item added to cart!');
    }
    
    function updateCartPreview() {
        const cartPreview = document.getElementById('cart-preview');
        
        if (cart.length === 0) {
            cartPreview.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        let html = '<h3>Your Quote Items</h3><ul>';
        
        cart.forEach(item => {
            html += `
                <li>
                    ${item.width}mm x ${item.height}mm - ${item.noOfPanels} panels - 
                    ${item.profileColour} - KSh ${item.cost.toLocaleString()}
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </li>
            `;
        });
        
        html += '</ul>';
        html += `<p>Total: KSh ${getTotalCost().toLocaleString()}</p>`;
        html += '<button onclick="exportQuote()">Export Full Quote</button>';
        
        cartPreview.innerHTML = html;
    }
    
    function getTotalCost() {
        return cart.reduce((total, item) => total + item.cost, 0);
    }
    
    function updateProfileConfig() {
        console.log('Profile color changed');
    }
    
    // Make functions available globally for onclick handlers
    window.removeFromCart = function(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('windowCart', JSON.stringify(cart));
        updateCartPreview();
    };
    
    window.exportQuote = function() {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        // Create a printable quote document
        const quoteWindow = window.open('', '_blank');
        quoteWindow.document.write(`
            <html>
            <head>
                <title>Window Quote</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .total { font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>Window Quote</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <table>
                    <tr>
                        <th>Dimensions</th>
                        <th>Panels</th>
                        <th>Color</th>
                        <th>Glass Type</th>
                        <th>Glass Thickness</th>
                        <th>Cost (KSh)</th>
                    </tr>
        `);
        
        cart.forEach(item => {
            quoteWindow.document.write(`
                <tr>
                    <td>${item.width}mm x ${item.height}mm</td>
                    <td>${item.noOfPanels}</td>
                    <td>${item.profileColour}</td>
                    <td>${item.glassType}</td>
                    <td>${item.glassThickness}</td>
                    <td>${item.cost.toLocaleString()}</td>
                </tr>
            `);
        });
        
        quoteWindow.document.write(`
                <tr class="total">
                    <td colspan="5">Total</td>
                    <td>${getTotalCost().toLocaleString()}</td>
                </tr>
            </table>
            <button onclick="window.print()">Print Quote</button>
            </body>
            </html>
        `);
        
        quoteWindow.document.close();
    };
    
    window.toggleMenu = function() {
        const menu = document.querySelector('.menu');
        menu.classList.toggle('active');
    };
});

// Add these functions to your vanilla JavaScript app.js

function updatePreview() {
    console.log('Updating preview');
    
    // Get values from form
    const noOfPanels = document.getElementById('noOfPanels').value;
    const fixedPartition = document.getElementById('fixedPartition').value;
    
    // Determine image based on selections
    let imageName = 'type-1'; // default
    
    if (noOfPanels === '2') {
        if (fixedPartition === 'noPartition') imageName = 'type-1';
        else if (fixedPartition === 'doubleFixed') imageName = 'type-2';
        else if (fixedPartition === 'fixedTop') imageName = 'type-3';
        else if (fixedPartition === 'fixedBottom') imageName = 'type-4';
        else if (fixedPartition === 'openAbleTopFxBtm') imageName = 'type-5';
        else if (fixedPartition === 'openAbleTop') imageName = 'type-6';
    } else if (noOfPanels === '3') {
        imageName = 'type-3-panel';
    } else if (noOfPanels === '4') {
        imageName = 'type-4-panel';
    }
    
    // Update image and type code
    document.getElementById('img-type').src = `img/${imageName}.png`;
    document.getElementById('type-code').textContent = `#${imageName}`;
}

function updateProfileConfig() {
    console.log('Profile color changed');
    const profileColour = document.getElementById('profileColour').value;
    console.log('Selected profile color:', profileColour);
    // You can add any color-specific logic here
}

// Make sure these functions are available globally
window.updatePreview = updatePreview;
window.updateProfileConfig = updateProfileConfig;
console.log('app.js loaded successfully');
