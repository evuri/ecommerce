const Shop = require('../models/shop');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.shopById = (req, res, next, id) => {
    Shop.findById(id).exec((err, shop) => {
        if (err || !shop) {
            return res.status(400).json({
                error: 'Shop does not exist'
            });
        }
        req.shop = shop;
        next();
    });
};

exports.userShop = (req, res) => {
    Shop.find({ user: req.profile._id })
        .populate('user')
        .sort('-created')
        .exec((err, shops) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(shops);
        });
};

exports.shopByName = (req, res) => {
    Shop.find({ name: req.body.name })
        .populate('shop')
        .sort('-created')
        .exec((err, shops) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(shops);
        });
};

exports.create = (req, res) => {
    const shop = new Shop(req.body);
    shop.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.read = (req, res) => {
    return res.json(req.shop);
};

exports.update = (req, res) => {
    console.log('req.body', req.body);
    console.log('shop update param', req.params.shopId);

    const shop = req.shop;
    shop.name = req.body.name;
    shop.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const shop = req.shop;
    Product.find({ shop }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You can't delete ${shop.name}. It has ${data.length} associated products.`
            });
        } else {
            shop.remove((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({
                    message: 'Shop deleted'
                });
            });
        }
    });
};

exports.list = (req, res) => {
    Shop.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};
