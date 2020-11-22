const { Cart, CartItem } = require('../models/cart');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.cartById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if (err || !cart) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.cart = cart;
            next();
        });
};

exports.create = (req, res) => {
    console.log('CREATE CART: ', req.body);
    const cart = new Cart(req.body.cart);
    cart.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.updateOrderStatus = (req, res) => {
    Cart.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
};
