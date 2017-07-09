import https from 'https'
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs-extra'
const uuidV1 = require('uuid/v1')

import RESTFile from './resources/RESTFile'
RESTFile.initialize()

// set up express
const app = express()
app.use(bodyParser.urlencoded({ limit: '3mb', extended: true }))

const port = process.env.port || 8443
const router = express.Router()

// set up route for file collection

// collection-level actions
router.route('/files')

  .get((req, res) => { // GET - get a list of all resources
    console.log("getting index!")
    try {

      res.json(RESTFile.enumerate())

    }
    catch(err) { res.json({ error: err.message }) }
  })

  .post((req, res) => { // POST - add a new resource
    try {

      const id = uuidV1()
      const { fileName, data } = req.body
      const restFile = new RESTFile(id, fileName, data)
      restFile.save()

      // send the ID of the newly created resource to the client
      res.json({ message: "file created", id: id })

    }
    catch(err) { res.json({ error: err.message }) }
  })

// resource-level actions
router.route('/files/:file_id')

  .get((req, res) => { // GET - get an individual resource
    try {

      const id = req.params.file_id
      res.json(RESTFile.load(id))

    }
    catch(err) { res.json({ error: err.message }) }
  })

  .put((req, res) => { // PUT - update a resource
    try {

      const id = req.params.file_id
      const { fileName, data } = req.body
      const restFile = new RESTFile(id, fileName, data)

      restFile.update()
      res.json({ message: "file updated" })

    }
    catch(err) { res.json({ error: err.message }) }
  })

  .delete((req, res) => { // DELETE - remove a resource from the collection
    try {

      const id = req.params.file_id
      RESTFile.remove(id)
      res.json({ message: "file deleted" })

    }
    catch(err) { res.json({ error: err.message }) }
  })

app.use('/api', router)

// configure HTTPS and listen for incoming requests
var httpsOptions = {
  key: fs.readFileSync('ssl/key.pem'),
  ca: fs.readFileSync('ssl/csr.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
}
https.createServer(httpsOptions, app).listen(port, '', null, () => {
  console.log('server listening on port ' + port)
})

// save shared collection data upon exit
process.on('SIGINT', () => {
  RESTFile.deinitialize()
  process.exit()
})
