const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/', UserController.createUser)
router.post('/signin', UserController.loginUser)
router.post('/request', UserController.requestMember)

router.get('/group_status/', UserController.userStatus)

router.get('/', UserController.findAll)
router.get('/:username', UserController.findUser)
router.get('/make/bulk', UserController.bulkMake)
router.get('/my_circles/:userId', UserController.userCircles)





module.exports = router;
