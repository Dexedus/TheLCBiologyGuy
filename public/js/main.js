const modal = document.getElementById("modalSheet"); // Use the correct modal ID
const closeBtn = document.getElementById("close");
const quitBtn = document.getElementById("quit");

// Function to remove the modal after the closing animation ends
function removeModal() {
    modal.remove(); // Removes the modal from the DOM
}

// Apply closing animation and remove modal after animation ends
closeBtn.onclick = function() {
    modal.classList.add("closingAnimation");
    // Wait for the animation to finish
    modal.addEventListener('animationend', removeModal, { once: true });
}

quitBtn.onclick = function() {
    modal.classList.add("closingAnimation");
    // Wait for the animation to finish
    modal.addEventListener('animationend', removeModal, { once: true });
}

window.onload = function() {
    const image = document.getElementById("homeImg"); // Replace with your image's ID
    image.classList.add("imageAnimation"); // Add the class that triggers the animation
};