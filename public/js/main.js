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










// Function to handle when an element comes into view
const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // You can add a class based on the element's ID or any other logic
        const id = entry.target.id;
  
        // Adding different classes based on element's ID
        if (id === 'reviewCard') {
          entry.target.classList.add('fadeFromBottom');
        } else if (id === 'reviewCard2') {
          entry.target.classList.add('fadeFromBottom2');
        } else if (id === 'reviewCard3') {
          entry.target.classList.add('fadeFromBottom3');
        } else if (id === 'storyTitle') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'storyText') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'storyImage') {
          entry.target.classList.add('fadeFromBottom3');
        } else if (id === 'storyText2') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'storyButton') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'testimonialTab') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'whatYouGetTitle') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'whatYouGet') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'offer') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'greenReview') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'accordionExample') {
          entry.target.classList.add('fadeFromBottom4');
        } else if (id === 'myStoryButton') {
          entry.target.classList.add('fadeIn');
        }
  
        // Stop observing the element once it's in view
        observer.unobserve(entry.target);
      }
    });
  };
  
  // Create the IntersectionObserver instance
// Define different observers with different thresholds
const defaultObserver = new IntersectionObserver(handleIntersection, { threshold: 0.2 });
const highThresholdObserver = new IntersectionObserver(handleIntersection, { threshold: 0.1 }); // Example: higher threshold

// Select all the elements you want to observe
document.querySelectorAll('.box').forEach(element => {
    // Apply a different observer based on element ID
    if (element.id === 'storyImage') {
        highThresholdObserver.observe(element);
    } else {
        defaultObserver.observe(element);
    }
});
  
  // Select all the elements you want to observe
  const elementsToObserve = document.querySelectorAll('.box');
  
  // Start observing each element
  elementsToObserve.forEach(element => {
    observer.observe(element);
  });
  