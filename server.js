const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مجلد آمن ومخفي لحفظ الملفات المرفوعة
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// استقبال البيانات والملفات
app.post('/api/order', upload.array('reviews_folder'), (req, res) => {
    try {
        const { first_name, last_name, phone, address } = req.body;
        const files = req.files || [];

        console.log('\n======================================');
        console.log('🚨 تم استقبال طلب جديد أونلاين!');
        console.log(`الاسم: ${first_name || 'فارغ'} ${last_name || 'فارغ'}`);
        console.log(`الهاتف: ${phone || 'فارغ'}`);
        console.log(`العنوان: ${address || 'فارغ'}`);
        console.log(`عدد الملفات المرفوعة: ${files.length}`);
        console.log('======================================\n');

        res.status(200).json({ status: 'success', message: 'تم حفظ طلبك بنجاح!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'خطأ في السيرفر' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل الآن بنجاح!`);
});
