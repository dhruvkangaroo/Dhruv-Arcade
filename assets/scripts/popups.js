const openInstructions = document.getElementById("instructions")
const closeInstructions = document.getElementById("close-pop-up")

const openMenu = document.getElementById("open-menu")
const closeMenu = document.getElementById("close-menu")

openMenu.addEventListener("click", () => {
    document.querySelector(".menu-pop-up").style.display="block"
})
closeMenu.addEventListener("click", () => {
    document.querySelector(".menu-pop-up").style.display="none"
})

openInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="block"
})
closeInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="none"
})