const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { errors } = require('pg-promise')
const puppeteer = require('puppeteer')

const secret = process.env.JWT_SECRET
const router = express.Router()
async function fetchDataWithPuppeteer(url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)

  // Make sure to wait for any client-side JavaScript to execute
  await page.waitForTimeout(3000)

  const html = await page.content()
  await browser.close()
  return html
}

router.post('/tesco', async (req, res) => {
  const url = req.body.url

  if (!url) {
    return res.status(400).send({ error: 'URL is required' })
  }

  try {
    const products = await extractData(url)
    res.send(products)
  } catch (error) {
    console.error('Error fetching and parsing data:', error)
    res.status(500).send({ error: 'Failed to fetch and parse data' })
  }
})

async function fetchData(url) {
  const response = await axios.get(url, {
    timeout: 4000,
  })
  return response.data
}

async function extractData(url) {
  const html = await fetchData(url)
  const $ = cheerio.load(html)

  const products = []
  const allImages = []
  $('img.product-image').each(function () {
    allImages.push($(this).attr('src'))
  })
  // console.log(html)
  $('.product-details--wrapper').each((index, element) => {
    const productImage = allImages[index]

    const productName = $(element).find('h3').text()
    const price = $(element).find('p').text()
    const pricePerUnit = $(element).find('p').text()
    const url = $(element)
      .find('a[data-auto="product-tile--title"]')
      .attr('href')
    const company = 'tesco'
    products.push({
      productImage,
      productName,
      price,
      pricePerUnit,
      url,
      company,
    })
  })

  return products
}

// router.get('/sainsbury', async (req, res) => {
//   const url = req.body.url
//   const data1 = fetchDataWithPuppeteer(url)
//   console.log(data1, 'data 1 this is')
//   async function fetchData(url) {
//     try {
//       const response = await axios.get(url)
//       return response.data
//     } catch (error) {
//       console.error('Error fetching the data', error)
//     }
//   }

//   async function extractProductDataFromURL(url) {
//     const html = await fetchData(url)
//     const $ = cheerio.load(html)
//     console.log(html)

//     const products = []

//     // For each product item in the list
//     $('li.pt-grid-item').each((index, element) => {
//       const productName = $(element)
//         .find('h2.pt__info__description a.pt__link')
//         .text()
//         .trim()
//       const productPrice = $(element)
//         .find('.pt__cost__retail-price')
//         .text()
//         .trim()
//       const productUnitPrice = $(element)
//         .find('.pt__cost__unit-price-per-measure')
//         .text()
//         .trim()

//       products.push({
//         productName,
//         productPrice,
//         productUnitPrice,
//       })
//     })

//     return products
//   }

//   extractProductDataFromURL(url).then((data) => {
//     console.log('hellop')
//     console.log(JSON.stringify(data, null, 2))
//   })
// })

router.get('/sainsbury', async (req, res) => {
  const url = req.body.url

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Navigate to the page
  await page.goto(url)

  // Optionally, wait for some selector to be loaded
  await page.waitForSelector('li.pt-grid-item')

  // Get HTML content after JS has been executed
  const html = await page.content()

  await browser.close()

  const $ = cheerio.load(html)

  const products = []

  // For each product item in the list
  $('li.pt-grid-item').each((index, element) => {
    const productName = $(element)
      .find('h2.pt__info__description a.pt__link')
      .text()
      .trim()
    const productPrice = $(element)
      .find('.pt__cost__retail-price')
      .text()
      .trim()
    const productUnitPrice = $(element)
      .find('.pt__cost__unit-price-per-measure')
      .text()
      .trim()

    products.push({
      productName,
      productPrice,
      productUnitPrice,
    })
  })

  console.log(JSON.stringify(products, null, 2))
  // You can also send the result back to the client
  res.json(products)
})
router.post('/superdrug', async (req, res) => {
  try {
    const url = req.body.url

    const response = await axios.get(url, {
      timeout: 5000, // Adding a 4-second timeout as previously discussed
    })

    const $ = cheerio.load(response.data)
    const products = []

    $('mp-product-list-item').each((index, element) => {
      const product = {
        productImage: $(element)
          .find('.cx-product-image img')
          .attr('data-srcset')
          .split(' ')[0],
        productName: $(element).find('.cx-product-name').text().trim(),
        price: $(element).find('meta[itemprop="price"]').attr('content'),
        pricePerUnit: $(element).find('.price__per-unit').text().trim(),
        url: $(element)
          .find('.product-list-item__info .cx-product-name')
          .attr('href'),
        company: 'superdrug',
      }

      products.push(product)
    })

    res.json(products)
  } catch (error) {
    console.error('Error fetching the URL:', error)
    res.status(500).send('Internal Server Error')
  }
})

router.get('/boots', async (req, res) => {
  const url = req.body.url // Replace with the actual URL

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Navigate to the page
  await page.goto(url)

  // Wait for the dynamic content to load
  await page.waitForSelector('.ais-Hits-item')

  // Get the rendered HTML
  const content = await page.content()

  // Close the browser
  await browser.close()

  // Load content into cheerio
  const $ = cheerio.load(content)
  // Extract the data
  const name = $('.ais-Hits-item .offerName').text() // Replace .offerName with the actual class or ID that contains the name
  const price = $('.ais-Hits-item .currentPrice').text() // Replace .currentPrice with the actual class or ID that contains the price

  console.log(`Name: ${name}`)
  console.log(`Price: ${price}`)
})
// router.get('/boots', async (req, res) => {
//   const url = req.body.url // Replace with the actual URL

//   async function fetchProductDetails(url) {
//     try {
//       const headers = {
//         'User-Agent':
//           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//         Accept:
//           'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//       }

//       const response = await axios.get(url, { headers })
//       const htmlContent = response.data
//       const $ = cheerio.load(htmlContent)
//       console.log(htmlContent, 'check the html')

//       const products = []

//       $('.estore_product_container').each((index, element) => {
//         const productDetails = {}
//         const productElement = $(element)

//         productDetails.productName = productElement
//           .find('.product_name a')
//           .attr('title')
//         productDetails.productLink = productElement
//           .find('.product_name a')
//           .attr('href')
//         productDetails.productImgLink = productElement
//           .find('.product_image a')
//           .attr('href')
//         productDetails.productImgSrc = productElement
//           .find('.product_image img')
//           .attr('src')
//         productDetails.productImgAlt = productElement
//           .find('.product_image img')
//           .attr('alt')
//         productDetails.rating = productElement
//           .find('.product_rating .rating5')
//           .attr('title')
//         productDetails.reviewCount = productElement
//           .find('.product_review_count')
//           .text()
//           .replace(/[\(\)]/g, '')
//           .trim()
//         productDetails.price = productElement
//           .find('.product_price')
//           .text()
//           .trim()
//         productDetails.pricePerUnit = productElement
//           .find('.price')
//           .text()
//           .trim()
//         productDetails.productId = productElement.attr('data-productid')
//         productDetails.objectId = productElement.attr('data-object-id')

//         products.push(productDetails)
//       })

//       return products
//     } catch (error) {
//       console.error('Error fetching the URL:', error)
//       return null
//     }
//   }

//   fetchProductDetails(url).then((products) => {
//     console.log(products)
//   })
// })
module.exports = router
