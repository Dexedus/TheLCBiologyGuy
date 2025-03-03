// cart.js (frontend)
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        alert( existingProduct.name+" is already in your cart")
    } else {
        // If it doesn't exist, add it as a new item with quantity 1
        product.quantity = 1;
        cart.push(product);
    }

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function clearCart() {
    localStorage.removeItem("cart");
}



// Get all Add to Cart buttons
document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        console.log("Add to Cart button clicked!");
        // Get the product details from the button's data attributes
        const product = {
            id: e.target.dataset.id,
            name: e.target.dataset.name,
            priceId: e.target.dataset.priceId,
        };

        // Add the product to the cart
        addToCart(product);

        // // Optionally, display a message to the user
        // alert(`${product.name} has been added to your cart!`);
    });
});



function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Filter out the product to be removed
    cart = cart.filter(item => item.id !== productId);

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update the cart count
    updateCartCount();
}


// Get all Remove from Cart buttons
document.querySelectorAll(".remove-from-cart-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        console.log("Remove from Cart button clicked!");
        
        const productId = e.target.dataset.id; // Get product ID from data attribute

        // Remove the product from the cart
        removeFromCart(productId);
    });
});


function updateCartCount() {
    const cart = getCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;

    const cartCountElement = document.getElementById("cart-count");

    cartCountElement.classList.remove("cart-bounce");

    // Trigger reflow to restart the animation (forces the browser to recognize class removal)
    void cartCountElement.offsetWidth;

    // Add the animation class
    cartCountElement.classList.add("cart-bounce");

    // Remove the class after the animation completes
    cartCountElement.addEventListener("animationend", function removeAnimation() {
        cartCountElement.classList.remove("cart-bounce");
        cartCountElement.removeEventListener("animationend", removeAnimation);
    });
    
}

// Call it when the page loads or after adding to cart
updateCartCount();