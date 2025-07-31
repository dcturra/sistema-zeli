const { kv } = require('@vercel/kv');

// Fallback storage em memória
let memoryStorage = [];

// GET - Buscar todos os medicamentos
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            // Buscar todos os medicamentos
            try {
                const medications = await kv.get('medications') || [];
                res.status(200).json(medications);
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                res.status(200).json(memoryStorage);
            }
        } else if (req.method === 'POST') {
            // Criar novo medicamento
            const medication = req.body;
            medication.id = Date.now().toString(); // ID único
            medication.date = new Date().toISOString();
            
            try {
                const medications = await kv.get('medications') || [];
                medications.unshift(medication); // Adicionar no início
                await kv.set('medications', medications);
                res.status(201).json(medication);
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                memoryStorage.unshift(medication);
                res.status(201).json(medication);
            }
        } else if (req.method === 'DELETE') {
            // Limpar todos os medicamentos
            try {
                await kv.del('medications');
                res.status(200).json({ message: 'Todos os medicamentos foram removidos' });
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                memoryStorage = [];
                res.status(200).json({ message: 'Todos os medicamentos foram removidos' });
            }
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de medicamentos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 