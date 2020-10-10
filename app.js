const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');
var http = require('http');
const app = express()
mongoose.connect('mongodb://localhost/multipal_image');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, browser_id");
 next();
})

const thingSchema = mongoose.Schema({
 
  imageUrl: { type: Array},

});

const model  = mongoose.model('Thing', thingSchema);
app.set('view engine', 'ejs')

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: { fileSize: 2 * 1024 * 1024 },
  })
)

app.get('/', async (req, res, next) => {
  res.render('index')
})

app.post('/multiple', async (req, res, next) => {
  try {
    const files = req.files.mFiles
// return
    // files.forEach(file => {
    //   const savePath = path.join(__dirname, 'public', 'uploads', file.name)
    //   await file.mv(savePath)
    // })

    // let promises = []
    // files.forEach((file) => {
    //   const savePath = path.join(__dirname, 'public', 'uploads', file.name)
    //   promises.push(file.mv(savePath))
    // })
let imageArry = []
    const promises = files.map((file) => {
      imageArry.push(file.name)
      const savePath = path.join(__dirname, 'public', 'uploads', file.name)
              return file.mv(savePath)      
    })
await Promise.all(promises)
    model.create({"imageUrl":imageArry})
            .then((success)=>{
              return file.mv(savePath)
            })
            .catch((err)=>{
              res.send('Image not save in DB')
            })
      
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.send('Error uploading files...')
  }
})

app.listen(3000, () => console.log('🚀 server on port 3000'))
