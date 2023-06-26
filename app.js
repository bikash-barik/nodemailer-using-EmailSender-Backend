const express = require("express");
const fileUpload = require("express-fileupload");
const nodemailer = require("nodemailer");
const validator = require("email-validator");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config();
const deepEmailValidator = require("deep-email-validator");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(fileUpload());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Emails Sender APIs is running..");
});

const axios = require("axios");

// const ZEROBOUNCE_API_KEY = '5931df3f540a4c9f90fd77e18ef3291a';
// const EMAIL_TO_VALIDATE = 'barikbikashinfo@gmail.com';
// //https://api.zerobounce.net/v2/validate?apikey=${ZEROBOUNCE_API_KEY}&email=${EMAIL_TO_VALIDATE}
// axios.get(`https://api.zerobounce.net/v2/validate?api_key=8d9b2658c2084b4fb121d987fee82c5f&email=barikbikashinfo@gmail.com&ip_address=`)
//   .then(response => {
//     const { status, sub_status, email, did_you_mean, domain, mx_found } = response.data;

//     console.log('Status:', status);
//     console.log('Sub status:', sub_status);
//     console.log('Email:', email);
//     console.log('Did you mean:', did_you_mean);
//     console.log('Domain:', domain);
//     console.log('MX record found:', mx_found);
//   })
//   .catch(error => {
//     console.error('Error:', error.response.data);
//   });

//get the data and show the data

app.post("/uploadFiles", async function (req, res) {
  let domainList;
  let domainListUplaodPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files were uploaded");
    return res.status(400).send("No files were uploaded.");
  }

  domainList = req.files.domainList;
  domainListUplaodPath = __dirname + "/uploads/" + domainList.name + ".txt";
  fs.writeFileSync(domainListUplaodPath, domainList.data.toString());

  const domains = fs
    .readFileSync(domainListUplaodPath, { encoding: "utf8" })
    .split("\n");
  domains.shift();
  domains.pop();
  res.json({ domains });
});

//domain country name
const dns = require("dns");
const geoip = require("geoip-lite");

// const domain = "csm.tech";

// dns.lookup(domain, (err, address) => {
//   if (err) {
//     console.error(`Error verifying DNS: ${err}`);
//   } else {
//     const country = geoip.lookup(address)?.country;
//     if (country) {
//       console.log(`Country name: ${country}`);
//     } else {
//       console.error(`Error getting country name for domain ${domain}`);
//     }
//   }
// });

app.post("/domains", (req, res) => {
  let domainList;
  let domainListUplaodPath;
console.log("hI")
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files were uploaded");
    return res.status(400).send("No files were uploaded.");
  }
  console.log("hI")
  
  domainList = req.files.domainList;
  domainListUplaodPath = __dirname + "/uploads/" + domainList.name + ".txt";
  fs.writeFileSync(domainListUplaodPath, domainList.data.toString());

  const domains = fs
    .readFileSync(domainListUplaodPath, { encoding: "utf8" })
    .split("\n")
    .filter(
      (domain) =>
        ![
          "blog",
          "wordpress",
          "gov",
          "tumblr",
          "multiply",
          "tripod.com",
          "org",
          "ebay.com",
          ".ac",
          ".sh",
          "church",
          "typepad.com",
          "tripadvisor.com",
          ".hk",
          ".pk",
          "online",
          "imdb.com",
          "youtube.com",
          ".tv",
          "channel",
          "news",
          "press",
          "apply",
          "school",
          "college",
          "edu",
          "javadevjournal.com",
          ".in",
          "facebook.com",
          "twitter.com",
          "pintrest",
          "instragram",
          "yellowpages.com",
          "whitepages.com",
          "walmart.com",
          "expedia.com",
          "media",
          "groupon.com",
          "telegraph",
          "wayfair.com",
          "nih.",
          "apple.com",
          "reddit.com",
          "daily",
          "today",
          "cnet.com",
          "glassdoor.com",
          "target.com",
          "yelp.com",
          "indeed.com",
          "justdial.com",
          "ranker.com",
          "customercare",
          "domain",
          "noreply",
          "nobody",
          "webmd.com",
          "mapquest.com",
          "glossier.com",
          "fresh.com",
          "manta.com",
          "dailymail",
          "weather.com",
          "holiday",
          "weleda.com",
          "follain.com",
          "agutsygirl.com",
          "pcaskin.com",
          "kiehls.com",
          "cargurus.com",
          "foursquare.com",
          "animations.com",
          "design",
          "chron.com",
          "people.com",
          ".tech",
          ".info",
          "pcmag.com",
          "google",
        ].includes(domain.trim().toLowerCase())
    );
  domains.shift();
  domains.pop();

  const results = [];

  const lookupPromise = (domain) => {
    return new Promise((resolve, reject) => {
      dns.lookup(domain, (err, address) => {
        if (err) {
          reject(err);
        } else {
          const country = geoip.lookup(address)?.country;
          if (country) {
            resolve({ domain, country });
          } else {
            reject(`Error getting country name for domain ${domain}`);
          }
        }
      });
    });
  };

  Promise.all(domains.map((domain) => lookupPromise(domain.trim())))
    .then((results) => {
      res.json(results);
      // console.log(results);
    })
    .catch((err) => {
      console.error(`Error verifying DNS: ${err}`);
      res.status(500).send("Internal server error");
    });
});



//email validation
//email validation
app.post("/validate-emails", (req, res) => {
  let emailList;
  let emailListUplaodPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files were uploaded");
    return res.status(400).send("No files were uploaded.");
  }

  emailList = req.files.emailList;
  emailListUplaodPath = __dirname + "/upload/" + emailList.name + ".txt";
  fs.writeFileSync(emailListUplaodPath, emailList.data.toString());

  const emails = fs
    .readFileSync(emailListUplaodPath, { encoding: "utf8" })
    .split("\n");
  emails.shift();
  emails.pop();

  const blacklist = [
    "domain",
    "Job",
    "feedback",
    "google",
    "helpdesk",
    "donate",
    "booking",
    "subscribe",
    "postmaster",
    "ticket",
    "police",
    "enquiries",
    "privacy",
    "example",
    "name",
    "email",
    ".png",
    ".jpeg",
    ".jpg",
    ".gif",
    "reception",
    "communication",
    "community",
    "register",
    ".life",
    "firstname",
    "lastname",
    "customer.",
    "customercare",
    "wecare",
    "customerservice",
    "CustomerAssistance",
    "NDW@MSN.com",
    "editor",
    "frontdesk",
    "massage@gmail.com",
    ".expert",
    "hi@",
    ".mx",
    "police",
    "mail@",
    "questions",
    "exam",
    "information",
    "webcam",
    "license",
    ".io",
    "Wixpress",
    "police",
    ".site",
    ".to",
    ".make",
    ".xyz",
    ".gcb",
    "hello",
    ".studio",
    "registra",
    "sentry",
    "reservation",
    "%",
    "e-mail",
    "financial",
    "bank",
    "credit",
    "card",
    "auto",
    "www.",
    "answer",
    ".info",
    "enquiry",
    "press",
    "student",
    "news",
    "camera",
    "secretariat",
    "contribute",
    "donate",
    "boxoffice",
    ".js",
    "president",
    "inquiries",
    "member",
    "gov",
    "help",
    ".css",
    "webmaster",
    "sample",
    "test",
    "john@doe.com",
    "x@y.com",
    ".svg",
    "customerservices",
    "recruit",
  ];

  const validEmails = [];
  const invalidEmails = [];

  for (let email of emails) {
    email = email.trim(); // remove whitespace
    if (validator.validate(email) && !blacklist.includes(email)) {
      validEmails.push(email);
    } else {
      invalidEmails.push(email);
    }
  }

  res.json({ validEmails, invalidEmails });
});

app.post("/validate-emails", async (req, res) => {
  let emailList;
  let emailListUploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files were uploaded");
    return res.status(400).send("No files were uploaded.");
  }

  emailList = req.files.emailList;
  emailListUploadPath = __dirname + "/upload/" + emailList.name + ".txt";
  fs.writeFileSync(emailListUploadPath, emailList.data.toString());
  const emails = fs
    .readFileSync(emailListUploadPath, { encoding: "utf8" })
    .split("\n");
  emails.shift();
  emails.pop();
  const validEmails = [];
  const invalidEmails = [];
  console.log(emails);
  for (let email of emails) {
    email = email.trim(); // remove whitespace
    const { wellFormed, validDomain, validMailbox } = await deepEmailValidator.validate(email);
    console.log("well"+wellFormed);
    if (wellFormed && validDomain && validMailbox) {
      validEmails.push(email);
    } else {
      invalidEmails.push(email);
    }
  }

  res.json({ validEmails, invalidEmails });
});

// properly with api mail validator

app.post("/validate-emails", async (req, res) => {
  let emailList;
  let emailListUploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files were uploaded");
    return res.status(400).send("No files were uploaded.");
  }

  emailList = req.files.emailList;
  emailListUploadPath = __dirname + "/upload/" + emailList.name + ".txt";
  fs.writeFileSync(emailListUploadPath, emailList.data.toString());

  const emails = fs
    .readFileSync(emailListUploadPath, { encoding: "utf8" })
    .split("\n");
  emails.shift();
  emails.pop();

  const validEmails = [];
  const invalidEmails = [];

  for (let email of emails) {
    email = email.trim(); // remove whitespace

    const params = {
      api_key: "8d9b2658c2084b4fb121d987fee82c5f",
      email: email,
      ip_address: req.ip,
    };

    try {
      const response = await axios.get(
        "https://api.zerobounce.net/v2/validate",
        {
          params: params,
        }
      );

      const { status,domain } = response.data;
      console.log(domain)
      if (validator.validate(email)) {
        if (status === "valid") {
          validEmails.push(email);
        } else if (status === "undefined") {
          validEmails.push(email);
        }else if (status === "catch-all") {
          invalidEmails.push(`${email} is a catch-all address`);
        }else if (status === "unknown") {
          invalidEmails.push(`${email} is an unknown address`);
        } else {
          invalidEmails.push(email);
        }
      } else {
        invalidEmails.push(email);
      }
    } catch (error) {
      console.error(error);
      invalidEmails.push(email);
    }
  }

  res.json({ validEmails, invalidEmails });
});


//emailexractor
const https = require("https");
const { Console } = require("console");

// Specify the website's URL
const urls = "appnaapp.com";

// Make an HTTP request to the website
https
  .get(`https://${urls}`, (res) => {
    let data = "";

    // Append each incoming chunk of data to the 'data' variable
    res.on("data", (chunk) => {
      data += chunk;
    });

    // Once all the data has been received, look for email addresses using a regular expression
    res.on("end", () => {
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
      const matches = data.match(emailRegex);

      // Print the email addresses found
      if (matches) {
        console.log(`Email addresses found on ${urls}:`);
      } else {
        console.log(`No email addresses found on ${urls}.`);
      }
    });
  })
  .on("error", (err) => {
    console.log(`Error: ${err.message}`);
  });

//api

const puppeteer = require("puppeteer");

app.post("/extract-emails", async (req, res) => {
  let domainList;
  let domainListUploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files were uploaded");
    return res.status(400).send("No files were uploaded.");
  }

  domainList = req.files.domainList;
  domainListUploadPath = __dirname + "/uploads/" + domainList.name + ".txt";
  fs.writeFileSync(domainListUploadPath, domainList.data.toString());

  const domains = fs
    .readFileSync(domainListUploadPath, { encoding: "utf8" })
    .split("\n");
  domains.shift();
  domains.pop();
  console.log(domains);
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const bannedWords = ["domain"];

  let emailAddresses = {};

  let numResponsesReceived = 0;
  const numDomains = domains.length;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < numDomains; i++) {
    const domain = domains[i];
    console.log(domain);
    const url = `https://${domain}`;

    try {
      await page.goto(url);
      const pages = await browser.pages();
      for (let j = 0; j < pages.length; j++) {
        const page = pages[j];
        const pageUrl = page.url();
        const matches = await page.$$eval(
          "a[href]",
          (links, bannedWords) =>
            links
              .map((link) =>
                link.href.match(
                  /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
                )
              )
              .filter((matches) => matches !== null)
              .flat()
              .filter((match, index, self) => self.indexOf(match) === index)
              .filter((match) => {
                for (let i = 0; i < bannedWords.length; i++) {
                  if (match.includes(bannedWords[i])) {
                    return false;
                  }
                }
                return true;
              }),
          bannedWords
        );
        if (matches && matches.length > 0) {
          emailAddresses[pageUrl] = matches;
        }
      }
    } catch (error) {
      console.error(error);
    }

    numResponsesReceived++;
    if (numResponsesReceived === numDomains) {
      await browser.close();
      if (Object.keys(emailAddresses).length > 0) {
        res.send(emailAddresses);
        console.log(emailAddresses);
      } else {
        res.send("No email addresses found in the uploaded file.");
      }
    }
  }
});


//-----------------------------------------------------------------------------------------



// email send
app.post("/upload", async function (req, res) {
  try {
    const { subject, mailContent, emailid, password } = req.body;

    const files = req.files;
    // Check if files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded");
      return res.status(400).send("No files were uploaded.");
    }

    // Access the uploaded files
    const emailList = req.files.emailList;
    const domainList = req.files.domainList;

    // Specify the paths to save the files
    const emailListUploadPath = __dirname + "/uploads/" + emailList.name + ".txt";
    const domainListUploadPath = __dirname + "/uploads/" + domainList.name + ".txt";

    // Save the files to the specified paths
    await emailList.mv(emailListUploadPath);
    await domainList.mv(domainListUploadPath);

    /* Reading Text Files */
    const fs = require("fs");

    const emails = fs.readFileSync(emailListUploadPath, { encoding: "utf8" })
      .split("\n")
      .filter((email) => email.trim() !== ""); // Remove empty lines

    const domains = fs.readFileSync(domainListUploadPath, { encoding: "utf8" })
      .split("\n")
      .filter((domain) => domain.trim() !== ""); // Remove empty lines
    /* Reading Text Files Ends*/

    /* Sending Mails */
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailid,
        pass: password,
      },
    });

    for (let i = 0; i < emails.length; i++) {
      const options = {
        from: emailid,
        to: emails[i],
        subject: `Re: ${domains[i]} - ${subject}`,
        text: `Hi ${domains[i]},\n\n${mailContent}`,
      };

      await transporter.sendMail(options);
      console.log("Success: " + options.to);
      io.emit("mailSuccess", { email: options.to });
    }
    /* Sending Mails Ends*/

    return res.status(200).json({
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      message: "Internal Server Error",
    });
  }
});


//-----------------------------------------------------------------------------------------------


const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});
//localhost is not equal to 127.0.0.1

io.on("connection", (socket) => {
  console.log(socket.id);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
