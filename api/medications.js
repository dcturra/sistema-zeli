const { kv } = require('@vercel/kv');

// GET - Buscar todos os medicamentos
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            // Buscar todos os medicamentos
            const medications = await kv.get('medications') || [];
            res.status(200).json(medications);
        } else if (req.method === 'POST') {
            // Criar novo medicamento
            const medication = req.body;
            medication.id = Date.now().toString(); // ID único
            
            const medications = await kv.get('medications') || [];
            medications.push(medication);
            
            await kv.set('medications', medications);
            res.status(201).json(medication);
        } else if (req.method === 'DELETE') {
            // Deletar medicamento específico
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: 'ID do medicamento é obrigatório' });
            }
            
            const medications = await kv.get('medications') || [];
            const filteredMedications = medications.filter(m => m.id !== id);
            
            await kv.set('medications', filteredMedications);
            res.status(200).json({ message: 'Medicamento removido com sucesso' });
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de medicamentos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 