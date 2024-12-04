require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();
const router = express.Router();
const sgMail = require("@sendgrid/mail")
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const port = 3000

//Middleware
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(express.json());


const endpointSecret = process.env.WEBHOOK_SECRET
const API_KEY = process.env.SEND_GRID_KEY
const SendgridSender = process.env.EMAIL

sgMail.setApiKey(`${API_KEY}`)


// SendGrid email template
const sendEmail = (toEmail, subject, message) => {
  const msg = {
    to: toEmail,
    from: 'Karl', // Verified SendGrid sender email
    subject: subject,
    text: message,
  };

  // Send the email via SendGrid
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};






// Stripe webhook handler
app.post('/stripe/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  // Verify the Stripe webhook signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment (for both Stripe Checkout and Payment Intents)
  if (event.type === 'checkout.session.async_payment_succeeded' || event.type === 'checkout.session.completed') {
    const paymentIntent = event.data.object;
    console.log(paymentIntent)
    const customerEmail = paymentIntent.receipt_email || paymentIntent.customer_email; // Get the customer email

    // Define your custom email content
    const subject = 'Thank you for your purchase!';
    const message = `Dear customer,

Thank you for your purchase. Your payment has been successfully processed.
This test email is working!

Best regards,
Max Grind School`;

    // Send the custom email via SendGrid
    sendEmail(customerEmail, subject, message);
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
});






//routes
app.get('/', (req, res) => {
    res.render("home.ejs")
})

app.get('/lesson', (req, res) => {
    res.render("lesson.ejs")
})

app.get('/trial', (req, res) => {
    res.render("trial.ejs")
})

app.get('/contact', (req, res) => {
    res.render("contact.ejs")
})

app.get("/done", (req, res) => {
    res.render("success.ejs")
})



// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
    const { priceId } = req.body;
    console.log("the price of this product is " + priceId)
  
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // The mode is set to handle single payments based on your business needs
      mode: "payment",
      // Defines where Stripe will redirect a customer after successful payment
      success_url: `${process.env.DOMAIN}/done`,
      // Defines where Stripe will redirect if a customer cancels payment
      cancel_url: `${process.env.DOMAIN}`,
    });
  
  
    res.redirect(303, session.url);
  });


  app.use("/api", router);

// Run the server when developing locally
// In production we use functions/api.js to run the server on Netlify hosting
if (process.env.NODE_ENV !== 'production') {
  app.listen(4242, () => console.log("Server running on port 4242"));
}





app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });