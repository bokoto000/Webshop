const paypal = require("paypal-rest-sdk");


module.exports = () =>{
    //dont worry its all test accounts
    paypal.configure({
        'mode':'sandbox',//this line here says that we are not using real money.
        'client_id':'Ab4whDPcfI7NexQc8JOy-RRgdOJ4q4Ha3GDqwYhOYGHr-vYK7cWGSLMGbd9itp-TR5_YhCsWYMkAme7J',
        'client_secret':'EIRTG0a9Nqwogqe3__UuE1iDBCQohZE32eu_HsqxdQwG0-jSRcmhrNHlMiS0WeAr1a7KkWnDXkRqqEX1',
        
    })
}