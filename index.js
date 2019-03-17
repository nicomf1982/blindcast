'use strcit'
const reddit = require('./reddit.js')
const redditFetcher = require('./redditFetcher')
const twitterFetcher = require ('./TwitterFetcher')
const facebookFetcher = require('./facebookFetcher')
const path = require('path')
const { facebook:fb, twitter:tw, reddit:rd } = require('./config/config')


const express = require ('express')
app = express()
app.use(express.static('./'))
var bodyParser = require('body-parser')
const router = express.Router()

router.get('/', (req, res, next) => {
  return res.sendFile(path.join(__dirname + '/index.html'));
})

/***********  All together */
router.post('/getitall', async (req, res, next) => {
  console.log(rd.avaible)
  console.log(tw.avaible)
  let fullArr =[]
  try {
    // if (rd.avaible){
      const _rd = await redditFetcher()
    // }
    // if (tw.avaible) {
      const _tw = await twitterFetcher()
    // }
    // if (_rd.avaible) {
      const _fb = await facebookFetcher()
    // }
    const all = [..._rd, ..._tw, ..._fb]
    return res
      .status(200)
      .type('json')
      .json(all)
  } catch(e){
    console.log(e)
  }
})


/*********** Reddit */
router.post('/getLastPostReddit', async (req, res, next) => {
  try {
    console.log('reddit')
    const subReddits = await redditFetcher()
    return res
      .status(200)
      .type('json')
      .json(subReddits)
  } catch (e) {
    next(e)
  }
})
router.post('/cbReddit', (req, res, next) => {
  console.log('cb de Reddit')
  return res
    .status(200)
    .send({
      payload: req.body
    })
})

/*********** Twitter */
router.post('/getLastPostTwitter', async (req, res, next) => {
  console.log('Twitter')
  try {
    const twitterPost = await twitterFetcher()
    return res
      .status(200)
      .type('json')
      .json(twitterPost)
  } catch (e) {
    next(e)
  }
})

router.post('/cbTwiter', (req, res, next) => {
  console.log('Twitter')
  return res
    .status(200)
    .send({
      payload: req.body
    })
})

/*********** Facebook */
router.post('/getLastPostFacebook', async (req, res, next) => {
  try {
    const facebookPost = await facebookFetcher()
    console.log('facebook')
    return res
      .status(200)
      .type('json')
      .send(facebookPost)
  } catch (e) {

  }
})

router.post('/cbFaceebook', (req, res, next) => {
  console.log('facebook')
  return res
    .status(200)
    .send({
      payload: req.body
    })
})

/*********** Linkedin */
router.get('/linkedin', (req, res, next) => {
  console.log('linkedin')
  return res
    .status(200)
    .send({
      vpayload: req.body
    })
})

router.post('/cbLinkedin', (req, res, next) => {
  console.log('linkedin')
  return res
    .status(200)
    .send({
      vpayload: req.body
    })
})


app.use('/', router)

app.listen(3000, () => {
  console.log('running on port 3000')
})