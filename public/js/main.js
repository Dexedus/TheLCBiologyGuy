const modal = document.getElementById("popup");
const closeBtn = document.getElementById("close");
const quit = document.getElementById("quit");

closeBtn.onclick = function() {
    modal.classList.add("closingAnimation")
}

quit.onclick = function() {
    modal.classList.add("closingAnimation")
}


// JavaScript to show the video after the user clicks 'Play'
document.getElementById('playButton').addEventListener('click', function() {
    // Hide the play button
    document.getElementById('playButton').style.display = 'none';

    // Show the TikTok video embed
    var iframe = document.getElementById('tiktokVideo');
    iframe.style.display = 'block';

    // Trigger autoplay by reloading the iframe with autoplay set to 1
    iframe.src = iframe.src.replace("autoplay=0", "autoplay=1");
});