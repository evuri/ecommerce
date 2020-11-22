const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

const mongoose = require('mongoose');

exports.productById = (req, res, next, id) => {
    Product.findById(id)
        .populate('category.id')
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }
            req.product = product;
            next();
        });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        const { name, description, price, quantity, shipping } = fields;

        if (!name || !description || !price || !quantity) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000

        // if (files.photo) {
        //     console.log("FILES PHOTO: ", files.photo);
        //     if (files.photo.size > 1000000) {
        //         return res.status(400).json({
        //             error: 'Image should be less than 1mb in size'
        //         });
        //     }
        //     product.photo.img4.data = fs.readFileSync(files.photo.path);
        //     product.photo.img4.contentType = files.photo.type;
        // }
        var count = 0
        for (let key in files) {
            count = count + 1;
            if (files[key]) {
              if (files[key].size > 1000000) {
                  return res.status(400).json({
                      error: 'Image should be less than 1mb in size'
                  });
              }
              product.photo[key].data = fs.readFileSync(files[key].path);
              product.photo[key].contentType = files[key].type;
            }
        }
        product.numberPics = count
        console.log(product)

        product.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
         res.json(result);

                    });
                });
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Product deleted successfully'
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(categories);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};


    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            }
            else if(key === 'shop'){
              findArgs['shop.id']= req.body.filters['shop']
            }
             else {
                findArgs['category.id'] = req.body.filters['category'];

            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

//photos

exports.photo = (req, res, next) => {
    if (req.product.photo["img1"].data) {
        res.set('Content-Type', req.product.photo["img1"].contentType);
        return res.send(req.product.photo["img1"].data);
    }
    next();
};
exports.photo2 = (req, res, next) => {
    if (req.product.photo["img2"].data) {
        res.set('Content-Type', req.product.photo["img2"].contentType);
        return res.send(req.product.photo["img2"].data);
    }
    next();
};
exports.photo3 = (req, res, next) => {
    if (req.product.photo["img3"].data) {
        res.set('Content-Type', req.product.photo["img3"].contentType);
        return res.send(req.product.photo["img3"].data);
    }
    next();
};
exports.photo4 = (req, res, next) => {
    if (req.product.photo["img4"].data) {
        res.set('Content-Type', req.product.photo["img4"].contentType);
        return res.send(req.product.photo["img4"].data);
    }
    next();
};
exports.photo5 = (req, res, next) => {
    if (req.product.photo["img5"].data) {
        res.set('Content-Type', req.product.photo["img5"].contentType);
        return res.send(req.product.photo["img5"].data);
    }
    next();
};




exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // assigne category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
};

exports.listSearchtrail = (req, res) => {
    const query = {};
     if (req.query.search) {
        query.name = { $regex: req.query.search};
        solrClient.search("key", function (err, result) {
               if (err) {
                  console.log(err);
                  return;
               }
               console.log('Response:', result.response);
            });

    }
}

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });
};
