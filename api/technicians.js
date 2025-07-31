const { kv } = require('@vercel/kv');

// Fallback storage em memória
let memoryStorage = [];

// GET - Buscar todos os técnicos
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
            // Buscar todos os técnicos
            try {
                const technicians = await kv.get('technicians') || [];
                res.status(200).json(technicians);
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                res.status(200).json(memoryStorage);
            }
        } else if (req.method === 'POST') {
            // Criar novo técnico
            const technician = req.body;
            technician.id = Date.now().toString(); // ID único
            technician.date = new Date().toISOString();
            
            try {
                const technicians = await kv.get('technicians') || [];
                technicians.unshift(technician); // Adicionar no início
                await kv.set('technicians', technicians);
                res.status(201).json(technician);
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                memoryStorage.unshift(technician);
                res.status(201).json(technician);
            }
        } else if (req.method === 'DELETE') {
            // Limpar todos os técnicos
            try {
                await kv.del('technicians');
                res.status(200).json({ message: 'Todos os técnicos foram removidos' });
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                memoryStorage = [];
                res.status(200).json({ message: 'Todos os técnicos foram removidos' });
            }
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de técnicos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 