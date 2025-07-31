// Temporariamente desabilitando Vercel KV para teste
// const { kv } = require('@vercel/kv');

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
            console.log('GET - Retornando técnicos da memória:', memoryStorage.length);
            res.status(200).json(memoryStorage);
        } else if (req.method === 'POST') {
            // Criar novo técnico
            const technician = req.body;
            technician.id = Date.now().toString(); // ID único
            technician.date = new Date().toISOString();
            
            console.log('POST - Salvando técnico na memória:', technician);
            memoryStorage.unshift(technician); // Adicionar no início
            res.status(201).json(technician);
        } else if (req.method === 'DELETE') {
            // Limpar todos os técnicos
            console.log('DELETE - Limpando técnicos da memória');
            memoryStorage = [];
            res.status(200).json({ message: 'Todos os técnicos foram removidos' });
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de técnicos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 