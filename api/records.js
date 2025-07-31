const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema
const recordSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    technician: String,
    pressureSystolic: Number,
    pressureDiastolic: Number,
    saturation: Number,
    heartRate: Number,
    temperature: Number,
    bowelMovement: String,
    observations: String,
    complications: String,
    administeredMedications: [String],
    otherMedications: String
});

const Record = mongoose.model('Record', recordSchema);

// CORS middleware
const corsMiddleware = cors({
    origin: ['https://dcturra.github.io', 'http://localhost:3000'],
    credentials: true
});

module.exports = async (req, res) => {
    // Apply CORS
    await new Promise((resolve) => corsMiddleware(req, res, resolve));

    try {
        switch (req.method) {
            case 'GET':
                const records = await Record.find().sort({ date: -1 });
                res.json(records);
                break;

            case 'POST':
                const newRecord = new Record(req.body);
                await newRecord.save();
                res.status(201).json(newRecord);
                break;

            case 'DELETE':
                await Record.deleteMany({});
                res.json({ message: 'Todos os registros foram deletados' });
                break;

            default:
                res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 