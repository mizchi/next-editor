// This file is inline code in index.html to avoid cache
// Webpack Reloader does not work for this file

const contentEl = document.querySelector(".content-skeleton")

function setupBrowserFS() {
  return new Promise(resolve => {
    const script = document.createElement("script")
    script.src = "/assets/browserfs.min.js"
    script.onload = () => {
      BrowserFS.configure({ fs: "IndexedDB", options: {} }, err => {
        if (err) {
          throw err
        }
        resolve()
      })
    }
    document.head.appendChild(script)
  })
}

let modal = null
function showUpgradeModal() {
  if (modal == null) {
    modal = document.createElement("div")
    document.body.appendChild(modal)
  }

  if (installed) {
    modal.innerHTML = `
      <div style='position: absolute; outline: 1px solid black; right: 10px; bottom: 10px; width: 350px; height: 50px; background: white; padding: 10px; font-family: Georgia;'>
        <div>New version available!</div>
        <span>It will be applied from the next</span> - <button onclick="location.reload()">Reload</button>
      </div>
    `
  }
}

async function setupServiceWorker() {
  if (navigator.serviceWorker == null) {
    throw new Error("Your browser can not use serviceWorker")
  }

  let isFirstInstall = navigator.serviceWorker.controller == null

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (isFirstInstall) {
      isFirstInstall = false
    } else {
      const modal = document.createElement("div")
      modal.innerHTML = `
        <div style='position: absolute; outline: 1px solid black; right: 10px; bottom: 50px; width: 350px; height: 50px; background: white; padding: 10px;'>
          <div>New version available!</div>
          <span>It will be applied from the next</span> - <button onclick="location.reload()">Reload</button>
        </div>
      `
      document.body.appendChild(modal)
    }
  })

  const reg = await navigator.serviceWorker.register("/sw.js")
  await Promise.race([
    navigator.serviceWorker.ready,
    // NOTE: Sometimes(development only?) navigator.serviceWorker.ready is never ready.
    new Promise(resolve => {
      if (navigator.serviceWorker.controller) {
        return resolve()
      }
      navigator.serviceWorker.addEventListener("controllerchange", e =>
        resolve()
      )
    }),
    // NOTE: Start without service-worker after 5s
    new Promise(resolve => {
      setTimeout(() => {
        resolve()
        if (navigator.serviceWorker.controller == null) {
          console.warn("Start without service-worker")
        }
      }, 5000)
    })
  ])

  if (location.href.indexOf("localhost") > -1) {
    setInterval(() => {
      reg.update()
    }, 3 * 1000)
  } else {
    setInterval(() => {
      reg.update()
    }, 5 * 60 * 1000)
  }
}

async function setupFonts() {
  const font = new FontFace("Inconsolata", "url(/assets/Inconsolata.otf)")
  const loadedFace = await font.load()
  document.fonts.add(loadedFace)
}

const showLoadingMessage = (mes, loading = true) => {
  contentEl.innerHTML = [mes, loading ? '<div id="__loader"></div>' : ""].join(
    ""
  )
}

// Do not use yet
function loadState() {
  return JSON.parse(localStorage["persist:@:0"])
}

;(async () => {
  if (
    window.location.hostname !== "localhost" &&
    window.location.protocol === "http:"
  ) {
    window.location.href =
      "https://" + location.host + "/" + window.location.search
  }

  try {
    // SW
    if (window.location.hostname !== "localhost") {
      showLoadingMessage("Checking service-worker...")
      await setupServiceWorker()
    }
    contentEl.innerHTML = ""

    // Run
    await Promise.all([setupBrowserFS(), setupFonts()])

    // Plugin namespace
    window.NEPlugins = {}
    console.time("loading:main")

    // Lazy evaluation
    await import(/* webpackIgnore: true */ "./main.js")
    console.timeEnd("loading:main")
  } catch (e) {
    // TODO: Show restore guide
    showLoadingMessage("Something wrong: " + e.message, false)
  }
})()
