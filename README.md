# api-tic-tac-toe

## DATABASE with Docker
> docker pull mongo
>
> docker run -d -p 27017-27019:27017-27019 --name mongodboards mongo

#### Mongo console
> docker exec -it mongodboards mongo

#### Create database with this command in mongo db console
> use (db name)

## Endpoints
host: localhost = 127.0.0.1
port: 9080
Port can be change in .env file

### GET /players

Get all existents players

### POST /players/{name}

Create a player by name

### GET /boards

Get all existents boards

### POST /boards/{player_id}

Creates a board with a player id

### PUT /boards/move

Make a move in the board
- body:

        {
          "board": {board_id},
          "player": {player_id},
          "move": {integer from 0 to 8}
        }
