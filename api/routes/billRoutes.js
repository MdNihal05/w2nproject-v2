const express = require('express');
const multer = require('multer');
const router = express.Router();
const { addBill, describeBills, getBills, deleteBill } = require('../controllers/billController');
const { protect } = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', protect, upload.array('files'), addBill);
router.get('/', protect, getBills);
router.get('/describe', protect, describeBills);
router.delete('/:id', protect, deleteBill);

module.exports = router;
