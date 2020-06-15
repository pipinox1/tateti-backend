const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
var players = require('./players-repository')
var dotenv = require('dotenv');
const { NotFoundError, BadRequestError, InternalError, ApiError } = require('../error/api-error')
dotenv.config()

const uri = process.env.DATABASE_URI
const db_name = process.env.DATABASE_NAME
const collection_name = 'boards'

var connect = async () => {
    console.log('Connecting to database: ', uri)
    return MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => {
            console.log('Connection error: ', err)
        })
}

var get_boards = async () => {
    var boards = []
    client = await connect()
    if (!client) {
        return boards
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        boards = await collection.find().toArray()
    } catch (error) {
        throw error
    } finally {
        client.close()
    }
    return boards
}

var get_board = async (id) => {
    var board
    client = await connect()
    if (!client) {
        return board
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        board = await collection.findOne({ _id: new mongo.ObjectID(id) })
        if (typeof board === 'undefined' || !board) {
            throw new NotFoundError(`Not Found board by id ${id}`)
        }
    } catch (error) {
        throw error
    } finally {
        client.close()
    }
    return board
}

var create_board = async (id) => {
    var player = await players.get_player(id)
    client = await connect()
    if (!client) {
        return
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        board = {
            "table_board": ["", "", "", "", "", "", "", "", ""],
            "player_x": player._id,
            "player_y": null,
            "turn": true,
            "finished": false,
            "winner": null,
            "draw": false
        }
        let result = await collection.insertOne(board)
        return result.ops[0]
    } catch (error) {
        throw error
    } finally {
        client.close()
    }
}

var make_move = async (move,board_id) => {
    var board = await get_board(board_id)
    if (board.finished) {
        throw new BadRequestError("The game with this board ID is now over.")
    }
    var player = await players.get_player(move.player)
    client = await connect()
    if (!client) {
        return
    }
    try {
        //This logic in a correct implementation should be in a service layer, 
        //but as this project is small so I choose to put some busissnes validation here
        if ((board.turn && (player._id == board.player_x)) || (!board.turn && (player._id == board.player_y))) {
            throw new BadRequestError("It isn't your turn")
        }
        var letter = board.turn ? "X" : "O"
        var moves = board.table_board
        var index = move.move
        var space = moves[index]
        var turn = board.turn
        //This logic in a correct implementation should be in a service layer, 
        //but as this project is small so I choose to put some busissnes validation here
        if (index < 0 || index > 8 || space != "") {
            throw new BadRequestError('Ilegal move')
        }
        moves[index] = letter
        var winning_result = check_winning(moves, board.player_x, board.player_y)
        update = {
            "table_board": moves,
            "turn": !turn,
            "finished": winning_result.finished,
            "winner": winning_result.winner,
            "draw": winning_result.draw
        }
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        await collection.updateOne({ _id: board._id }, { $set: update })
        board = await get_board(move.board)
        if (!board.player_o && !board.finished && !board.turn) {
            letter = "O"
            moves = board.table_board
            index = get_machine_move(moves)
            moves[index] = letter
            turn = board.turn
            winning_result = check_winning(moves, board.player_x, board.player_y)
            update = {
                "table_board": moves,
                "turn": !turn,
                "finished": winning_result.finished,
                "winner": winning_result.winner,
                "draw": winning_result.draw
            }
            await collection.updateOne({ _id: board._id }, { $set: update })
        }
    } catch (error) {
        throw error
    } finally {
        client.close()
    }
}

const get_machine_move = (moves) => {
    var emptyes = []
    for (let index = 0; index < moves.length; index++) {
        const element = moves[index]
        if (element == "") {
            emptyes.push(index)
        }
    }
    var random_index = Math.floor(Math.random() * emptyes.length)
    return emptyes[random_index]
}

const check_winning = (moves, player_x, player_o) => {
    var finished = check_board_complete(moves)
    let res = check_match(moves)
    let winner = null
    let draw = false
    if (res == "X") {
        finished = true
        winner = player_x
    } else if (res == "O") {
        finished = true
        winner = player_o
    } else if (finished){
        draw = true
    }
    return {
        finished: finished,
        winner: winner,
        draw: draw
    }
}

const check_board_complete = (moves) => {
    var flag = true;
    moves.forEach(element => {
        if (element != "X" && element != "O") {
            flag = false;
        }
    });
    return flag
}

const check_match = (moves) => {
    for (i = 0; i < 9; i += 3) {
        if (check_line(moves, i, i + 1, i + 2)) {
            return moves[i];
        }
    }
    for (i = 0; i < 3; i++) {
        if (check_line(moves, i, i + 3, i + 6)) {
            return moves[i];
        }
    }
    if (check_line(moves, 0, 4, 8)) {
        return moves[0];
    }
    if (check_line(moves, 2, 4, 6)) {
        return moves[2];
    }
    return "";
};

const check_line = (moves, a, b, c) => {
    return (
        moves[a] == moves[b] &&
        moves[b] == moves[c] &&
        (moves[a] == "X" || moves[a] == "O")
    )
}

module.exports = {
    get_boards: get_boards,
    get_board: get_board,
    create_board: create_board,
    make_move: make_move
}