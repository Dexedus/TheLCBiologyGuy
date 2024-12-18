const modal = document.getElementById("popup");
const closeBtn = document.getElementById("close");

closeBtn.onclick = function() {
    modal.classList.add("closingAnimation")
}