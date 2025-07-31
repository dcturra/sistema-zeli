const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema
const medicationSchema = new mongoose.Schema({
    name: String,
    time: String,
    isFreeTime: { type: Boolean, default: false }
});

const Medication = mongoose.model('Medication', medicationSchema);

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
                const medications = await Medication.find().sort({ time: 1 });
                res.json(medications);
                break;

            case 'POST':
                const newMedication = new Medication(req.body);
                await newMedication.save();
                res.status(201).json(newMedication);
                break;

            case 'DELETE':
                const { id } = req.query;
                await Medication.findByIdAndDelete(id);
                res.json({ message: 'Medicamento deletado com sucesso' });
                break;

            default:
                res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 