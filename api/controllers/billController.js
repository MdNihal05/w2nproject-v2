const Bill = require("../models/Bill");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "bills",
        public_id: fileName,
        resource_type: "auto"
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const addBill = async (req, res) => {
  try {
    const { category, amount, note, name, date } = req.body;
    const userId = req.user.user_id;
    let fileUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, file.originalname)
      );
      const uploadResults = await Promise.all(uploadPromises);
      fileUrls = uploadResults.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
        name: result.display_name
      }));
    }

    const bill = await Bill.create({
      category,
      amount,
      note,
      date,
      name,
      user_id: userId,
      files: fileUrls
    });
    console.log(fileUrls);
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBills = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const bills = await Bill.find({ user_id: userId }).sort({ date: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const bill = await Bill.findOne({ _id: id, user_id: userId });

    if (!bill) return res.status(404).json({ error: "Bill not found" });

    if (bill.files && bill.files.length > 0) {
      const deletePromises = bill.files.map((file) =>
        cloudinary.uploader.destroy(file.public_id)
      );
      await Promise.all(deletePromises);
    }

    await Bill.findByIdAndDelete(id);
    res.json({ message: "Bill and associated files deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const describeBills = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const bills = await Bill.find({ user_id: userId });

    if (!bills.length) {
      return res.json({ message: "No bills found." });
    }

    const formattedBills = bills.map((bill) => ({
      category: bill.category,
      amount: bill.amount,
      date: bill.date,
      name: bill.name
    }));

    const prompt = `
Analyze the following list of bills:

${JSON.stringify(formattedBills, null, 2)}

Provide the following:
- Total amount spent
- Average bill amount
- Highest and lowest bill
- Spending breakdown by category
- Monthly spending summary
- Insights on spending patterns

Format the response in clear Markdown.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.setHeader("Content-Type", "text/markdown");
    res.json({ message: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBill,
  getBills,
  deleteBill,
  describeBills
};
