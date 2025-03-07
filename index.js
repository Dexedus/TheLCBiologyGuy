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

const zoom_1_link = process.env.ZOOM_1_LINK;
const zoom_1_id = process.env.ZOOM_1_ID;
const zoom_1_passcode = process.env.ZOOM_1_PASSCODE;

const zoom_2_link = process.env.ZOOM_2_LINK;
const zoom_2_id = process.env.ZOOM_2_ID;
const zoom_2_passcode = process.env.ZOOM_2_PASSCODE;

const zoom_3_link = process.env.ZOOM_3_LINK;
const zoom_3_id = process.env.ZOOM_3_ID;
const zoom_3_passcode = process.env.ZOOM_3_PASSCODE;

const zoom_4_link = process.env.ZOOM_4_LINK;
const zoom_4_id = process.env.ZOOM_4_ID;
const zoom_4_passcode = process.env.ZOOM_4_PASSCODE;

const zoom_5_link = process.env.ZOOM_5_LINK;
const zoom_5_id = process.env.ZOOM_5_ID;
const zoom_5_passcode = process.env.ZOOM_5_PASSCODE;

const zoom_6_link = process.env.ZOOM_6_LINK;
const zoom_6_id = process.env.ZOOM_6_ID;
const zoom_6_passcode = process.env.ZOOM_6_PASSCODE;


sgMail.setApiKey(`${API_KEY}`)


// SendGrid email template
const sendEmail = (toEmail, subject, message, emailSent, db) => {
  const msg = {
    to: toEmail,
    from: `${SendgridSender}`, // Verified SendGrid sender email
    subject: subject,
    html: message,
  };

  // Send the email via SendGrid
  sgMail
    .send(msg)
    .then(async () => {
      // Add the value to the database table (example for PostgreSQL)
      try {
        const insertQuery = 'INSERT INTO emails_sent (email) VALUES ($1)';
        await db.query(insertQuery, [`${toEmail} was sent an email`]);  // Use `db.query` to run the query
        console.log(`${emailSent}`);
      } catch (err) {
        console.error('Error inserting into database:', err);
      }
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
    const firstNameField = session.custom_fields.find(field => field.key === 'first_name');
    const firstName = firstNameField ? firstNameField.text.value : 'Default Name';

    
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
        if (productId === 'prod_RsnCotd8OdUSv9') {
          subject = 'Free Live Classes'
          message = `Dear ${firstName},<br><br>Thank you for registering for the First Free Week class on Cells and Ecology! You can access the classes with the Zoom links below.<br><br>Cells Masterclass: March 6th, 7pm to 8:30pm<br>https://us06web.zoom.us/j/82332314843?pwd=93Evz4w3XfjxWz7TsihdQi4ba8QfLE.1<br>Meeting ID: 823 3231 4843<br>Passcode: 286207<br><br>Ecology Masterclass: March 9th, 3pm to 4:30pm<br>https://us06web.zoom.us/j/83672138196?pwd=XlYFPjWTmRZ4BY3jFBDH8z5OjZydPD.1<br>Meeting ID: 836 7213 8196<br>Passcode: 410883<br><br>Note: After the classes, the recordings will be updated to the Google Drive <a href="https://u48917275.ct.sendgrid.net/ls/click?upn=u001.gb1oIQZYL4vnMZkgmvEgigzFl42rVVPLGu-2Fe519Dvun9tuRbO-2FbM7IplLEtFJNpQ05TKwRq03odmolpArth0ldjiurLFB4dCM-2B4tixT-2F0TJ1ELxqIhhbS32gO3hKFnrEIFcd_4pE3C559McDKAd-2Fg3v7vn7eIndNn6ci9X9Lg05SN5hd0HqQd0CGpTiKRONJude4-2BSsNEXmpTWFbVn7KIYUZRVHAyrUpW7MXxjc-2FqCDWugVFXx574jVw6J7AuqIMN8xCK0iv3bPZjXrabb-2BWXwezZpQFLZE34yn6CVbJCQvmrQ3rjg5a43SNZwK-2BgAipFyVeR3EkkRmw-2B21-2FGCOBGcKlZTw-3D-3D" target="_blank">here</a><br><br>Best Regards,<br>Max<br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I wish to opt out of future promotional emails from The LC Biology Guy</label><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>
          <b>Places are limited to 100 people, so if you are unable to join the Zoom don't worry the class will be recorded for you</b>`;
          productTable = 'free_trial_temp';
        } else if (productId === 'prod_RRl0T5qS265k7U') {
          subject = 'Thank you for choosing the Free Resources!';
          message = `Dear ${firstName},<br><br>Thank you for choosing the free Unit 1 and Cell chapter notes. Here is the link to the Google Drive containing the resources: <a href="https://u48917275.ct.sendgrid.net/ls/click?upn=u001.gb1oIQZYL4vnMZkgmvEgigzFl42rVVPLGu-2Fe519Dvun9tuRbO-2FbM7IplLEtFJNpQ05TKwRq03odmolpArth0ldjiurLFB4dCM-2B4tixT-2F0TJ1ELxqIhhbS32gO3hKFnrEIFcd_4pE3C559McDKAd-2Fg3v7vn7eIndNn6ci9X9Lg05SN5hd0HqQd0CGpTiKRONJude4-2BSsNEXmpTWFbVn7KIYUZRVHAyrUpW7MXxjc-2FqCDWugVFXx574jVw6J7AuqIMN8xCK0iv3bPZjXrabb-2BWXwezZpQFLZE34yn6CVbJCQvmrQ3rjg5a43SNZwK-2BgAipFyVeR3EkkRmw-2B21-2FGCOBGcKlZTw-3D-3D" target="_blank">Here</a><br><br>We would like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>Best Regards,<br>Max<br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I wish to opt out of future promotional emails from The LC Biology Guy</label><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form>`;
          productTable = 'free_resources_emails';
        } else if (productId === 'prod_RXmmWoklq55vCR') {
          subject = 'Thanks for choosing the Respiration Masterclass'
          message = `Dear ${firstName},<br><br>***THIS CLASS HAS ENDED. To get access to the recording, please email me and I will confirm your purchase before giving you access to the google drive.***<br><br>Thank you for purchasing the Respiration Masterclass! You can join the live Zoom session using the link below. The notes and recording will be shared via Google Drive after the live session:<br><br>Respiration Masterclass<br>Time: Jan 15, 2025, 07:00 PM London<br>Join Zoom Meeting<br>${zoom_2_link}<br><br>Meeting ID: ${zoom_2_id} 4891<br>Passcode: ${zoom_2_passcode}<br><br>You can head to my <a href="https://www.thelcbiologyguy.ie/" target="_blank">website</a> to get access to my free notes on Unit 1 and Cell (structure, diversity, division) if you haven’t already.<br><br>If you have any questions or difficulties please send me an email: thelcbiologyguy@gmail.com<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>Best of luck with your revision!<br>Max`;
          productTable = 'respiration_masterclass';
        } else if (productId === 'prod_RXmn78khy1Nvlp') {
          subject = 'Thanks for choosing the Genetics Masterclass'
          message = `Dear ${firstName},<br><br>***THIS CLASS HAS ENDED. To get access to the recording, please email me and I will confirm your purchase before giving you access to the google drive.***<br><br>Thank you for purchasing the Genetics Masterclass! You can join the live Zoom session using the link below. The notes and recording will be shared via Google Drive after the live session:<br><br>Genetics Masterclass<br>Time: Jan 19, 2025, 03:00 PM London<br>Join Zoom Meeting<br>${zoom_3_link}<br><br>Meeting ID: ${zoom_3_id} 2818<br>Passcode: ${zoom_3_passcode}<br><br>You can head to my <a href="https://www.thelcbiologyguy.ie/" target="_blank">website</a> to get access to my free notes on Unit 1 and Cell (structure, diversity, division) if you haven’t already.<br><br>If you have any questions or difficulties please send me an email: thelcbiologyguy@gmail.com<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>Best of luck with your revision!<br>Max`;
          productTable = 'genetics_masterclass';
        } else if (productId === 'prod_RXmn0zHOZtlpwj') {
          subject = 'Thanks for choosing the DNA Masterclass'
          message = `Dear ${firstName},<br><br>***THIS CLASS HAS ENDED. To get access to the recording, please email me and I will confirm your purchase before giving you access to the google drive.***<br><br>Thank you for purchasing the DNA Masterclass! You can join the live Zoom session using the link below. The notes and recording will be shared via Google Drive after the live session:<br><br>DNA Masterclass<br>Time: Jan 21, 2025, 07:00 PM London<br>Join Zoom Meeting<br>${zoom_4_link}<br><br>Meeting ID: ${zoom_4_id} 0178<br>Passcode: ${zoom_4_passcode}<br><br>You can head to my <a href="https://www.thelcbiologyguy.ie/" target="_blank">website</a> to get access to my free notes on Unit 1 and Cell (structure, diversity, division) if you haven’t already.<br><br>If you have any questions or difficulties please send me an email: thelcbiologyguy@gmail.com<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>Best of luck with your revision!<br>Max`;
          productTable = 'dna_masterclass';
        } else if (productId === 'prod_RXmojuJYIFAWqU') {
          subject = 'Thanks for choosing the Human Reproduction Masterclass'
          message = `Dear ${firstName},<br><br>***THIS CLASS HAS ENDED. To get access to the recording, please email me and I will confirm your purchase before giving you access to the google drive.***<br>Thank you for purchasing the Human Reproduction Masterclass! You can join the live Zoom session using the link below. The notes and recording will be shared via Google Drive after the live session:<br><br>Human Reproduction Masterclass<br>Time: Jan 22, 2025, 07:00 PM London<br>Join Zoom Meeting<br>${zoom_5_link}<br><br>Meeting ID: ${zoom_5_id}<br>Passcode: ${zoom_5_passcode}<br><br>You can head to my <a href="https://www.thelcbiologyguy.ie/" target="_blank">website</a> to get access to my free notes on Unit 1 and Cell (structure, diversity, division) if you haven’t already.<br><br>If you have any questions or difficulties please send me an email: thelcbiologyguy@gmail.com<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>Best of luck with your revision!<br>Max`;
          productTable = 'human_reproduction';
        } else if (productId === 'prod_RXmoDNYmM66p5L') {
          subject = 'Thanks for choosing the Plant Reproduction Masterclass'
          message = `Dear ${firstName},<br><br>***THIS CLASS HAS ENDED. To get access to the recording, please email me and I will confirm your purchase before giving you access to the google drive.***<br>Thank you for purchasing the Plant Reproduction Masterclass! You can join the live Zoom session using the link below. The notes and recording will be shared via Google Drive after the live session:<br><br>Plant Reproduction Masterclass<br>Time: Jan 26, 2025, 03:00 PM London<br>Join Zoom Meeting<br>${zoom_6_link}<br><br>Meeting ID: ${zoom_6_id}<br>Passcode: ${zoom_6_passcode}<br><br>You can head to my <a href="https://www.thelcbiologyguy.ie/" target="_blank">website</a> to get access to my free notes on Unit 1 and Cell (structure, diversity, division) if you haven’t already.<br><br>If you have any questions or difficulties please send me an email: thelcbiologyguy@gmail.com<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>Best of luck with your revision!<br>Max`;
          productTable = 'plant_reproduction';
        } else if (productId === 'prod_RXmsodti50pHO8') {
          subject = 'Thanks for choosing the Mock Prep Bundle'
          message = `Dear ${firstName},<br><br>Thank you for your purchase!<br><br>The Google Drive can be accessed <a href="https://drive.google.com/drive/folders/1Cu7TUE7uWIsgLjPIwW19VJcR-VCZAIw9?usp=sharing" target="_blank">here.</a><br>This folder is set to restricted access, I will grant you access as soon as possible.<br><br>If you have made a request and not received access within 30 minutes please respond to this email<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>Best of luck with your revision!<br>Max`;
          productTable = 'full_package_emails';
        } else {
          subject = 'Thank you for your purchase';
          message = `Hi, \n\nYour payment went through, but unfortunately the server failed to fetch the product ID. This means I could not find the invite code for the class you purchased. Please email me back letting me know what class/s you purchased and I will send on the info you need. Thanks! \n\nBest regards,\nThe LC Biology Guy`;
          productTable = 'emails'; // tables for emails where the product id couldn't be found
        }


        // check if email is already in database
        const checkEmailQuery = `SELECT email FROM ${productTable} WHERE email = $1`;
        console.log(productTable)
        let emailSent = (`email sent and added to ${productTable}`)
        const result = await db.query(checkEmailQuery, [customerEmail]);
        const unsubbedresult = await db.query('SELECT email FROM unsubbed WHERE email = $1', [customerEmail])
        const promotionsresult = await db.query('SELECT email FROM promotions WHERE email = $1', [customerEmail])

        // If the email isn't in the unsubbed list then add to promotions list
        if(unsubbedresult.rows.length === 0 && promotionsresult.rows.length === 0){
          await db.query('INSERT INTO promotions (email) VALUES ($1)', [customerEmail])
        }

        if(result.rows.length === 0){
        //add email to the product table
          const insertEmailQuery = `INSERT INTO ${productTable} (email, "first name") VALUES ($1, $2)`;
          await db.query(insertEmailQuery, [customerEmail, firstName]);
        //send the email.        
          sendEmail(customerEmail, subject, message, emailSent, db);

          if (productId === 'prod_RRl0T5qS265k7U' && unsubbedresult.rows.length === 0) {
          {
          setTimeout(() => {
            const secondSubject = 'Is your child struggling with LC Biology?';
            const secondMessage = `Hi ${firstName},<br><br>Your child recently received my free H1 highlighted notes for Unit 1 and the 3 Cell topics. As I write this over 1200 students have downloaded the notes, which is truly incredible! Thank you for your support.<br><br>I have received many positive emails, but I would love to hear from you!<br><br>I have opened a Google reviews page and it would mean the world to me if you could leave me a 5-star Google review mentioning the free H1 Highlighted notes:<a href="https://www.google.com/maps/place//data=!4m3!3m2!1s0x6cad1d58dd492631:0xa7fc2af1a72b181d!12e1?source=g.page.m.ia._&laa=nmx-review-solicitation-ia2" target="_blank">HERE</a><br><br>I wish your child the very best with their study!<br>Best regards,<br>Max (The LC Biology Guy)<br><br>We would like to send you more promotional emails in the future but if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form><br><br>Best of luck with your revision!<br>Max`;
    
            sendEmail(customerEmail, secondSubject, secondMessage, `Marketing email sent to ${customerEmail}`, db);
        }, 1800000); // 300000 milliseconds = 5 minutes
      }
      }
          
        } else {
          sendEmail(customerEmail, "Sorry", "Dear customer,<br><br>It looks like you might have purchased one of my products twice.<br>If this was a paid product, then it must have been a mistake. Please contact me if this was the case.<br><br>If you purchased my free resources package, and tried to do it again, and still haven't recieved an email with the necessary links, please make sure to check your spam and promotion folders. If you still don't have it after 24 hours, then please contact me at my email address: thelcbiologyguy@gmail.com<br><br>Best regards,<br>The LC Biology Guy", "Double product purchase email", db)
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
      res.render("optout.ejs")
    } catch (err) {
      console.error(err);
      res.status(400).send('You have already unsubscribed from our promotions.');
    }
  } else {
    res.send('No action taken.');
  }
});

app.post('/submit-optout', async (req, res) => {
  let Email = req.body.Email;
  console.log(Email)
  await db.query('DELETE FROM promotions WHERE email = $1', [Email]);
  await db.query('INSERT INTO unsubbed (email) VALUES ($1)', [Email])
  res.redirect("/")
})

app.post('/submit-optin', async (req, res) => {
  let Email = req.body.Email;
  await db.query('INSERT INTO promotions (email) VALUES ($1)', [Email])
  await db.query('DELETE FROM unsubbed WHERE email = $1', [Email]);
  res.redirect("/")
})


app.get('/landing', (req, res) => {
    // res.render("landing.ejs", {
    //   title: "Warning",
    //   message: "By closing this pop up or clicking the button below, you agree to not share any of my paid for material after purchasing it yourself.",
    //   button: "Understood",
    // })


    res.render("temporary.ejs");
})

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
    res.render("contact.ejs");
})

app.get("/done", (req, res) => {
  // res.render("landing.ejs", {
  //   title: "Success!",
  //   message: "You should recieve the details for these resources via an email sent to the address you entered at checkout. Be sure to check your spam just in case it gets filtered there. If you do not recieve an email after 24 hours please contact me at: thelcbiologyguy@gmail.com Thanks.",
  //   button: "Close",
  // })

  res.render("temporary.ejs");
})






// app.get("/sendemail", async (req, res) => {

//   // const firstName = "Karl"
//   // const customerEmail = "karlfleming64@gmail.com"

//   // sendEmail(customerEmail, "subject", `Dear ${firstName},<br><br>Thank you for your purchase!<br><br>The Google Drive can be accessed <a href="https://drive.google.com/drive/folders/1Cu7TUE7uWIsgLjPIwW19VJcR-VCZAIw9?usp=sharing" target="_blank">here.</a><br>This folder is set to restricted access, I will grant you access as soon as possible.<br><br>If you have made a request and not received access within 30 minutes please respond to this email<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>
//   //         <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
//   //           <input type="checkbox" name="unsubscribe">
//   //           <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br><br>
//   //           <input type="hidden" name="email" value="${customerEmail}">
//   //           <button type="submit">Submit</button>
//   //         </form><br><br>Best of luck with your revision!<br>Max`, "testWorked", db);


//       // Fetch emails from the database
//       const result = await db.query(`
// SELECT * 
// FROM free_resources_emails
// WHERE timestamp >= '2025-02-03' 
// `);
  
//       const emails = result.rows.map(row => row.email); // Extract email addresses
  

//   // const emails = ["karlfleming64@gmail.com", "ksfwebdesigns@gmail.com"]

//         if (emails.length === 0) {
//         console.log('No emails found to send.');
//       } else {
//         console.log('Emails sent')
//       }


//   const msg = {
//     to: emails, // Array of recipients
//     from: SendgridSender, // Verified sender
//     subject: '🚨Recording for the Cell Masterclass now available!',
//     html: `The recording of the Cell masterclass is now available in the Google Drive, click <a href="https://u48917275.ct.sendgrid.net/ls/click?upn=u001.gb1oIQZYL4vnMZkgmvEgigzFl42rVVPLGu-2Fe519Dvun9tuRbO-2FbM7IplLEtFJNpQ05TKwRq03odmolpArth0ldjiurLFB4dCM-2B4tixT-2F0TJ1ELxqIhhbS32gO3hKFnrEIFcd_4pE3C559McDKAd-2Fg3v7vn7eIndNn6ci9X9Lg05SN5hd0HqQd0CGpTiKRONJude4-2BSsNEXmpTWFbVn7KIYUZRVHAyrUpW7MXxjc-2FqCDWugVFXx574jVw6J7AuqIMN8xCK0iv3bPZjXrabb-2BWXwezZpQFLZE34yn6CVbJCQvmrQ3rjg5a43SNZwK-2BgAipFyVeR3EkkRmw-2B21-2FGCOBGcKlZTw-3D-3D" target="_blank">here</a> to access it.<br><br>Best regards,<br>Max`,
//   };

//   sgMail
//   .sendMultiple(msg)
//   .then(() => {
//     console.log('Emails sent successfully!');
//   })
//   .catch((error) => {
//     console.error('Error sending emails:', error);
//   });


//   res.redirect("/")
// })






// Create checkout session
app.post("/create-checkout-session", async (req, res) => {
    const { priceId } = req.body;
    // console.log("the price of this product is " + priceId)
  
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      custom_fields: [
        {
          key: 'first_name',
          label: {
            type: 'custom',
            custom: 'Parent First Name',
          },
          type: 'text',
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


// Run the server when developing locally
// In production we use functions/api.js to run the server on Netlify hosting
if (process.env.NODE_ENV !== 'production') {
  app.listen(4242, () => console.log("Server running on port 4242"));
}





app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });