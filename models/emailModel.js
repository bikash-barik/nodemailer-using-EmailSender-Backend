const fs = require("fs");
const XLSX = require("xlsx");
const nodemailer = require("nodemailer");

class EmailModel {
  async sendEmails(emailid, password, subject, mailContent, emails, domains) {
    try {
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
      }

      return true;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to send emails.");
    }
  }

  async parseEmailFile(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data[0][0] !== "Emaillist" || data[0][1] !== "DomainList") {
        throw new Error(
          "Invalid file format. The first column should be 'Emaillist' and the second column should be 'DomainList'."
        );
      }

      const emails = [];
      const domains = [];

      for (let i = 1; i < data.length; i++) {
        const email = data[i][0];
        const domain = data[i][1];

        if (email && domain) {
          emails.push(email);
          domains.push(domain);
        }
      }

      return { emails, domains };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to parse email file.");
    }
  }
}

module.exports = new EmailModel();
