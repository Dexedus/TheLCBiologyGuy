// large Commented sections of code to be removed and replaced shortly

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const cors = require('cors');
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




const Enzymes_Link = process.env.ENZYMES_LINK;
const Enzymes_ID = process.env.ENZYMES_ID;
const Enzymes_Passcode = process.env.ENZYMES_PASSCODE;

const Respiration_Link = process.env.RESPIRATION_LINK;
const Respiration_ID = process.env.RESPIRATION_ID;
const Respiration_Passcode = process.env.RESPIRATION_PASSCODE;

const Photo_Link = process.env.PHOTO_LINK;
const Photo_ID = process.env.PHOTO_ID;
const Photo_Passcode = process.env.PHOTO_PASSCODE;

const Genetics_Link = process.env.GENETICS_LINK;
const Genetics_ID = process.env.GENETICS_ID;
const Genetics_Passcode = process.env.GENETICS_PASSCODE;

const DNA_Link = process.env.DNA_LINK;
const DNA_ID = process.env.DNA_ID;
const DNA_Passcode = process.env.DNA_PASSCODE;

const Micro_Link = process.env.MICRO_LINK;
const Micro_ID = process.env.MICRO_ID;
const Micro_Passcode = process.env.MICRO_PASSCODE;

const HumanRepo1_Link = process.env.HUMAN_REPO1_LINK;
const HumanRepo1_ID = process.env.HUMAN_REPO1_ID;
const HumanRepo1_Passcode = process.env.HUMAN_REPO1_PASSCODE;

const HumanRepo2_Link = process.env.HUMAN_REPO2_LINK;
const HumanRepo2_ID = process.env.HUMAN_REPO2_ID;
const HumanRepo2_Passcode = process.env.HUMAN_REPO2_PASSCODE;

const NervousSystem_Link = process.env.NERVOUS_SYSTEM_LINK;
const NervousSystem_ID = process.env.NERVOUS_SYSTEM_ID;
const NervousSystem_Passcode = process.env.NERVOUS_SYSTEM_PASSCODE;

const Musculoskeletal_Link = process.env.MUSCULOSKELETAL_LINK;
const Musculoskeletal_ID = process.env.MUSCULOSKELETAL_ID;
const Musculoskeletal_Passcode = process.env.MUSCULOSKELETAL_PASSCODE;

const ExcretionHomeostasis_Link = process.env.EXCRETION_HOMEOSTASIS_LINK;
const ExcretionHomeostasis_ID = process.env.EXCRETION_HOMEOSTASIS_ID;
const ExcretionHomeostasis_Passcode = process.env.EXCRETION_HOMEOSTASIS_PASSCODE;

const PlantStructure_Link = process.env.PLANT_STRUCTURE_LINK;
const PlantStructure_ID = process.env.PLANT_STRUCTURE_ID;
const PlantStructure_Passcode = process.env.PLANT_STRUCTURE_PASSCODE;

const PlantRepro1_Link = process.env.PLANT_REPRO1_LINK;
const PlantRepro1_ID = process.env.PLANT_REPRO1_ID;
const PlantRepro1_Passcode = process.env.PLANT_REPRO1_PASSCODE;

const PlantRepro2_Link = process.env.PLANT_REPRO2_LINK;
const PlantRepro2_ID = process.env.PLANT_REPRO2_ID;
const PlantRepro2_Passcode = process.env.PLANT_REPRO2_PASSCODE;

const PlantResponses_Link = process.env.PLANT_RESPONSES_LINK;
const PlantResponses_ID = process.env.PLANT_RESPONSES_ID;
const PlantResponses_Passcode = process.env.PLANT_RESPONSES_PASSCODE;

const PlantTransport_Link = process.env.PLANT_TRANSPORT_LINK;
const PlantTransport_ID = process.env.PLANT_TRANSPORT_ID;
const PlantTransport_Passcode = process.env.PLANT_TRANSPORT_PASSCODE;

const ZoomLinksBundle = process.env.BUNDLE_EMAIL;




app.post('/stripe/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
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




    const productLinks = { 
      "Enzymes & Osmosis (March 12th)": `Enzymes & Osmosis class<br>March 12th, 7pm to 8:30pm<br>${Enzymes_Link}<br>MeetingID: ${Enzymes_ID}<br>Passcode: ${Enzymes_Passcode}<br><br>`,
      "Respiration (March 16th)": `Respiration class<br>March 16th, 3pm to 4:30pm<br>${Respiration_Link}<br>MeetingID: ${Respiration_ID}<br>Passcode: ${Respiration_Passcode}<br><br>`,
      "Photosynthesis (March 19th)": `Photosynthesis class<br>March 19th, 7pm to 8:30pm<br>${Photo_Link}<br>MeetingID: ${Photo_ID}<br>Passcode: ${Photo_Passcode}<br><br>`,
      "Genetics (March 23rd)": `Genetics class<br>March 23rd, 3pm to 4:30pm<br>${Genetics_Link}<br>MeetingID: ${Genetics_ID}<br>Passcode: ${Genetics_Passcode}<br><br>`,
      "DNA (March 26th)": `DNA class<br>March 26th, 7pm to 8:30pm<br>${DNA_Link}<br>MeetingID: ${DNA_ID}<br>Passcode: ${DNA_Passcode}<br><br>`,
      "Microorganisms (March 30th)": `Microorganisms class<br>March 30th 3pm to 5pm<br>${Micro_Link}<br>MeetingID: ${Micro_ID}<br>Passcode: ${Micro_Passcode}<br><br>`,
      "Human Reproduction 1 & 2 (April 2nd & 6th)": `Human Reproduction 1 class<br>April 2nd, 7pm to 8:30pm <br>${HumanRepo1_Link}<br>MeetingID: ${HumanRepo1_ID}<br>Passcode: ${HumanRepo1_Passcode}<br><br>Human Reproduction 2 class<br>April 6th, 3pm to 4:30pm <br>${HumanRepo2_Link}<br>MeetingID: ${HumanRepo2_ID}<br>Passcode: ${HumanRepo2_Passcode}<br><br>`,
      "Nervous System (April 9th)": `Nervous System class<br>April 9th 7pm to 8:30pm<br>${NervousSystem_Link}<br>MeetingID: ${NervousSystem_ID}<br>Passcode: ${NervousSystem_Passcode}<br><br>`,
      "Musculoskeletal System (April 13th)": `Musculoskeletal System class<br>April 13th, 3pm to 4:30pm<br>${Musculoskeletal_Link}<br>MeetingID: ${Musculoskeletal_ID}<br>Passcode: ${Musculoskeletal_Passcode}<br><br>`,
      "Human Excretion and Homeostasis (April 16th)": `Human Excretion and Homeostasis class<br>April 16th, 7pm to 8:30pm<br>${ExcretionHomeostasis_Link}<br>MeetingID: ${ExcretionHomeostasis_ID}<br>Passcode: ${ExcretionHomeostasis_Passcode}<br><br>`,
      "Plant Structure (April 20th)": `Plant Structure class<br>April 20th, 3pm to 4:30pm<br>${PlantStructure_Link}<br>MeetingID: ${PlantStructure_ID}<br>Passcode: ${PlantStructure_Passcode}<br><br>`,
      "Plant Reproduction 1 & 2 (April 23 & 27th)": `Plant Reproduction 1 class<br>April 23rd, 7pm to 8:30<br>${PlantRepro1_Link}<br>MeetingID: ${PlantRepro1_ID}<br>Passcode: ${PlantRepro1_Passcode}<br><br>Plant Reproduction 2 class<br>April 27th, 3pm to 4:30pm<br>${PlantRepro2_Link}<br>MeetingID: ${PlantRepro2_ID}<br>Passcode: ${PlantRepro2_Passcode}<br><br>`,
      "Plant Responses (April 30th)": `Plant Responses class<br>April 30th, 7pm to 8:30pm<br>${PlantResponses_Link}<br>MeetingID: ${PlantResponses_ID}<br>Passcode: ${PlantResponses_Passcode}<br><br>`,
      "Plant Transport (May 4th)": `Plant Transport class<br>May 4th, 3pm to 4:30pm<br>${PlantTransport_Link}<br>MeetingID: ${PlantTransport_ID}<br>Passcode: ${PlantTransport_Passcode}<br><br>`

    };



    
    const customerEmail = session.receipt_email || session.customer_details.email; // Get the customer email
    const firstNameField = session.custom_fields.find(field => field.key === 'first_name');
    const firstName = firstNameField ? firstNameField.text.value : 'Default Name';
    console.log(firstName)

        if (customerEmail) {
      console.log(customerEmail);
      
      const products = []
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 14 }); // Get line items
      lineItems.data.forEach(item => {
        products.push(item.description)
      });




        if(products[0] === 'Unit 1 and The Cell Masterclasses' || products[0] === 'Cell & Ecology Free Masterclasses (March 6th and 9th)' || products[0] === 'Improvement Bundle' || products[0] === 'Last Minute Masterclass' ){

          let message = ""
          let subject = ""

        // Check product ID to determine which product was purchased
        if (products[0] === 'Cell & Ecology Free Masterclasses (March 6th and 9th)') {
          subject = 'Unit 1 and The Cell Masterclasses'
          message = `Dear ${firstName},<br><br>Thank you for registering for the First Free Week class on Cells and Ecology! You can access the classes with the Zoom links below.<br><br>Cells Masterclass: March 6th, 7pm to 8:30pm<br>https://us06web.zoom.us/j/82332314843?pwd=93Evz4w3XfjxWz7TsihdQi4ba8QfLE.1<br>Meeting ID: 823 3231 4843<br>Passcode: 286207<br><br>Ecology Masterclass: March 9th, 3pm to 4:30pm<br>https://us06web.zoom.us/j/83672138196?pwd=XlYFPjWTmRZ4BY3jFBDH8z5OjZydPD.1<br>Meeting ID: 836 7213 8196<br>Passcode: 410883<br><br>Note: After the classes, the recordings will be updated to the Google Drive <a href="https://u48917275.ct.sendgrid.net/ls/click?upn=u001.gb1oIQZYL4vnMZkgmvEgigzFl42rVVPLGu-2Fe519Dvun9tuRbO-2FbM7IplLEtFJNpQ05TKwRq03odmolpArth0ldjiurLFB4dCM-2B4tixT-2F0TJ1ELxqIhhbS32gO3hKFnrEIFcd_4pE3C559McDKAd-2Fg3v7vn7eIndNn6ci9X9Lg05SN5hd0HqQd0CGpTiKRONJude4-2BSsNEXmpTWFbVn7KIYUZRVHAyrUpW7MXxjc-2FqCDWugVFXx574jVw6J7AuqIMN8xCK0iv3bPZjXrabb-2BWXwezZpQFLZE34yn6CVbJCQvmrQ3rjg5a43SNZwK-2BgAipFyVeR3EkkRmw-2B21-2FGCOBGcKlZTw-3D-3D" target="_blank">here</a><br><br>Best Regards,<br>Max<br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I wish to opt out of future promotional emails from The LC Biology Guy</label><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form>`;
          productTable = 'free_trial_temp';
        } else if (products[0] === 'Unit 1 and The Cell Masterclasses') {
          subject = 'Thank you for choosing the Free Resources!';
          message = `Dear ${firstName},<br><br>Thank you for choosing the free Unit 1 and Cell chapter notes. Here is the link to the Google Drive containing the resources: <a href="https://u48917275.ct.sendgrid.net/ls/click?upn=u001.gb1oIQZYL4vnMZkgmvEgigzFl42rVVPLGu-2Fe519Dvun9tuRbO-2FbM7IplLEtFJNpQ05TKwRq03odmolpArth0ldjiurLFB4dCM-2B4tixT-2F0TJ1ELxqIhhbS32gO3hKFnrEIFcd_4pE3C559McDKAd-2Fg3v7vn7eIndNn6ci9X9Lg05SN5hd0HqQd0CGpTiKRONJude4-2BSsNEXmpTWFbVn7KIYUZRVHAyrUpW7MXxjc-2FqCDWugVFXx574jVw6J7AuqIMN8xCK0iv3bPZjXrabb-2BWXwezZpQFLZE34yn6CVbJCQvmrQ3rjg5a43SNZwK-2BgAipFyVeR3EkkRmw-2B21-2FGCOBGcKlZTw-3D-3D" target="_blank">Here</a><br><br>We would like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>Best Regards,<br>Max<br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I wish to opt out of future promotional emails from The LC Biology Guy</label><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form>`;
          productTable = 'free_resources_emails';
        } else if (products[0] === 'Last Minute Masterclass') {
            subject = "You're In! Last Minute Masterclass Confirmed";
            message = `Hi ${firstName},<br><br>You're all set — your payment has gone through and your spot in the June 7th Last Minute Biology Masterclass is confirmed!<br><br>This class is designed to give you the smartest possible prep just before the exam, and I'm looking forward to helping you feel confident and exam-ready.<br><br>Here's what to expect next:<br><br>You'll get your personal Zoom link by Friday night (June 6th).<br><br>This link is just for you — please don't share it.<br><br>Shared links will result in immediate removal from the session.<br><br>Got a question? Just hit reply and I'll get back to you.<br><br>Let's make this your best exam yet!<br><br>Talk soon,<br>Max<br><br>We would like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br><br>Best Regards,<br>Max<br>
            <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
              <input type="checkbox" name="unsubscribe">
              <label for="unsubscribe">I wish to opt out of future promotional emails from The LC Biology Guy</label><br>
              <input type="hidden" name="email" value="${customerEmail}">
              <button type="submit">Submit</button>
            </form>`;
            productTable = 'finalclass';
        } else if (products[0] === 'Improvement Bundle') {
          subject = 'H1 Fast-Track Bundle';
          message = `Dear ${firstName},<br><br>Welcome to the 8-week Biology H1 Fast-Track Program! You can join the live Zoom session using the link(s) below.<br><br>
          ${ZoomLinksBundle}
          <br><br>You can access the notes and recordings from this Google Drive link <a href="https://drive.google.com/drive/folders/1hrn7XnsXg3W7lpWPulcWeq2h3owNJeW9" target="_blank">here</a>. The permission is set to restricted. I will grant you access as soon as possible.<br><br>If you have any troubles please send me an email at thelcbiologyguy@gmail.com<br><br>Best Regards<br>Max<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br> Best regards,<br>Max<br>
          <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
            <input type="checkbox" name="unsubscribe">
            <label for="unsubscribe">I wish to opt out of future promotional emails from The LC Biology Guy</label><br>
            <input type="hidden" name="email" value="${customerEmail}">
            <button type="submit">Submit</button>
          </form>`;
          productTable = 'bundle';
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
          
        } else {
          sendEmail(customerEmail, "Sorry", "Dear customer,<br><br>It looks like you might have purchased one of my products twice.<br>If this was a paid product, then it must have been a mistake. Please contact me if this was the case.<br><br>If you purchased my free resources package and tried to do it again and still haven't recieved an email with the necessary links, please make sure to check your spam and promotion folders. If you still don't have it after 24 hours, then please contact me at my email address: thelcbiologyguy@gmail.com<br><br>Best regards,<br>The LC Biology Guy", "Double product purchase email", db)
          console.log("email already exists in the database table of this product")
    }
   } else {

      const unsubbedresult = await db.query('SELECT email FROM unsubbed WHERE email = $1', [customerEmail])
      const promotionsresult = await db.query('SELECT email FROM promotions WHERE email = $1', [customerEmail])

      if(unsubbedresult.rows.length === 0 && promotionsresult.rows.length === 0){
        await db.query('INSERT INTO promotions (email) VALUES ($1)', [customerEmail])
      }


      //Since this is a cart purchase, check if person who purchased a cart item has dont so before, if not, add them to the cart list.
      const cartresult = await db.query('SELECT email FROM cart WHERE email = $1', [customerEmail])

      if(cartresult.rows.length === 0){
        await db.query('INSERT INTO cart (email, "first name") VALUES ($1, $2)', [customerEmail, firstName])
      }

      console.log(products)

      let zoomLinksSection = products.map(product => productLinks[product] || "").join("");

      const newMessage = `Dear ${firstName},<br><br>Thank you for purchasing a select class or classes! You can join the live Zoom session(s) using the link(s) below. <br><br>${zoomLinksSection}<br><br>If you have any troubles please send me an email at thelcbiologyguy@gmail.com<br><br>Best Regards<br>Max<br><br>We would also like to send you promotional emails from time to time. But if you don't want us to, that's okay. Just tick the box below, and submit so we can exclude you from our promotions list.<br> Best regards,<br>Max<br>
      <form action="https://www.thelcbiologyguy.ie/unsubscribe" method="POST">
          <input type="checkbox" name="unsubscribe">
          <label for="unsubscribe">I no longer wish to receive emails from The LC Biology Guy</label><br>
          <input type="hidden" name="email" value="${customerEmail}">
          <button type="submit">Submit</button>
      </form>`

      sendEmail(customerEmail, "Thank You", newMessage,"This is sending", db)
}
  }
    }
  res.status(200).json({ received: true });
});



//Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


const endpointSecret = process.env.WEBHOOK_SECRET
const API_KEY = process.env.SEND_GRID_KEY
const SendgridSender = process.env.EMAIL

sgMail.setApiKey(`${API_KEY}`)


// const zoom_1_link = process.env.ZOOM_1_LINK;
// const zoom_1_id = process.env.ZOOM_1_ID;
// const zoom_1_passcode = process.env.ZOOM_1_PASSCODE;

// const zoom_2_link = process.env.ZOOM_2_LINK;
// const zoom_2_id = process.env.ZOOM_2_ID;
// const zoom_2_passcode = process.env.ZOOM_2_PASSCODE;

// const zoom_3_link = process.env.ZOOM_3_LINK;
// const zoom_3_id = process.env.ZOOM_3_ID;
// const zoom_3_passcode = process.env.ZOOM_3_PASSCODE;

// const zoom_4_link = process.env.ZOOM_4_LINK;
// const zoom_4_id = process.env.ZOOM_4_ID;
// const zoom_4_passcode = process.env.ZOOM_4_PASSCODE;

// const zoom_5_link = process.env.ZOOM_5_LINK;
// const zoom_5_id = process.env.ZOOM_5_ID;
// const zoom_5_passcode = process.env.ZOOM_5_PASSCODE;

// const zoom_6_link = process.env.ZOOM_6_LINK;
// const zoom_6_id = process.env.ZOOM_6_ID;
// const zoom_6_passcode = process.env.ZOOM_6_PASSCODE;




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
    res.render("landing.ejs", {
      title: "Warning",
      message: "By closing this pop up or clicking the button below, you agree to not share any of my paid for material after purchasing it yourself.",
      button: "Understood",
    })

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
  res.render("landing.ejs", {
    title: "Success!",
    message: "You should recieve a confirmation email sent to the address you entered at checkout. Be sure to check your spam or promotions folders just in case it gets filtered there. If you do not recieve an email after 24 hours please contact me at: thelcbiologyguy@gmail.com. Thanks!",
    button: "Close",
  })
})

app.get("/cancel", (req, res) => {
  res.render("landing.ejs", {
    title: "You cancelled your purchase",
    message: "Feel free to alter your cart, or click the bag icon again to head back to checkout.",
    button: "Close",
  })
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
// //       const result = await db.query(`
// // SELECT email FROM promotions
// // OFFSET 999;
// // `);
  
// //       const emails = result.rows.map(row => row.email); // Extract email addresses
  

//   const emails = ["karlfleming64@gmail.com", "ksfwebdesigns@gmail.com"]

//         if (emails.length === 0) {
//         console.log('No emails found to send.');
//       } else {
//         console.log('Emails sent')
//       }


//   const msg = {
//     to: emails, // Array of recipients
//     from: SendgridSender, // Verified sender
//     subject: 'My Biggest Class To Date',
//     html: `Hey<br><br>Leaving Cert Biology can be overwhelming — but not if you know the right topics<br><br>On Saturday, June 7th, I'm running a live, 6-hour revision class that focuses on the 8–9 key topics that show up year after year. These topics complement the free resources.<br><br>This isn’t guesswork — it’s smart, pattern-based revision built from years of exam analysis. You'll get:<br><br>✅ A full-day live session<br>✅ Instant access to the replay<br>✅ Notes from the class (perfect for last-minute review)<br>✅ A clear strategy just 3 days before the exam<br><br>It’s aimed at Higher Level students who want to walk into the exam with confidence — whether you're aiming for a H1 or just want to lock in marks where they matter most.<br><br>All this for €30.<br><br>👉 Reserve your place now: https://www.thelcbiologyguy.ie/landing<br><br>You'll thank yourself on exam day.<br><br>Best regards<br>Max<br><br> If you'd like to opt-out of future promotional emails, please click <a href="https://www.thelcbiologyguy.ie/" target="_blank">here</a> and scroll to the bottom of the page to submit your email. Thanks!`
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




app.post('/create-checkout-session', async (req, res) => {
  const { cart } = req.body;

  console.log('Cart after sending:', cart);  // Log the cart to ensure it's not empty or undefined

  // Check if cart is empty or undefined
  if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
  }

  // Create an array of line items for Stripe Checkout
  const lineItems = cart.map(item => ({
          price: item.priceId,  // ✅ Use Stripe's pre-defined Price ID
          quantity: item.quantity,
  }));

  try {
      // Create a Checkout session with Stripe
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${process.env.DOMAIN}/done`,
          cancel_url: `${process.env.DOMAIN}/cancel`,
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
      });

      // Send the session ID to the frontend
      res.json({ sessionId: session.id });
  } catch (err) {
      console.error('Error creating checkout session:', err);
      res.status(500).json({ error: 'Failed to create checkout session' });
  }
});



// Create checkout session
app.post("/create-checkout-session-not-cart", async (req, res) => {
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