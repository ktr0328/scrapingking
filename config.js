module.exports = {
  per_hour: 2, // 何時間置きにデータを取りに行くか
  file_name: 'result.json', // 保存するファイル名
  file_encoding: 'utf-8',
  puppeteer: {
    headless: true, // headless mode T or F
    slowMo: 0 // puppeteerの１挙動の遅延。headless: falseにして slowMo: 100とかにすると、キーボードタイプしてるのが見えるようになる。
  }
}
