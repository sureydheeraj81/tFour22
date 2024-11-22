const subscriptionPaymentFinal = require("../models/subscription_payment_final");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SMSClass = require("./SMSClass");
const nodemailer = require('nodemailer');
const sms = new SMSClass();



const MAX_FILE_SIZE = 750 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/PaymentReceipt/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }
});

const uploadPDF = upload.single('path_sub_pdf');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.submitSubsPaymentFinal = async (req, res) => {
  try {
    uploadPDF(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "File size is too large. Maximum allowed size is 750 KB.", success: false });
        }
        return res.status(500).json({ message: "Error in file upload", success: false, error: err.message });
      }

      const {
        name, state_id, address, email, mobile, region_name, subs_receiptNo, subs_receiptAmt,
        GST_name, GST_number, user_reg_id, cors_plan, subscription_charge, GST_amt, gst_receiptAmt, sub_gst
      } = req.body;



      const dateCreatedInKolkata = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('default', { month: 'short' });
      const year = String(date.getFullYear()).slice(-2);
      const datePrefix = `${region_name === "region-1" ? 'R1' : 'R2'}-${day}${month}${year}-`;

      const lastAppNum = await subscriptionPaymentFinal.findAll({
        order: [['ack_no', 'DESC']],
        limit: 1,
      });

      let ack_no;
      if (lastAppNum.length > 0) {
        const lastAckNo = lastAppNum[0].ack_no;
        const lastNumber = parseInt(lastAckNo.split('-00').pop(), 10);
        ack_no = `${datePrefix}${(lastNumber + 1).toString().padStart(3, '0')}`;
      } else {
        ack_no = `${datePrefix}001`;
      }


      const formData = {
        ack_no,
        subs_receiptNo,
        subs_receiptAmt,
        gst_recieptAmt: GST_amt,
        sub_gst,
        name,
        email,
        region_name,
        user_reg_id,
        cors_plan,
        subscription_charge,
        mobile,
        address,
        state_id,
        date_created: dateCreatedInKolkata,
        GST_name: GST_name || null,
        GST_number: GST_number || null,
        gst_receiptAmt,
        path_sub_pdf: req.file ? req.file.path : null,
      };

      const createdFormData = await subscriptionPaymentFinal.create(formData);

      const mailOptions = {
        from: 'cors.surveyofindia@gmail.com',
        to: email,
        subject: 'CORS Subscription',
        text: `Dear ${formData.name},\n\nYour order for the purchase of CORS Products and Services has been placed successfully. Your order Acknowledgement Number is ${formData.ack_no}. Please keep this number for future correspondence. On successful verification of payment details, your subscription will be activated within 24 hours.\n\nTeam CORS\nGeodetic And Research Branch\nSURVEY OF INDIA\nThis is a system-generated email, please do not reply to this email.`
      };

      
     const sms_texts= `Dear ${formData.name} Thank you for purchasing subscriptions for CORS Services. Your order id is ${formData.ack_no}. Your services will be activated within 24 working hours, after successful verification of documents. Team CORS GRB`
      await sms.send_sms(
        formData.mobile,
        sms_texts,
        process.env.PEID,
        process.env.NEW_SUB_TEMPLATEID
      );

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        message: 'Form data submitted successfully!',
        data: createdFormData,
        success: true,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error in details submission!", success: false, error: error.message });
  }
};

exports.getSubsPaymentFinal = async (req, res) => {
  try {
    let getData = await subscriptionPaymentFinal.findAll();

    if (getData.length === 0) {
      return res
        .status(200)
        .send({ message: "Data not found!", success: true });
    }

    res
      .status(200)
      .send({ message: "Data fetched successfully!", success: true, data: getData });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in details fetching!", success: false, error });
  }
};

exports.updateSubsPaymentFinal = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({
      message: "Error in final payment details updation",
      success: false,
      error,
    });
  }
};
























