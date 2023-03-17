const express = require("express");
const fileUpload = require("express-fileupload");
const nodemailer = require("nodemailer");
const xlsx = require("xlsx");
const cors = require("cors");
require("dotenv").config();

const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(fileUpload());

app.post("/upload", async function (req, res) {
  try {
    /* File Upload*/
    let emailList;
    let emailListUplaodPath;


    let domainList;
    let domainListUplaodPath;

    // let attachment;
    // let attachmentUploadPath;

    let { subject, mailContent, emailid, password } = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded");
      return res.status(400).send("No files were uploaded.");
    }

    emailList = req.files.emailList;
    emailListUplaodPath = __dirname + "/upload/" + emailList.name;

    domainList = req.files.domainList;
    domainListUplaodPath = __dirname + "/uploads/" + domainList.name;

    // attachment = req.files.attachment;
    // attachmentUploadPath = __dirname + "/upload/" + attachment.name;

    await emailList.mv(emailListUplaodPath);
    await domainList.mv(domainListUplaodPath);
    // await attachment.mv(attachmentUploadPath);
    /* File Upload Ends*/

    /* Reading Excel File */
    const workbook = xlsx.readFile(`./upload/${emailList.name}`);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const emails = [];
    for (let row in worksheet) {
      emails.push(worksheet[row].v);
    }
    emails.shift();
    emails.pop();
    /* Reading Excel File Ends*/


    const workbook1 = xlsx.readFile(`./uploads/${domainList.name}`);
    const worksheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
    const domains = [];
    for (let row in worksheet1) {
      domains.push(worksheet1[row].v);
    }
    domains.shift();
    domains.pop();

    /* Sending Mails */
    const client = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailid,
        // user: process.env.EMAIL,password
        pass: password,
        // pass: process.env.PASSWORD,
      },
    });

    // const options = {
    //     from: process.env.EMAIL,
    //     subject: subject,

    //     text: emails + mailContent,
    //     attachments: [
    //         {
    //             filename: attachment.name,
    //             path: './upload/'+attachment.name
    //         }
    //     ]
    // }

    for (let i = 0; i < emails.length; i++) {
      const options = {
        from: process.env.EMAIL,
        subject: "Re : " + domains[i] + ":"+" " + subject,
        text: "Hi" + domains[i] +""+ mailContent,
        html: `<!DOCTYPE html>
        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        
        <head>
            <title></title>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
            <!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Alegreya" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
            <!--<![endif]-->
            <style>
                * {
                    box-sizing: border-box;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: inherit !important;
                }
        
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                }
        
                p {
                    line-height: inherit
                }
        
                .desktop_hide,
                .desktop_hide table {
                    mso-hide: all;
                    display: none;
                    max-height: 0px;
                    overflow: hidden;
                }
        
                @media (max-width:660px) {
        
                    .desktop_hide table.icons-inner,
                    .social_block.desktop_hide .social-table {
                        display: inline-block !important;
                    }
        
                    .icons-inner {
                        text-align: center;
                    }
        
                    .icons-inner td {
                        margin: 0 auto;
                    }
        
                    .image_block img.big,
                    .row-content {
                        width: 100% !important;
                    }
        
                    .mobile_hide {
                        display: none;
                    }
        
                    .stack .column {
                        width: 100%;
                        display: block;
                    }
        
                    .mobile_hide {
                        min-height: 0;
                        max-height: 0;
                        max-width: 0;
                        overflow: hidden;
                        font-size: 0px;
                    }
        
                    .desktop_hide,
                    .desktop_hide table {
                        display: table !important;
                        max-height: none !important;
                    }
                }
            </style>
        </head>
        
        <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        
            <h2>Hi ${domains[i]}</h2>
        
        
            ${mailContent}
        
        
        
        
        
        </body>
        
        </html>`,
        // attachments: [
        //   {
        //     filename: attachment.name,
        //     path: "./upload/" + attachment.name,
        //   },
        // ],
      };


      // if (emails && emails.length > 0 && options && options.to) {
      //   await client.sendMail(options);
      //   console.log("Success: " + options.to);
      //   io.emit("mailSuccess", { email: options.to });
      // } else {
      //   console.log("No recipients defined");
      // }

      options.to = emails[i];
      await client.sendMail(options);
      console.log("Success: " + options.to);
      io.emit("mailSuccess", { email: options.to });
    }
    /* Sending Mails Ends*/

    return res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      message: "Internal Server Error",
    });
  }
});

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
