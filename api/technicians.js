const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema
const technicianSchema = new mongoose.Schema({
    name: String
});

const Technician = mongoose.model('Technician', technicianSchema);

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
                const technicians = await Technician.find().sort({ name: 1 });
                res.json(technicians);
                break;

            case 'POST':
                const newTechnician = new Technician(req.body);
                await newTechnician.save();
                res.status(201).json(newTechnician);
                break;

            case 'DELETE':
                const { id } = req.query;
                await Technician.findByIdAndDelete(id);
                res.json({ message: 'Técnico deletado com sucesso' });
                break;

            default:
                res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 