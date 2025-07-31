// Temporariamente desabilitando Vercel KV para teste
// const { kv } = require('@vercel/kv');

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
            console.log('GET - Retornando registros da memória:', memoryStorage.length);
            res.status(200).json(memoryStorage);
        } else if (req.method === 'POST') {
            // Criar novo registro
            const record = req.body;
            record.id = Date.now().toString(); // ID único
            record.date = new Date().toISOString();
            
            console.log('POST - Salvando registro na memória:', record);
            memoryStorage.unshift(record);
            res.status(201).json(record);
        } else if (req.method === 'DELETE') {
            // Limpar todos os registros
            console.log('DELETE - Limpando registros da memória');
            memoryStorage = [];
            res.status(200).json({ message: 'Todos os registros foram removidos' });
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de registros:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 