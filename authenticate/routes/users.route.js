const express = require('express')
const router = express.Router()

const userController = require('../controllers/users.controller')

router.post('/signup', userController.userRegistration)
router.get('/:id', userController.getUserInfos)
router.put('/:id', userController.updateUser)
router.put('/:id', userController.addSocial)
router.delete('/:id', userController.deleteSocial)
router.delete('/id', userController.deleteUser)
router.post('/signin', userController.signIn)

module.exports = router;