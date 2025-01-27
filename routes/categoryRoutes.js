const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

//create
router.post('/', categoryController.createcategory);

//update
router.put('/:id', categoryController.updatecategory);

//get all
router.get('/', categoryController.getcategorys);

//get one
router.get('/:id', categoryController.getcategory);

//delete
router.delete('/:id', categoryController.deletecategory);

//search by name
router.get('/search', categoryController.searchcategories);

//get with pagination
router.get('/pagination', categoryController.getCategoriesWithPagination);

module.exports = router;