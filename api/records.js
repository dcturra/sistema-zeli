const { kv } = require('@vercel/kv');

// Fallback storage em memória
let memoryStorage = [];

// GET - Buscar todos os registros
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
            // Buscar todos os registros
            try {
                const records = await kv.get('records') || [];
                res.status(200).json(records);
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                res.status(200).json(memoryStorage);
            }
        } else if (req.method === 'POST') {
            // Criar novo registro
            const record = req.body;
            record.id = Date.now().toString(); // ID único
            record.date = new Date().toISOString();
            
            try {
                const records = await kv.get('records') || [];
                records.unshift(record); // Adicionar no início
                await kv.set('records', records);
                res.status(201).json(record);
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                memoryStorage.unshift(record);
                res.status(201).json(record);
            }
        } else if (req.method === 'DELETE') {
            // Limpar todos os registros
            try {
                await kv.del('records');
                res.status(200).json({ message: 'Todos os registros foram removidos' });
            } catch (kvError) {
                console.log('Vercel KV falhou, usando armazenamento em memória:', kvError.message);
                memoryStorage = [];
                res.status(200).json({ message: 'Todos os registros foram removidos' });
            }
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de registros:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 