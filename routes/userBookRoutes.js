const express = require('express');
const userBookController = require('../controllers/userBookController');
//const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/', userBookController.createUserBook);
router.get('/', userBookController.getUserBooks);
router.get('/:id', userBookController.getUserBook);
router.put('/:id', userBookController.updateUserBook);
router.delete('/:id', userBookController.deleteUserBook);

module.exports = router;