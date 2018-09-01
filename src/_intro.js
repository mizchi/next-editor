const IS_LOCALHOST = location.href.indexOf("localhost") > -1
const USE_SW = !IS_LOCALHOST

const contentEl = document.querySelector(".content-skeleton")
let isFirstInstall = navigator.serviceWorker.controller == null

let modal = null
function showUpgradeModal() {
  if (modal == null) {
    modal = document.createElement("div")
    document.body.appendChild(modal)
  }

  modal.innerHTML = `
    <div style='position: absolute; outline: 1px solid black; right: 10px; bottom: 10px; width: 350px; height: 50px; background: white; padding: 10px; font-family: Georgia;'>
      <div>New version available!</div>
      <span>It will be applied from the next</span> - <button onclick="location.reload()">Reload</button>
    </div>
  `
}

async function setupServiceWorker() {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (isFirstInstall) {
      isFirstInstall = false
    } else {
      showUpgradeModal()
    }
  })

  const reg = await navigator.serviceWorker.register("/sw.js")
  await navigator.serviceWorker.ready
  // start sw check
  setInterval(() => reg.update(), IS_LOCALHOST ? 3 * 1000 : 5 * 60 * 1000)
}

;(async () => {
  try {
    // SW
    if (USE_SW) {
      contentEl.innerHTML = "Checking service-worker..."
      console.time("loading:sw")
      await setupServiceWorker()
      console.time("loading:sw")
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
