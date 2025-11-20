const dialogflow = require("@google-cloud/dialogflow");
const { WebhookClient, Suggestion } = require("dialogflow-fulfillment");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "";
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
async function runChat(queryText) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // console.log(genAI)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 200,
    };

    const chat = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chat.sendMessage(queryText);
    const response = result.response;
    return response.text();
}
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

      async function fallback() {
        let action = req.body.queryResult.action;
        let queryText = req.body.queryResult.queryText;

        if (action === 'input.unknown') {
            let result = await runChat(queryText);
            agent.add(result);
            console.log(result)
        }else{
            agent.add(result);
            console.log(result)
        }
    }

  async function fallback(agent) {
     
    let action = req.body.queryResult.action;
    let queryText = req.body.queryResult.queryText;

    if (action === 'input.unknown') {
        let result = await textGeneration(queryText);
        if (result.status == 1) {
            res.send(
                {
                    fulfillmentText: result.response
                }
            );
        } else {
            res.send(
                {
                    fulfillmentText: `Sorry, I'm not able to help with that.`
                }
            );
        }
    } else {
        res.send(
            {
                fulfillmentText: `No handler for the action ${action}.`
            }
        );
    }
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
