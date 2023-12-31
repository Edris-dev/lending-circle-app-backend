const express = require('express');
const router = express.Router();
const CircleController = require('../controllers/circleController');

// get all groups in DB
router.get('/findAll', CircleController.findAll)
router.get('/:groupId',CircleController.getGroupData)

//create a group
router.post('/create',CircleController.createCircle)
router.post('/:groupId', CircleController.memberResponse)


module.exports = router;
