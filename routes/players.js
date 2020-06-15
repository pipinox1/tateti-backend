var express = require('express');
var router = express.Router();
var repository = require('../repository/players-repository');

router.get('/', 
    async (req, res) => {
        try {
            players = await repository.get_players()
            res.json({
                status: 200,
                message: "success",
                response: players,
            });            
           
        } catch (error) {
            res.json({
                status: error.code,
                message: error.message 
              })
        }
})


router.post('/:name',
    async (req, res) => {
        try {
            let result = await repository.create_player(req.params.name)
            res.json({
                status: 201,
                message: "created",
                response: result
            });
        } catch (error) {
            res.json({
                status: error.code,
                message: error.message 
              })
        }
    }
  )

router.get('/:id',
    async (req, res) => {
        try {
            let player = await repository.get_player(req.params.id)
            res.json({
                status: 200,
                message: "success",
                response: player,
            });
        } catch (error) {
            res.json({
                status: error.code,
                message: error.message 
              })  
        }
    }
)
 
  module.exports = router;