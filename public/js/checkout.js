// Create a Stripe instance with your public key
const stripe = Stripe('pk_live_51QXjQNGUne0h98JDtBOK74lR0P752YMRqIhBxMhm9anAxOtvxpLcTKvVUTSuY6LZfx7fFnvxhSENnr47E0GeXOk4003GCc3rDh');  // Use your Stripe publishable key



function sendCartToBackend(cart) {
    // Send cart data to your backend
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cart: cart.map(item => ({
                id: item.id,
                priceId: item.priceId,
                quantity: item.quantity,
            })),
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.sessionId) {
            // Redirect to Stripe Checkout with the session ID
            stripe.redirectToCheckout({ sessionId: data.sessionId })
                .then(function (result) {
                    if (result.error) {
                        alert(result.error.message);
                    }
                });
        }
    })
    .catch(error => {
        console.error('Error sending cart data to backend:', error);
    });
}
