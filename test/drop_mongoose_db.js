var mongoose = require('mongoose')
var sleep = 10
var connected = false

mongoose.connection.on('open', function () {
  console.log('DB Connected')
  connected = true
})

module.exports = function dropMongooseDB (done) {
  // wait till we have a connection then drop the db, sleep between each check
  if (connected) {
    console.log('Dropping DB')
    mongoose.connection.db.dropDatabase(function(err){
      // mongoose doesn't seem to clear it's cache straight away so we delay - TODO. find a better solution to this
      setTimeout(done, 1000)
    })
  } else {
    setTimeout(function () {
      dropMongooseDB(done)
    }, sleep)
  }
}
