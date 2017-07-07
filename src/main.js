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

    res.json(RESTFile.enumerate())

  })
  .post((req, res) => { // POST - add a new resource

    const id = uuidV1()
    const { fileName, data, metadata } = req.body
    const restFile = new RESTFile(id, fileName, data, metadata)
    restFile.save()

    // send the ID of the newly created resource to the client
    res.json({ message: "file created", id: id })

  })

// resource-level actions
router.route('/files/:file_id')
  .get((req, res) => { // GET - get an individial resource

    const id = req.params.file_id
    res.json(RESTFile.load(id))

  })
  .put((req, res) => { // PUT - update a resource

    const id = req.params.file_id
    const { fileName, data, metadata } = req.body
    const restFile = new RESTFile(id, fileName, data, metadata)
    restFile.update()

    res.json({ message: "file updated" })

  })
  .delete((req, res) => { // DELETE - remove a resource from the collection 

    const id = req.params.file_id
    RESTFile.remove(id)
    res.json({ message: "file deleted" })

  })


// listen for incoming requests
app.use('/api', router)
app.listen(port)

// save shared collection data upon exit
process.on('SIGINT', () => {
  RESTFile.deinitialize()
  process.exit()
})
