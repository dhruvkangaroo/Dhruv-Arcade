const toggleBtn = document.getElementById("toggle-display")
let initialTheme = true;

const retrieveTheme = () => {
    const theme = localStorage.getItem("theme")
    if (theme == "alt") {
        initialTheme = false
        setColors()
    } else {
        initialTheme = true
        setColors()
    } 
}

const toggleColors = () => {
    const theme = localStorage.getItem("theme")
    if (theme == "alt") {
        localStorage.setItem("theme", "default")
        initialTheme = true
        setColors()
    } else {
        localStorage.setItem("theme", "alt")
        initialTheme = false
        setColors()
    }
}

const setColors = () => {   
  const root = document.documentElement;

  if (initialTheme) {
    root.style.setProperty("--primary-text", "#282828")
    root.style.setProperty("--secondary-text", "#25C40D")
    root.style.setProperty("--primary-background", "#EEF1DB")
    root.style.setProperty("--secondary-background", "#282828")
  } else {
    root.style.setProperty("--primary-text", "#25C40D")
    root.style.setProperty("--secondary-text", "#282828")
    root.style.setProperty("--primary-background", "#282828")
    root.style.setProperty("--secondary-background", "#EEF1DB")
  }
}

document.addEventListener("DOMContentLoaded", retrieveTheme)
toggleBtn.addEventListener("click", toggleColors)