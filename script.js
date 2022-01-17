// let counts = JSON.parse(localStorage.getItem("counts")) ?? []

let keys = Object.keys(localStorage).sort()

let showCount = 0

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
  const title = document.createElement("h3")
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
  let ol = document.createElement("ol")
  logContainer.innerHTML = ""
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
    showCount = newCount.className.match(/count-(\d)*/)[1]
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

function toggleMenu() {
  const logDiv = document.getElementsByClassName(`log-${showCount}`)[0]
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

let ticking = false
let waiting = false
let prevDelta = 0

function debounce(delay, f) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timerId = setTimeout(() => {
      f(...args)
      timer = null
    }, delay);
  }
}
const wheelHandler = (e) => {
  e.preventDefault()
  e.stopPropagation()

  if (!ticking) {
    window.requestAnimationFrame(function() {
      if (prevDelta < Math.abs(e.deltaX) && !waiting) {
        waiting = true
        console.log(e.deltaX)
        console.log(e.deltaY)
        let biggerDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
        if (biggerDelta > 0) {
          if (showCount<keys.length-1) {
            closeLogs()
            showCount++
            document.getElementsByClassName(`count-${showCount}`)[0].scrollIntoView({behavior: "smooth"})
            
          }
        } else if (e.deltaX < 0 || e.deltaY < 0){
          if (showCount>0) {
            closeLogs()
            showCount--
            document.getElementsByClassName(`count-${showCount}`)[0].scrollIntoView({behavior: "smooth"})
          }
        }
        setTimeout(() => {
          waiting = false
        }, 300);
      }
      prevDelta = Math.abs(e.deltaX)
      ticking = false;
    })
  } 
  ticking = true
}
const debounceHandler = debounce(200, wheelHandler)
document.addEventListener("wheel", wheelHandler, { passive: false })


let xStart = null
let xEnd = null
document.addEventListener("touchstart", function(e) {
  xStart = e.changedTouches[0].screenX
}, false)
document.addEventListener("touchend", function(e) {
  xEnd = e.changedTouches[0].screenX
  if (Math.abs(xStart - xEnd)>10) {
    closeLogs()
    if (xStart > xEnd) {
      if (showCount<keys.length-1) {
        showCount++
        document.getElementsByClassName(`count-${showCount}`)[0].scrollIntoView({behavior: "smooth"})
      }
    } else {
      if (showCount>0) {
        showCount--
        document.getElementsByClassName(`count-${showCount}`)[0].scrollIntoView({behavior: "smooth"})
      }
    }
  }
  },false)