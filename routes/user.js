const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin, isOwner } = require('../controllers/auth');

const { userById, read, update, purchaseHistory, userByMail } = require('../controllers/user');

router.get('/secret', requireSignin, (req, res) => {
    res.json({
        user: 'got here yay'
    });
});
router.post('/user/userByMail', requireSignin, isAuth, isAdmin)
router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);

router.param('userId', userById);

module.exports = router;
