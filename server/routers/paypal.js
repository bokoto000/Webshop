const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");

router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true
    })
);

paypal.configure({
    'mode': 'sandbox',//this line here says that we are not using real money.
    'client_id': 'Ab4whDPcfI7NexQc8JOy-RRgdOJ4q4Ha3GDqwYhOYGHr-vYK7cWGSLMGbd9itp-TR5_YhCsWYMkAme7J',
    'client_secret': 'EIRTG0a9Nqwogqe3__UuE1iDBCQohZE32eu_HsqxdQwG0-jSRcmhrNHlMiS0WeAr1a7KkWnDXkRqqEX1',

})

module.exports = () => {
    router.post("/pay", (req, res) => {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/paypal/success",
                "cancel_url": "http://localhost:5000/paypal/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Red Sox Hat",
                        "sku": "001",
                        "price": "25.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "Hat for the best team ever"
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        return res.json({href:payment.links[i].href});
                    }

                }
            }
        });
    });

    router.get("/success", (req, res) => {
        console.log("Success");
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        console.log(payerId);
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                return res.send('Success');
            }
        });
    });

    router.get("/cancel", (req, res) => {
        return res.send('Cancelled')
    });
    return router;
};
