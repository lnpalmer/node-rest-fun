import express from 'express'
import bodyParser from 'body-parser'
const uuidV1 = require('uuid/v1')

import RESTFile from './resources/RESTFile'
RESTFile.initialize()

// set up express
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.port || 8080
const router = express.Router()

// set up route for file collection

// collection-level actions
router.route('/files')

  .get((req, res) => { // GET - get a list of all resources
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


// listen for incoming requests
app.use('/api', router)
app.listen(port)

// save shared collection data upon exit
process.on('SIGINT', () => {
  RESTFile.deinitialize()
  process.exit()
})
