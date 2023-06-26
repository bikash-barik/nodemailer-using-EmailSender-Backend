const emailModel = require("../models/emailModel");

class EmailController {
  async upload(req, res) {
    try {
      const { emailid, password, subject, mailContent } = req.body;

      const file = req.files;
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No file was uploaded");
        return res.status(400).send("No file was uploaded.");
      }

      const uploadedFile = req.files.uploadedFile;
      if (
        uploadedFile.mimetype !== "text/csv" &&
        uploadedFile.mimetype !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        console.log("Invalid file type. Only CSV or Excel files are allowed.");
        return res
          .status(400)
          .send("Invalid file type. Only CSV or Excel files are allowed.");
      }

      const filePath = __dirname + "/uploads/" + uploadedFile.name;
      await uploadedFile.mv(filePath);

      const { emails, domains } = await emailModel.parseEmailFile(filePath);

      const success = await emailModel.sendEmails(
        emailid,
        password,
        subject,
        mailContent,
        emails,
        domains
      );

      if (success) {
        return res.status(200).json({
          message: "Emails sent successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error.message,
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = new EmailController();
