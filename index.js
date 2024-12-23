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
    from: `${SendgridSender}`, // Verified SendGrid sender email
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
app.post('/stripe/webhook', async (req, res) => {
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
    const session = event.data.object;

    const customerEmail = session.receipt_email || session.customer_details.email; // Get the customer email

    if(customerEmail){
      console.log(customerEmail)
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 }); // Get line items

    let subject = '';
    let message = '';

    // Loop through line items to determine the product
    for (const item of lineItems.data) {
      const productId = item.price.product; // Extract the product ID

      // Check product ID to determine which product was purchased
      if (productId === 'prod_RKGIXPoDtTir6V') {
        subject = 'Thank you for purchasing a Zoom class Week One placement!';
        message = `Dear customer,\n\nThank you for purchasing Week One! Your payment has been successfully processed. Here are the details for the class: \n\nBest regards,\nThe LC Biology Guy`;
      } else if (productId === 'prod_RRl0T5qS265k7U') {
        subject = 'Thank you for choosing the Free Resources!';
        message = `Dear customer,\n\Thank you for choosing the free resources package. Here is the link to the google drive containing the resources: https://drive.google.com/drive/folders/1Vsr3aMvK8qGR8b1c7s6y7XK4oRKalvNW?usp=sharing  \n\nBest regards,\nThe LC Biology Guy`;
      } else if (productId === 'prod_RNcNcp6u1bhksR') {
        subject = 'Thank you for purchasing a Zoom class Week Two placement!';
        message = `Dear customer,\n\nThank you for purchasing Week Two! Your payment has been successfully processed. Here are the details for the class: \n\nBest regards,\nThe LC Biology Guy`;
      } else if (productId === 'prod_RNcOy3SkrDdX6H') {
        subject = 'Thank you for purchasing a Zoom class Week Three placement!';
        message = `Dear customer,\n\nThank you for purchasing Week Three! Your payment has been successfully processed. Here are the details for the class: \n\nBest regards,\nThe LC Biology Guy`;
      } else if (productId === 'prod_RNcOLGk9UPWx0I') {
        subject = 'Thank you for purchasing a Zoom class Week Four placement!';
        message = `Dear customer,\n\nThank you for purchasing Week Four! Your payment has been successfully processed. Here are the details for the class: \n\nBest regards,\nThe LC Biology Guy`;
      } else if (productId === 'prod_RNz4sHcI0k4MYM') {
        subject = 'Thank you for purchasing a placement in all classes next month!'
        message = `Dear customer,\n\nThank you for purchasing the Full Package of classes for next month! Your payment has been successfully processed. Here are the details for the classes: \n\nBest regards,\nThe LC Biology Guy`
      } else {
        subject = 'Thank you for your purchase';
        message = `Hi, \n\nYour payment went through, but unfortunately the server failed to fetch the product ID. This means I could not find the invite code for the class you purchased. Please email me back letting me know what class/s you purchased and I will send on the info you need. Thanks! \n\nBest regards,\nThe LC Biology Guy`
      }
    }

    // Send the custom email via SendGrid
    sendEmail(customerEmail, subject, message);
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
}});






//routes
app.get('/', (req, res) => {
    res.render("home.ejs")
})

app.get('/lesson', (req, res) => {
    res.render("lesson.ejs", {
      title: "Warning",
      message: "Using the same invite code for a zoom class as another student will result in both accounts receiving a ban. By closing this pop-up or clicking the button below, you acknowledge this warning and wish to proceed.",
      button: "Understood",
    })
})

app.get('/trial', (req, res) => {
    res.render("trial.ejs")
    //Fixed
})

app.get('/contact', (req, res) => {
    res.render("contact.ejs")
})

app.get("/done", (req, res) => {
  res.render("lesson.ejs", {
    title: "Success!",
    message: "You should recieve the details for the zoom class via an email sent to the address you entered at checkout. Be sure to check your spam just in case it gets filtered there. If you do not recieve an email after 24 hours please contact me at: thelcbiologyguy@gmail.com Thanks.",
    button: "Close",
  })
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