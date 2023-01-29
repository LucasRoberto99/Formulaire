require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Mailgun = require("mailgun.js");
const formData = require("form-data"); // il faut faire ça pour l'utiliser c'est comme ça que mailgun fonctionne

const app = express();
app.use(cors());
app.use(express.json());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Lucas",
  key: process.env.API_KEY_MAILGUN,
});

app.get("/", (req, res) => {
  console.log("YO");
  res.status(200).json({ message: "Welcome!" });
});

app.post("/form", async (req, res) => {
  console.log("route /form");
  try {
    const messageData = {
      from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
      to: "lucasr.prof@gmail.com",
      subject: "Hello",
      text: req.body.message,
    };

    const response = await client.messages.create(
      process.env.DOMAIN_MAILGUN,
      messageData
    );

    console.log("response>>", response);

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server has started 🤓");
});
