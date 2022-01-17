let counts = JSON.parse(localStorage.getItem("counts")) ?? []

updateCount()

function updateCount() {
  document.getElementById("count").innerHTML = counts.length
  updateList()
}

function increment() {
  counts.push((new Date()).getTime())
  localStorage.setItem("counts", JSON.stringify(counts))
  updateCount()
}

function decrement() {
  counts.pop()
  localStorage.setItem("counts", JSON.stringify(counts))
  updateCount()
}

function remove(timestamp) {
  console.log(timestamp)
  const date = new Date(timestamp).toLocaleString()
  if (confirm(`Do you want to delete ${date}?`) == true) {
    counts = counts.filter(count => count !== timestamp)
    localStorage.setItem("counts", JSON.stringify(counts))
    updateCount()
  }
}

function toggleMenu() {
  const countDiv = document.getElementById("counts")
  if (countDiv.style.visibility === "hidden") {
    countDiv.style.visibility = "visible"
  } else {
    countDiv.style.visibility = "hidden"
  }
}

function updateList() {
  let ol = document.getElementById("list")
  ol.innerHTML = ''
  for(timestamp of counts) {
    const date = new Date(timestamp).toLocaleString()
    const li = document.createElement('li')
    const del = document.createElement('button')
    del.innerHTML = "X"
    del.className = "delete"
    del.setAttribute("onClick", `javascript: remove(${timestamp})`)
    li.innerHTML = date
    li.appendChild(del)
    li.id = timestamp
    ol.appendChild(li)
  }
}
