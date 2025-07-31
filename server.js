const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diario_zeli', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB com sucesso!');
});

// Schemas do MongoDB
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

const medicationSchema = new mongoose.Schema({
    name: String,
    time: String,
    isFreeTime: { type: Boolean, default: false }
});

const technicianSchema = new mongoose.Schema({
    name: String
});

// Models
const Record = mongoose.model('Record', recordSchema);
const Medication = mongoose.model('Medication', medicationSchema);
const Technician = mongoose.model('Technician', technicianSchema);

// Rotas da API

// GET - Obter todos os registros
app.get('/api/records', async (req, res) => {
    try {
        const records = await Record.find().sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
});

// POST - Criar novo registro
app.get('/api/records', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
});

// POST - Criar novo registro (correção)
app.post('/api/records', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
});

// DELETE - Deletar todos os registros
app.delete('/api/records', async (req, res) => {
    try {
        await Record.deleteMany({});
        res.json({ message: 'Todos os registros foram deletados' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar registros' });
    }
});

// GET - Obter todos os medicamentos
app.get('/api/medications', async (req, res) => {
    try {
        const medications = await Medication.find().sort({ time: 1 });
        res.json(medications);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar medicamentos' });
    }
});

// POST - Criar novo medicamento
app.post('/api/medications', async (req, res) => {
    try {
        const newMedication = new Medication(req.body);
        await newMedication.save();
        res.status(201).json(newMedication);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar medicamento' });
    }
});

// DELETE - Deletar medicamento
app.delete('/api/medications/:id', async (req, res) => {
    try {
        await Medication.findByIdAndDelete(req.params.id);
        res.json({ message: 'Medicamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar medicamento' });
    }
});

// GET - Obter todos os técnicos
app.get('/api/technicians', async (req, res) => {
    try {
        const technicians = await Technician.find().sort({ name: 1 });
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar técnicos' });
    }
});

// POST - Criar novo técnico
app.post('/api/technicians', async (req, res) => {
    try {
        const newTechnician = new Technician(req.body);
        await newTechnician.save();
        res.status(201).json(newTechnician);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar técnico' });
    }
});

// DELETE - Deletar técnico
app.delete('/api/technicians/:id', async (req, res) => {
    try {
        await Technician.findByIdAndDelete(req.params.id);
        res.json({ message: 'Técnico deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar técnico' });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

            // Inicializar dados padrão se não existirem
            async function initializeDefaultData() {
                try {
                    // Verificar se já existem técnicos
                    const technicianCount = await Technician.countDocuments();
                    if (technicianCount === 0) {
                        const defaultTechnicians = [
                            { name: 'Silvana' },
                            { name: 'Palmira' },
                            { name: 'Edna' },
                            { name: 'Outro' }
                        ];
                        
                        // Inserir um por vez para evitar problemas
                        for (const tech of defaultTechnicians) {
                            await Technician.create(tech);
                        }
                        console.log('Técnicos padrão criados');
                    }

                    // Verificar se já existem medicamentos
                    const medicationCount = await Medication.countDocuments();
                    if (medicationCount === 0) {
                        const defaultMedications = [
                            { name: 'Paracetamol', time: '08:00', isFreeTime: false },
                            { name: 'Dipirona', time: '14:00', isFreeTime: false },
                            { name: 'Ibuprofeno', time: '20:00', isFreeTime: true }
                        ];
                        
                        // Inserir um por vez para evitar problemas
                        for (const med of defaultMedications) {
                            await Medication.create(med);
                        }
                        console.log('Medicamentos padrão criados');
                    }
                } catch (error) {
                    console.error('Erro ao inicializar dados padrão:', error);
                }
            }

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    initializeDefaultData();
}); 