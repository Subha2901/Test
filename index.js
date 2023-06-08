const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello,world');
});

app.post('/', (req, res) => {
    console.log("Post request received: ", req.body);

    const { message, user, members } = req.body;

    members.forEach((member) => {
        if (!member.user.online) {
            if (!member.user.online) {
                let phoneNumber = member.user.phoneNumber;
                if (phoneNumber.length === 10) {
                    phoneNumber = "+91" + phoneNumber;
                }
            }
            console.log(phoneNumber + typeof (phoneNumber));
            twilioClient.messages.create({
                body: `You have a new message from ${user}. The message is: ${message.text}`,
                //from: '+15074486692',
                messagingServiceSid: messagingServiceSid,
                to: phoneNumber,
            })
                .then(() => console.log('Message sent!'))
                .catch((err) => console.log(err));
        } else {
            console.log(`The user ${member.user.fullName} is already online.`);
        }
    });

    return res.status(200).send('Message sent!');
});



    //twilioClient.messages.create({
    //    body: `You have a new message from` + message.text,
    //                    from: '+15074486692',
    //                    messagingServiceSid: messagingServiceSid,
    //                    to: '+919903806308'
    //                })
    //                    .then(() => console.log('Message sent!', message.sid))
    //                    .catch((err) => console.log(err));
    //        //    }
    //        //})

    //    return res.status(200).send('Message sent!');


app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));