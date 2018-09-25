const puppeteer = require('puppeteer')

const scraping = async () => {
  const URL = 'https://king.kcg.kyoto/campus/Course/Home'
  const user = process.env.USER_ID
  const password = process.env.PASSWORD

  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 10 // 遅延時間
  })
  const page = await browser.newPage()
  await page.goto(URL, {
    waitUntil: 'domcontentloaded'
  })
  // ![img](hoge.svg)
  await page.type('#TextLoginID', user)
  await page.type('#TextPassword', password)
  await page.waitFor(1000)
  await page.click('#buttonHtmlLogon')
  await page.goto(URL, {
    waitUntil: 'domcontentloaded'
  })
  await page.waitFor(2000)

  const marge = (texts, dates, deadlines) => {
    const result = []
    for (let i = 0; i < texts.length; i++) {
      const tmp = {
        text: texts[i],
        date: dates[i]
      }
      if (deadlines) {
        tmp.deadlines = deadlines[i]
      }
      result.push(tmp)
    }
    return result
  }

  const contents_texts = await page.$$eval('#place-contents > li > a.gadget-item-text.bold > div', contents => {
    return contents.filter((v, i) => i < 20).map(e => e.innerHTML)
  })
  const contents_dates = await page.$$eval('#place-contents > li > div', dates => {
    return dates.filter((v, i) => i < 20).map(e => e.innerHTML).map(e => e.replace(/<.+>$/, ''))
  })
  const contents = marge(contents_texts, contents_dates)

  const reports_texts = await page.$$eval('#place-reports > li > a.gadget-item-text.bold > div', reports => {
    return reports.map(e => e.innerHTML)
  })
  const reports_dates = await page.$$eval('#place-reports > li > div.gadget-item-date', dates => {
    return dates.map(e => e.innerHTML)
  })
  const reports_deadlines = await page.$$eval('#place-reports > li > div.gadget-item-text.tags > span', deadline => {
    return deadline.map(e => e.innerHTML)
  })
  const reports = marge(reports_texts, reports_dates, reports_deadlines)

  const announcements_texts = await page.$$eval('#place-announcements > li > a.gadget-item-text.bold > div', texts => {
    return texts.map(e => e.innerHTML)
  })
  const announcements_dates = await page.$$eval('#place-announcements > li > div', dates => {
    return dates.map(e => e.innerHTML)
  })
  const announcements = marge(announcements_texts, announcements_dates)

  await page.waitFor(1000)
  await browser.close()

  const result = {}
  result.reports = {
    description: `レポート(${reports.length})`,
    data: reports
  }
  result.contents = {
    description: `学習教材(${contents.length})`,
    data: contents
  }
  result.announcements = {
    description: `お知らせ(${announcements.length})`,
    data: announcements
  }

  return result
}

const getData = async () => {
  const data = await scraping()
  return data
}

getData().then(e => {
  require('fs').writeFile('./result.json', JSON.stringify(e, null, 2), 'utf-8', err => {
    if (err) console.log(err)
  })
}).then(() => console.log('succeeded!')).catch(err => console.log(err))
