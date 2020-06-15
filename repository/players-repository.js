const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
var dotenv = require('dotenv');
const {NotFoundError, BadRequestError, InternalError, ApiError} = require('../error/api-error')
dotenv.config()

const uri = process.env.DATABASE_URI
const db_name = process.env.DATABASE_NAME
const collection_name = 'players'

var connect = async () => {
    console.log('Connecting to database: ', uri)
    return MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {
        console.log('Connection error: ', err)
    })
}

var get_players = async () => {
    var players = []
    client = await connect()
    if (!client) {
        return player
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        players = await collection.find({}).toArray()
    } catch (error) {
        throw error
    } finally {
        client.close()
    }
    return players
}

var get_player = async (id) => {
    var player
    client = await connect()
    if (!client) {
        return player
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        player = await collection.findOne({_id: new mongo.ObjectID(id)})
        if (typeof player === 'undefined' || !player){
            throw new NotFoundError(`Not Found player by id ${id}`)
        }
    } catch (error) {
        throw error
    } finally {
        client.close()
    }
    return player
}

var create_player = async (name) => {
    if (!name && typeof name === 'string'){
        throw new BadRequestError('Bad Request, invalid name')
    }
    client = await connect()
    if (!client) {
        return 
    }
    try {
        var player = {
            "name": name
        }
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        let result = await collection.insertOne(player)
        return result.ops[0]
    } catch (error) {
        throw error
    } finally {
        client.close()
    }
}

module.exports = {
    create_player: create_player, 
    get_player: get_player,
    get_players: get_players
}