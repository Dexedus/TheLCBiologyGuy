require("dotenv").config();
const fetch = require('node-fetch');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();
const router = express.Router();
const sgMail = require("@sendgrid/mail")
const bodyParser = require("body-parser");
const pg = require("pg")

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const port = 3000

const db = new pg.Client({
  user: process.env.un,
  host: process.env.host,
  database: "TheLCBiologyGuy",
  password: process.env.pw,
  port: 5432,
  ssl: true,
});
db.connect();

//Middleware
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(express.json());


const endpointSecret = process.env.WEBHOOK_SECRET
const API_KEY = process.env.SEND_GRID_KEY
const SendgridSender = process.env.EMAIL
const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
const FOLDER_ID = process.env.FOLDER_ID;

sgMail.setApiKey(`${API_KEY}`)


// SendGrid email template
const sendEmail = (toEmail, subject, message) => {
  const msg = {
    to: toEmail,
    from: `${SendgridSender}`, // Verified SendGrid sender email
    subject: subject,
    html: message,
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

    if (customerEmail) {
      console.log(customerEmail);
      
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 }); // Get line items

      let subject = '';
      let message = '';
      let productTable = ''; // Variable to hold the product table name

      // Loop through line items to determine the product
      for (const item of lineItems.data) {
        const productId = item.price.product; // Extract the product ID

        // Check product ID to determine which product was purchased
        if (productId === 'prod_RKGIXPoDtTir6V') {
          subject = 'Thank you for purchasing a Zoom class Week One placement!';
          message = `Dear customer,\n\nThank you for purchasing Week One! Your payment has been successfully processed. Here are the details for the class: \n\nBest regards,\nThe LC Biology Guy`;
          productTable = 'week_one_emails'; // table for Week One
        } else if (productId === 'prod_RRl0T5qS265k7U') {
          subject = 'Thank you for choosing the Free Resources!';
          message = `Dear ${customerEmail},<br><br>Thank you for choosing the free Unit 1 and Cell chapter notes. Here is the link to the Google Drive containing the resources: <a href="https://u48917275.ct.sendgrid.net/ls/click?upn=u001.gb1oIQZYL4vnMZkgmvEgigzFl42rVVPLGu-2Fe519Dvun9tuRbO-2FbM7IplLEtFJNpQ05TKwRq03odmolpArth0ldjiurLFB4dCM-2B4tixT-2F0TJ1ELxqIhhbS32gO3hKFnrEIFcd_4pE3C559McDKAd-2Fg3v7vn7eIndNn6ci9X9Lg05SN5hd0HqQd0CGpTiKRONJude4-2BSsNEXmpTWFbVn7KIYUZRVHAyrUpW7MXxjc-2FqCDWugVFXx574jVw6J7AuqIMN8xCK0iv3bPZjXrabb-2BWXwezZpQFLZE34yn6CVbJCQvmrQ3rjg5a43SNZwK-2BgAipFyVeR3EkkRmw-2B21-2FGCOBGcKlZTw-3D-3D" target="_blank">Here</a><br><br>We would like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>Best regards,<br>The LC Biology Guy`;
          productTable = 'free_resources_emails'; // table for Free Resources
        } else if (productId === 'prod_RNcNcp6u1bhksR') {
          subject = 'Thank you for purchasing a Zoom class Week Two placement!';
          message = `Dear customer,\n\nThank you for purchasing Week Two! Your payment has been successfully processed. Here are the details for the class: \n\nBest regards,\nThe LC Biology Guy`;
          productTable = 'week_two_emails'; // table for Week Two
        } else if (productId === 'prod_RNcOy3SkrDdX6H') {
          subject = 'Thank you for purchasing a Zoom class Week Three placement!';
          message = `Dear customer,\n\nThank you for purchasing Week Three! Your payment has been successfully processed. Here are the details for the class: \n\nBest regards,\nThe LC Biology Guy`;
          productTable = 'week_three_emails'; // table for Week Three
        } else if (productId === 'prod_RNcOLGk9UPWx0I') {
          subject = 'Thank you for purchasing a Zoom class Week Four placement!';
          message = `Dear customer,\n\nThank you for purchasing Week Four! Your payment has been successfully processed. Here are the details for the class: \n\nBest regards,\nThe LC Biology Guy`;
          productTable = 'week_four_emails'; // table for Week Four
        } else if (productId === 'prod_RNz4sHcI0k4MYM') {
          subject = 'Thank you for purchasing a placement in all classes next month!';
          message = `Dear customer,\n\nThank you for purchasing the Full Package of classes for next month! Your payment has been successfully processed. Here are the details for the classes: \n\nBest regards,\nThe LC Biology Guy`;
          productTable = 'full_package_emails'; // table for Full Package
        } else {
          subject = 'Thank you for your purchase';
          message = `Hi, \n\nYour payment went through, but unfortunately the server failed to fetch the product ID. This means I could not find the invite code for the class you purchased. Please email me back letting me know what class/s you purchased and I will send on the info you need. Thanks! \n\nBest regards,\nThe LC Biology Guy`;
          productTable = 'emails'; // tables for emails where the product id couldn't be found
        }

        // check if email is already in database
        const checkEmailQuery = `SELECT email FROM ${productTable} WHERE email = $1`;
        const result = await db.query(checkEmailQuery, [customerEmail]);
        const unsubbedresult = await db.query('SELECT email FROM unsubbed WHERE email = $1', [customerEmail])

        // If the email isn't in the unsubbed list then add to promotions list
        if(unsubbedresult.rows.length === 0){
          await db.query('INSERT INTO promotions (email) VALUES ($1)', [customerEmail])
        }

        if(result.rows.length === 0){
        //add email to the product table
          const insertEmailQuery = `INSERT INTO ${productTable} (email) VALUES ($1)`;
          await db.query(insertEmailQuery, [customerEmail]);
        //send the email.        
          sendEmail(customerEmail, subject, message);
          
        } else {
          sendEmail(customerEmail, "Sorry", "You have already purchased this product. You should recieve the correct email shortly")
          console.log("email already exists in the database table of this product")
    }
   }
  
  // Acknowledge receipt of the event
  res.json({ received: true });
}}});






//routes
app.get('/', (req, res) => {
    res.render("home.ejs")
})

app.post('/unsubscribe', async (req, res) => {
  const email = req.body.email;

  // Check if the unsubscribe checkbox is checked
  if (req.body.unsubscribe) {
    try {
      // Insert the email into the 'unsubbed' table
      await db.query('DELETE FROM promotions WHERE email = $1', [email]);
      await db.query('INSERT INTO unsubbed (email) VALUES ($1)', [email]);
      res.send('You have been unsubscribed.');
    } catch (err) {
      console.error(err);
      res.status(400).send('You have already unsubscribed from our promotions.');
    }
  } else {
    res.send('No action taken.');
  }
});

//uncomment the old code when products page is finished
app.get('/lesson', (req, res) => {
    // res.render("temporary.ejs", {
    //   title: "Warning",
    //   message: "By closing this pop up or clicking the button below, you agree to not share any of my paid for material after purchasing it yourself. ",
    //   button: "Understood",
    // })

    res.render("temporary.ejs", {
      title: "Coming Soon",
      message: "My paid products will launch soon. Please check out the free resources page to get H1 quality notes in the meantime!",
      button: "Close",
    })
})

//remove these routes if not needed anymore
app.get('/optout', (req, res) => {
    res.render("optout.ejs")
})

app.post('/submit', (req, res) => {
  let Email = req.body.Email;
  console.log(Email)
  
})

app.get('/trial', (req, res) => {
    res.render("trial.ejs")
    //Fixed
})

app.get('/contact', (req, res) => {
    res.render("contact.ejs")
})

//Change back to lesson.ejs when products page is ready
app.get("/done", (req, res) => {
  res.render("temporary.ejs", {
    title: "Success!",
    message: "You should recieve the details for the zoom class via an email sent to the address you entered at checkout. Be sure to check your spam just in case it gets filtered there. If you do not recieve an email after 24 hours please contact me at: thelcbiologyguy@gmail.com Thanks.",
    button: "Close",
  })
})



// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
    const { priceId } = req.body;
    // console.log("the price of this product is " + priceId)
  
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