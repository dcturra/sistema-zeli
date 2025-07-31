const { kv } = require('@vercel/kv');

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
            const records = await kv.get('records') || [];
            res.status(200).json(records);
        } else if (req.method === 'POST') {
            // Criar novo registro
            const record = req.body;
            record.id = Date.now().toString(); // ID único
            record.date = new Date().toISOString();
            
            const records = await kv.get('records') || [];
            records.unshift(record); // Adicionar no início
            
            await kv.set('records', records);
            res.status(201).json(record);
        } else if (req.method === 'DELETE') {
            // Limpar todos os registros
            await kv.del('records');
            res.status(200).json({ message: 'Todos os registros foram removidos' });
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de registros:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 