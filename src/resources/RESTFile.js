import fs from 'fs-extra'

// file resource for a RESTful API
class RESTFile {

  // load any necessary data to interact with the collection
  static initialize() {

    const indexPath = RESTFile.storageRoot() + '/index.json'

    if (fs.existsSync(indexPath)) {
      RESTFile.indexJSON = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    } else {
      RESTFile.indexJSON = {}
    }

    if (!fs.existsSync(RESTFile.storageRoot())) fs.mkdirSync(RESTFile.storageRoot())

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

  // remove the RESTFile with id {id}
  static remove(id) {

    delete RESTFile.indexJSON[id]
    fs.removeSync(RESTFile.storageRoot() + '/' + id)

  }

  // save the RESTFile to the data backend
  save() {

    const fileDir = this.fileDir()
    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir)

    fs.writeFileSync(
      RESTFile.storageRoot() + '/' + this.id + '/' + this.fileName,
      new Buffer(this.data, 'base64')
    )

    RESTFile.indexJSON[this.id] = {
      id: this.id,
      fileName: this.fileName
    }

  }

  // update a RESTFile
  update() {

    fs.unlinkSync(this.filePath())

    this.save()

  }

  constructor(id, fileName, data) {

    this.id = id
    this.fileName = fileName
    // resource data is base64 encoded outside of the file system
    this.data = data

  }

  // root for file storage
  static storageRoot() { return './files' }

  // directory for an individual file
  fileDir() { return RESTFile.storageRoot() + '/' + this.id }

  // path for an individual file
  filePath() { return this.fileDir() + '/' + RESTFile.indexJSON[this.id].fileName }

}

export default RESTFile
