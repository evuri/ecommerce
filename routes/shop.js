const express = require('express');
const router = express.Router();

const { create, shopById, read, update, remove, list, userShop, shopByName } = require('../controllers/shop');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/shop/:shopId', read);
router.post('/shop/create/:userId', requireSignin, isAuth, isAdmin, create);
// router.put('/category/:categoryUpdateId/:userId', requireSignin, isAuth, isAdmin, update);
router.put('/shop/:shopId/:userId', requireSignin, isAuth, isAdmin, update);

router.delete('/shop/:shopId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/shops', list);

router.get('/shops/by/user/:userId', requireSignin, isAuth, isAdmin, userShop);

router.post('/shops/by/name/' ,shopByName);


router.param('shopId', shopById);
router.param('userId', userById);

module.exports = router;
