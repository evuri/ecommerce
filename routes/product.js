const express = require("express");
const router = express.Router();

const {
    create,
    productById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo,photo2,photo3,photo4,photo5,
    listSearch,
    listSearchtrail
} = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
    "/product/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.put(
    "/product/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.get("/products", list);
router.get("/products/search", listSearch);
router.get("/trail/products/search", listSearchtrail);

router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId/1", photo);
router.get("/product/photo/:productId/2", photo2);
router.get("/product/photo/:productId/3", photo3);
router.get("/product/photo/:productId/4", photo4);
router.get("/product/photo/:productId/5", photo5);




router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
