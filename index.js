const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 5000;
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
    origin: "*"
}))

app.use(express.json())

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.USER_NAME}`,
        pass: `${process.env.PASSWORD}`,
    },
});

contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready to Send");
    }
});

app.post("/contact", (req, res) => {

    const name = req.body.message.Name;
    const lastname = req.body.message.LastName;
    const receiving_email = req.body.message.Email;
    const phone = req.body.message.Phone;
    const message = req.body.message.Message;
    const fullname = `${name} ${lastname}`

    const mail = {
        from: name,
        to: `${process.env.USER_NAME}`,
        subject: "Portfolio Contact Form Submission",
        html:
            `<h2>Name: ${fullname}</h2>
             <h3>Email: ${receiving_email}</h3>
             <h3>Phone number: ${phone}</h3>
             <h4>Message: ${message}</h4>`,
    };
    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json({ status: "ERROR" });
        } else {
            res.json({ status: "Message Sent" });
        }
    });
});


app.listen(PORT, function () {
    console.log(`This app is listening to ${PORT}`)
})
