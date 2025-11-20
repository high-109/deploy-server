const dialogflow = require("@google-cloud/dialogflow");
const { WebhookClient, Suggestion } = require("dialogflow-fulfillment");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.post("/webhook", async (req, res) => {
  var id = res.req.body.session.substr(43);
  console.log(id);
  const agent = new WebhookClient({ request: req, response: res });

  function hi(agent) {
    console.log(`intent  =>  hi`);
    agent.add("Hello there, I am hammad from serever side!");
  }

  function fallback(agent) {
    agent.add("Fallback Intent called!");
  }

  function booking(agent) {
    const { email, phone, arrival, destination, date, number } =
      agent.parameters;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "highrated109@gmail.com",
        pass: "amgv rofz yygm hpun",
      },
    });

    agent.add(
      `Hi there, Your booking from ${arrival} to ${destination} at ${date} date has been booked for ${number} people! we sent an email at ${email} and also in your phone number ${phone} from server.!`
    );
    console.log(arrival);
    console.log(destination);
    console.log(date);
    console.log(phone);
    console.log(email);
// (async () => {
//   const info = await transporter.sendMail({
//     from: '"Hammad sheikh" <highrated109@gmail.com>',
//     to: email,
//     subject: "Your Order Has Been Booked ✔",
//     text: `Hi there, Your booking from ${arrival} to ${destination} at ${date} date has been booked for ${number} people! we sent an email at ${email} and also in your phone number ${phone} from server.!`, // plain‑text body
//   });

//   console.log("Message sent:", info.messageId);
// })();

client.messages
  .create({
    from: "whatsapp:+14155238886",
    body: "Hi there Your Message has been recived Successfully!",
    to: "whatsapp:+923142105617",
  })
  .then((message) => console.log(message.sid));


  }
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", hi);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("ticket", booking);
  agent.handleRequest(intentMap);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
