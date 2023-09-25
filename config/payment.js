// // const stripe = require("stripe")(process.env.STRIPE_SECRET);

const stripe = require("stripe")('sk_test_51NqXwaSGJllTVAbLYtmlNx1R8qUIgw68liy3Ae2G9llS3BpjP9Gz2RpmAIoLqQmJyhvmSTVMprk3rOGPmHxsDLGA00FVHzRwvy');

exports.buynNowSession = async (req, res) => {
    const { products } = req.body;
    // console.log('order: ', products[0]);
    // console.log('order: ', products[1]);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "inr",
                product_data: {
                    name: products[2],
                },
                unit_amount: products[0]*100,
            },
            quantity: products[1]
        }],
        mode: 'payment',
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/buyer/cart_details",
    });

    // console.log('session id: ', session.id);
    res.json({ id: session.id })
}