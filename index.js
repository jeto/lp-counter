function forceSWupdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.update()
        console.log("Updated SW")
      }
    })
  }
}
forceSWupdate()

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(registration => {
    console.log("SW Registered!")
    console.log(registration)
  }).catch(error => {
    console.log("SW Registration Failed!")
    console.log(error)
  })
}
