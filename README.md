# Welcome
I made this site for a client. It sells placements for zoom classes and also has links to free notes targeting biology students. Currently a work in progress (nearing completion) though the site is used by my client's customers as of Jan 2025
I used Bootstrap to help with styling the site and I used EJS for templating. I used Node/Express.js for the server side code and I use a postgreSQL database to store customer email addresses so that we can contact them later on with promotional messages.

## The Client
Max is the founder of TheLCBiologyGuy. A biology grinds school specifically aimed at students taking the leaving certificate biology exam in Ireland. He came to me after hearing about my other work in web development via my social media. He asked if I could make him a website that would allow customers to purchase a placement for a zoom class. Also, he wanted each customer to automatically recieve an email with the link to the zoom class so they could join it at the stated time and date.



## The Solution
Below are some of the ideas I came up with to make this site not just work, but make it special.
### Stripe and Sendgrid
My idea was to simple. Purchases are made through a Stripe gateway. Here the customer will enter their email address. The server would then use a stripe webhook to get this address upon successful checkout. Then, I use Sendgrid to send an email to the customer with the link to access the digital product. The code for sending the email is included at the end of the stripe webhook. This way, the email is sent to the customer after every successful checkout, leaving emailing proccess completely automated.

### Brand 
I also went and created a logo and colour scheme for Max's new website. The various green colours give the appropriate atmosphere for a biology based grinds school. I also liked how bootstrap's components looked modern and sleek, which also was inline with the site's feel of a professional science school. Creating this new brand scheme prsents many more oppertunities for my client to grow his online presence, using this scheme to generate email templates later down the line to create better looking emails. 

### Google Drive
I set up my own Google Drive where I uploaded videos to showcase when a major update of the site was ready. This allowed the client to see for themselves the progress being made, and allowed him to leave comments about things he may want changed or thinks he wanted to keep. 

## To-Do list
- Paid products page to show an updating number on each product that shows how many placements are left.
- Add cookies
