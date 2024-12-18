const modal = document.getElementById("popup");
const closeBtn = document.getElementById("close");
const quit = document.getElementById("quit");

closeBtn.onclick = function() {
    modal.classList.add("closingAnimation")
}

quit.onclick = function() {
    modal.classList.add("closingAnimation")
}