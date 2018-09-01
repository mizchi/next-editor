const IS_LOCALHOST = location.href.indexOf("localhost") > -1
const USE_SW = !IS_LOCALHOST

const contentEl = document.querySelector(".content-skeleton")
let isFirstInstall = navigator.serviceWorker.controller == null

let modal = null
function showReloadModal() {
  if (modal == null) {
    modal = document.createElement("div")
    document.body.appendChild(modal)
    modal.style.position = "absolute"
    modal.style.outline = "1px solid black"
    modal.style.right = "10px"
    modal.style.bottom = "10px"
    modal.style.padding = "10px"
    modal.style.backgroundColor = "#fff"
  }

  modal.innerHTML = `
    <div style='width: 230px; height: 20px; font-family: Georgia;'>
      New version available! <button onclick="location.reload()">Reload</button>
    </div>
  `
}

;(async () => {
  try {
    // SW
    if (USE_SW) {
      contentEl.innerHTML = "Checking service-worker..."
      console.time("loading:sw")

      // start sw handling
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (isFirstInstall) {
          isFirstInstall = false
        } else {
          showReloadModal()
        }
      })

      const reg = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready
      // start sw check
      setInterval(() => reg.update(), IS_LOCALHOST ? 3 * 1000 : 5 * 60 * 1000)

      console.timeEnd("loading:sw")
      contentEl.innerHTML = ""
    }

    // Plugin namespace
    window.NEPlugins = {}

    console.time("loading:main")
    await import(/* webpackIgnore: true */ "./main.js")
    console.timeEnd("loading:main")
  } catch (e) {
    // TODO: Show restore guide
    contentEl.textContent = "Something wrong: " + e.message
  }
})()
