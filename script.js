// let counts = JSON.parse(localStorage.getItem("counts")) ?? []

let keys = Object.keys(localStorage).sort()

function drawCounts() {
  console.log("drawingcounts")
  keys = Object.keys(localStorage).sort()
  const container = document.getElementById("flex-container")
  container.style.width = `${keys.length*100}%`
  container.innerHTML = ""
  let i = 0
  for (id of keys) {
    drawCountElement(id, i)
    drawLogElement(id, i)
    drawLogs(id)
    i++
  }
}

function drawCountElement(id, i) {
  const container = document.getElementById("flex-container")
  arr = JSON.parse(localStorage.getItem(id))
  const title = document.createElement("h2")
  title.className = `title title-${id}`
  title.setAttribute("onClick", `javascript: toggleMenu("${id}")`)
  title.innerHTML = id
  const countElem = document.createElement("div")
  countElem.id = `count-${id}`
  countElem.className = `flex-child count-${i}`
  const amount = document.createElement("h1")
  amount.id = `amount-${id}`
  amount.innerHTML = arr.length
  const button = document.createElement("button")
  button.className = "mainbutton"
  button.innerHTML = "+"
  countElem.appendChild(title)
  countElem.appendChild(amount)
  countElem.appendChild(button)
  button.setAttribute("onClick", `javascript: increment("${id}")`)
  container.appendChild(countElem)
}

function drawLogElement(id, i) {
  let logContainer = document.createElement("div")
  logContainer.className = `log log-${i}`
  logContainer.id = `log-${id}`
  logContainer.style.visibility = "hidden"
  let ol = document.createElement("ol")
  logContainer.appendChild(ol)
  
  document.body.appendChild(logContainer)
}

function drawLogs(id) {
  let logs = JSON.parse(localStorage.getItem(id))
  const logContainer = document.getElementById(`log-${id}`)
  const title = document.createElement("span")
  title.innerHTML = id
  const remove = document.createElement("span")
  remove.className = "delete"
  remove.innerHTML = "&#128465;"
  remove.setAttribute("onClick", `javascript: removeCount("${id}")`)
  let ol = document.createElement("ol")
  logContainer.innerHTML = ""
  logContainer.appendChild(title)
  logContainer.appendChild(remove)
  logContainer.appendChild(ol)
  for(timestamp of logs) {
    const date = new Date(timestamp).toLocaleString()
    const li = document.createElement('li')
    const del = document.createElement('button')
    del.innerHTML = "X"
    del.className = "delete"
    del.setAttribute("onClick", `javascript: remove("${id}", ${timestamp})`)
    li.innerHTML = date
    li.appendChild(del)
    li.id = timestamp
    ol.appendChild(li)
  }
}

drawCounts()

function addCount() {
  const name = prompt("Add new count")
  if (name && !keys.includes(name)) {
    localStorage.setItem(name, JSON.stringify([]))
    drawCounts()
    const newCount = document.getElementById(`count-${name}`)
    newCount.scrollIntoView({behavior: "smooth"})
  }
}

function updateCount(id) {
  const counts = JSON.parse(localStorage.getItem(id))
  document.getElementById(`amount-${id}`).innerHTML = counts.length
  drawLogs(id)
}

function increment(id) {
  const counts = JSON.parse(localStorage.getItem(id))
  counts.push((new Date()).getTime())
  localStorage.setItem(id, JSON.stringify(counts))
  updateCount(id)
}

function remove(id, timestamp) {
  let counts = JSON.parse(localStorage.getItem(id))
  const date = new Date(timestamp).toLocaleString()
  if (confirm(`Do you want to delete ${date}?`) == true) {
    counts = counts.filter(count => count !== timestamp)
    localStorage.setItem(id, JSON.stringify(counts))
    drawCounts()
  }
}

function removeCount(id) {
  if (confirm(`Do you want to delete ${id}?`) == true) {
    localStorage.removeItem(id)
    closeLogs()
    drawCounts()
  }
}

function toggleMenu(id) {
  const logDiv = document.getElementById(`log-${id}`)
  if (logDiv.style.visibility === "hidden") {
    logDiv.style.visibility = "visible"
  } else {
    logDiv.style.visibility = "hidden"
  }
}

function closeLogs() {
  const logDivs = document.getElementsByClassName("log")
  for (log of logDivs) {
    log.style.visibility = "hidden"
  }
}

document.addEventListener(
  "click",
  function(event) {
    // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
    if (!event.target.matches(".title") && !event.target.closest(".log")) {
      closeLogs()
    }
  },
  false
)

document.addEventListener(
  "touchmove",
  function(event) {
    if (!event.target.closest(".log")) {
      console.log("touchevent")
      closeLogs()
    }
  },
  false
)