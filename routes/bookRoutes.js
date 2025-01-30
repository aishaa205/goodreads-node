const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();


//post ->create , put -> update 

router.post('/', bookController.createBook);
router.get('/', bookController.getBooks);    
router.get('/filter', bookController.getBooksfilter);           
router.get('/:id', bookController.getBook);           
router.put('/:id', bookController.updateBook);     
router.delete('/:id', bookController.deleteBook);
module.exports = router;
