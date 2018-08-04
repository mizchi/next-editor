const path = require("path")
const puppeteer = require("puppeteer")
const rimraf = require("rimraf")

const buildCaptureTestId = page => {
  let cnt = 0
  return async id => {
    console.log("start", id)
    await page.waitForSelector(`[data-testid=${id}]`)
    await page.screenshot({
      path: path.join(
        __dirname,
        `screenshots/${cnt.toString().padStart(2, "0")}-${id}.png`
      )
    })
    cnt++
  }
}

const test = async () => {
  // setup
  await rimraf.sync(path.join(__dirname, "screenshots/*"))
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const capture = buildCaptureTestId(page)

  // run
  await page.goto("http://localhost:8099/")
  await capture("body")
  await capture("main")
  await capture("commit-all-button")

  await browser.close()
}

test()
