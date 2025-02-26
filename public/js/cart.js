// cart.js (frontend)
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        alert("Item is already in your cart")
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

function updateCartCount() {
    const cart = getCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;
}

// Call it when the page loads or after adding to cart
updateCartCount();