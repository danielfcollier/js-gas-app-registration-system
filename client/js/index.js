function afterPageLoad() {
    document.getElementById("title").textContent = "After Page Load Hello World";
}

document.addEventListener("DOMContentLoaded", afterPageLoad);