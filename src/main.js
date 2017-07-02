import express from 'express'
import bodyParser from 'body-parser'
const uuidV1 = require('uuid/v1')

import RESTFile from './resources/RESTFile'

RESTFile.initialize()

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.port || 8080
const router = express.Router()

router.route('/files')
  .get((req, res) => {

    res.json(RESTFile.enumerate())

  })
  .post((req, res) => {

    const id = uuidV1()
    const { fileName, data, metadata } = req.body
    const restFile = new RESTFile(id, fileName, data, metadata)
    restFile.save()

    res.json({ message: "file created" })

  })

router.route('/files/:file_id')
  .get((req, res) => {

    const id = req.params.file_id
    res.json(RESTFile.load(id))

  })
  .put((req, res) => {

    const id = req.params.file_id
    const { fileName, data, metadata } = req.body
    const restFile = new RESTFile(id, fileName, data, metadata)
    restFile.update()

    res.json({ message: "file updated" })

  })
  .delete((req, res) => {

    const id = req.params.file_id
    RESTFile.remove(id)
    res.json({ message: "file deleted" })

  })

app.use('/api', router)
app.listen(port)

process.on('SIGINT', () => {
  RESTFile.deinitialize()
  process.exit()
})
