import asyncHandler from "express-async-handler";
import fs from "fs";

const uploadCSV = asyncHandler(async (req, res) => {
  let domainList;
  let domainListUplaodPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files were uploaded");
    return res.status(400).send("No files were uploaded.");
  }

  // emailList = req.files.emailList;
  // emailListUplaodPath = __dirname + "/upload/" + emailList.name + ".txt";
  // fs.writeFileSync(emailListUplaodPath, emailList.data.toString());

  domainList = req.files.domainList;
  domainListUplaodPath = __dirname + "/uploads/" + domainList.name + ".txt";
  fs.writeFileSync(domainListUplaodPath, domainList.data.toString());

  /* Reading Text File */
  // const emails = fs
  //   .readFileSync(emailListUplaodPath, { encoding: "utf8" })
  //   .split("\n");
  // emails.shift();
  // emails.pop();

  const domains = fs
    .readFileSync(domainListUplaodPath, { encoding: "utf8" })
    .split("\n");
  domains.shift();
  domains.pop();
  /* Reading Text File Ends*/
  res.json({ domains });
});

export { uploadCSV };
