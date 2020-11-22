var crypto    = require('crypto');


exports.cashfreerequest = (req, res, next) => {
        var postData = {
          "appId" : "1390473fbd8c1f80ddec0995140931",
      		"orderId" : req.body.orderId,
      		"orderAmount" : req.body.orderAmount,
      		"orderCurrency" : "INR",
      		"orderNote" : req.body.orderNote,
      		'customerName' : req.body.customerName,
      		"customerEmail" : req.body.customerEmail,
      		"customerPhone" : req.body.customerPhone,
      		"returnUrl" : "http://localhost:3001/",
      		"notifyUrl" : "http://localhost:3001/"
      },
      mode = "TEST",
      secretKey = "3054b42d1889e4fa2ad5a19d8dce579a36f4ebbc",
      sortedkeys = Object.keys(postData),
      url="",
      signatureData = "";
      sortedkeys.sort();
      for (var i = 0; i < sortedkeys.length; i++) {
        k = sortedkeys[i];
        signatureData += k + postData[k];
      }
      var signature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
      postData['signature'] = signature;
      if (mode == "PROD") {
        url = "https://www.cashfree.com/checkout/post/submit";
      } else {
        url = "https://test.cashfree.com/billpay/checkout/post/submit";
      }

     console.log(signature)
     res.json(signature)
};


exports.cashfreeresponse = (req, res, next) => {
        var postData = {
      "orderId" : req.body.orderId,
      "orderAmount" : req.body.orderAmount,
      "referenceId" : req.body.referenceId,
      "txStatus" : req.body.txStatus,
      "paymentMode" : req.body.paymentMode,
      "txMsg" : req.body.txMsg,
      "txTime" : req.body.txTime
      },
      secretKey = "3054b42d1889e4fa2ad5a19d8dce579a36f4ebbc",

      signatureData = "";
      for (var key in postData) {
      signatureData +=  postData[key];
      }
      var computedsignature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
      postData['signature'] = req.body.signature;
      postData['computedsignature'] = computedsignature;
      res.render('response',{postData : JSON.stringify(postData)});
};
