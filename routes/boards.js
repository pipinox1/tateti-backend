var express = require('express');
var router = express.Router();
var repository = require('../repository/boards-repository');

router.get('/',
  async (req, res) => {
    try {
      var boards = await repository.get_boards()
      res.json({
        status: 200,
        message: 'success',
        response: boards,  
      });
    } catch (error) {
      res.json({
        status: error.code,
        message: error.message 
      })
    }
})

router.route('/:id').get(
  async (req, res) => {
    var board = await repository.get_board(req.params.id)
    try {
      res.json({
        status: 200,
        message: 'success',
        response: board
      }); 
    } catch (error) {
      res.json({
        status: error.code,
        message: error.message 
      })
    }       
})

router.route('/:player_id').post(
  async (req, res) => {
    try {
      let result = await repository.create_board(req.params.player_id)
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
})

router.route('/move/:board_id').put(
  async (req, res) => {
    try {
      await repository.make_move(req.body,req.params.board_id)
      res.json({
        status: 200,
        message: "moved"
      });
    } catch (error) {
      res.json({
        status: error.code,
        message: error.message 
      })
    }
})

module.exports = router;
