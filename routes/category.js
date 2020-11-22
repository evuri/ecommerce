const express = require('express');
const router = express.Router();

const { create, categoryById, read, update, remove, list } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin, isOwner } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, isOwner, create);
// router.put('/category/:categoryUpdateId/:userId', requireSignin, isAuth, isAdmin, update);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, isOwner , update);

router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, isOwner, remove);
router.get('/categories', list);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
