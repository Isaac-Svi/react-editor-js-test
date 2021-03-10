// packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// initialize app
const app = express()

// env vars
const { PORT, NODE_ENV } = process.env

// app middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())
app.use('/api/uploads', express.static(path.resolve('uploads')))

if (NODE_ENV === 'production') {
  const clientPath = path.resolve(__dirname, '..', 'client')
  app.use(express.static(path.resolve(clientPath, 'dist')))
}

// routes
app.get('/api/test', (_req, res) => {
  res.send({ msg: 'Proxy running' })
})

// file upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/'

    fs.access(dir, (err) => {
      if (err) {
        return fs.mkdir(dir, (error) => cb(error, dir))
      } else {
        return cb(null, dir)
      }
    })
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`)
  },
})

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb)
  },
})

app.post('/api/upload', upload.single('image'), (req, res) => {
  const url = '/api/' + req.file.path.replace(/\\/g, '/')

  res.send({
    success: 1,
    file: {
      url,
    },
  })
})

app.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`))
