require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();
const router = express.Router();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000

//Middleware
app.use(express.json());
app.use(express.static("public"));


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