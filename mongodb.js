// CRUD create read update delete 
const mongodb= require('mongodb')
const MongoClient=mongodb.MongoClient

const ConnectionURL='mongodb://127.0.0.1:27017'
const databaseName ='task-manager'

MongoClient.connect(ConnectionURL,{ useNewUrlParser:true }, (error,client)=>{
    if(error)
    {
        return console.log('Unable to connect')
    }
    // const db=client.db(databaseName)

    // db.collection('users').insertOne({
    //     name:'Rishabh',
    //     age:23 
    // })
    console.log('fdfd')
})