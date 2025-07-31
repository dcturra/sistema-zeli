const { kv } = require('@vercel/kv');

// GET - Buscar todos os técnicos
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
            // Buscar todos os técnicos
            const technicians = await kv.get('technicians') || [];
            res.status(200).json(technicians);
        } else if (req.method === 'POST') {
            // Criar novo técnico
            const technician = req.body;
            technician.id = Date.now().toString(); // ID único
            
            const technicians = await kv.get('technicians') || [];
            technicians.push(technician);
            
            await kv.set('technicians', technicians);
            res.status(201).json(technician);
        } else if (req.method === 'DELETE') {
            // Deletar técnico específico
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: 'ID do técnico é obrigatório' });
            }
            
            const technicians = await kv.get('technicians') || [];
            const filteredTechnicians = technicians.filter(t => t.id !== id);
            
            await kv.set('technicians', filteredTechnicians);
            res.status(200).json({ message: 'Técnico removido com sucesso' });
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de técnicos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 