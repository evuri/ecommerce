const express = require("express");
const router = express.Router();


const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { cashfreerequest,cashfreeresponse } = require("../controllers/cashfree");

router.post("/request",
            cashfreerequest
          );

router.post("/response",
              cashfreeresponse
            );


module.exports = router;
