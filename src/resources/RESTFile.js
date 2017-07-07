import fs from 'fs'

// file resource for a RESTful API
class RESTFile {

  static storageRoot() { return './files' }

  // load any necessary data to interact with the collection
  static initialize() {

    const indexPath = RESTFile.storageRoot() + '/index.json'

    if (fs.existsSync(indexPath)) {
      RESTFile.indexJSON = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    } else {
      RESTFile.indexJSON = {}
    }

  }

  // save any additional collection data
  static deinitialize() {

    const indexPath = RESTFile.storageRoot() + '/index.json'

    fs.writeFileSync(indexPath, JSON.stringify(RESTFile.indexJSON))

  }

  // list the collection's resources
  static enumerate() {

    // only list collection IDs, since the full contents of all files would be too large
    return Object.keys(RESTFile.indexJSON)

  }

  // load a RESTFile from its id
  static load(id) {

    const { fileName } = RESTFile.indexJSON[id]
    const filePath = RESTFile.storageRoot() + '/' + id + '/' + fileName
    const data64 = new Buffer(fs.readFileSync(filePath, 'utf8')).toString('base64')

    return new RESTFile(id, fileName, data64)

  }

  // remove the RESTFile with id [id]
  static remove(id) {

    delete RESTFile.indexJSON[id]
    rimraf(RESTFile.storageRoot() + '/' + id, error => {
      console.log('[rimraf] error: ' + error)
    })

  }

  // save the RESTFile to the data backend
  save() {

    RESTFile.indexJSON[this.id] = {
      id: this.id,
      fileName: this.fileName
    }

    fs.mkdirSync(RESTFile.storageRoot() + '/' + this.id)
    fs.writeFileSync(
      RESTFile.storageRoot() + '/' + this.id + '/' + this.fileName,
      new Buffer(this.data, 'base64')
    )

  }

  // update a RESTFile
  update() { this.save() }

  constructor(id, fileName, data64) {

    this.id = id
    this.fileName = fileName
    this.data = data64

  }

}

export default RESTFile
