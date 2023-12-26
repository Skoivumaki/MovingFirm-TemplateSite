const express = require("express")
const nodemailer = require("nodemailer")

var app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes for files
app.get("/", function (req, res) {
    res.sendFile("/index.html", { root: __dirname + "/public" });
});

app.get("/index2", function (req, res) {
    res.sendFile("/index2.html", { root: __dirname + "/public" });
});

app.get("/contact", function (req, res) {
    res.sendFile("/contact.html", { root: __dirname + "/public" });
});

app.get("/contact2", function (req, res) {
    res.sendFile("/contact2.html", { root: __dirname + "/public" });
});

app.get("/sent2", function (req, res) {
    res.sendFile("/sent2.html", { root: __dirname + "/public" });
});

app.get("/sent", function (req, res) {
    res.sendFile("/sent.html", { root: __dirname + "/public" });
});

app.get("*", function (req, res) {
    res.send("<h1>Requested page doesnt exist</h1>");
});

// Form mailing
app.post('/submit-form', (req, res) => {
    const { fname, lname, spost, puh, message } = req.body;

    if (message) {
        const emailBody = `${message}\nEmaili: ${spost}\nPhone: ${puh}`;
        const formattedBody = emailBody.replace(/\n\./g, '\n..');
        const wrappedBody = wordWrap(formattedBody, 70);

        const subject = `Message from ${fname} ${lname}`;

        // Nodemailer configuration
        const transporter = nodemailer.createTransport({
            // Tested with brevo, gmail should work
            service: 'gmail',
            auth: {
                user: 'your@gmail.com', // Replace with your Gmail address
                pass: 'your-password' // Replace with your Gmail password or an app password
            }
        });

        const mailOptions = {
            from: 'your@gmail.com', // Replace with your Gmail address
            to: 'receivers@gmail.com', // Replace with receiver
            subject: subject,
            text: wrappedBody
        };

        // Sending email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('Email /sent: ' + info.response);
                res.redirect('/sent');
            }
        });
    } else {
        res.status(400).send('Bad Request: Missing message parameter');
    }
});

//Start up
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
    console.log("Express is listening on port %d", PORT);
});

// Word wrapping function
function wordWrap(str, maxWidth) {
    let newLineStr = '\n';
    let done = false;
    let res = '';
    while (str.length > maxWidth) {
        let found = false;
        for (let i = maxWidth - 1; i >= 0; i--) {
            if (/\s/.test(str.charAt(i))) {
                res += str.substring(0, i) + newLineStr;
                str = str.substring(i + 1);
                found = true;
                break;
            }
        }
        if (!found) {
            res += str.substring(0, maxWidth) + newLineStr;
            str = str.substring(maxWidth);
        }
    }
    return res + str;
}