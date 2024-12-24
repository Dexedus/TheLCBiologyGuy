const modal = document.getElementById("popup");
const closeBtn = document.getElementById("close");
const quitBtn = document.getElementById("quit");

closeBtn.onclick = function() {
    modal.classList.add("closingAnimation")
}

quitBtn.onclick = function() {
    modal.classList.add("closingAnimation")
}
