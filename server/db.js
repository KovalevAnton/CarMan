const MongoClient = require('mongodb').MongoClient;

let database, client

function db(){
  if(database){
    return Promise.resolve(database)
  }else{
    return new Promise((resolve, reject)=>{
      MongoClient.connect(process.env.DATABASE_URL, (err, dbClient)=> {
        if(err){
          console.log('connection error:', err, process.env.DATABASE_URL)
          reject(err)
        }else{
          client = dbClient
          database = client.db()
          resolve(database)
        }
      })
    })
  }
}

function close(){
  if(client){
    client.close()
  }
}

module.exports = {
  db,
  close
}
