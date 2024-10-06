
let play = document.getElementById("play")
let tutorial = document.getElementById("tutorial")

play.addEventListener("click", () => {
  location.href = "play.html"
})

tutorial.addEventListener("click", () => {
  location.href = "tutorial.html"
})

backToMM.addEventListener("click", () => {
  location.href = "index.html"
})