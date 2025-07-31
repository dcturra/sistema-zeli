// Fallback storage for when Vercel KV is not configured
let fallbackTechnicians = [];

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
            res.status(200).json(fallbackTechnicians);
        } else if (req.method === 'POST') {
            // Criar novo técnico
            const technician = req.body;
            technician.id = Date.now().toString(); // ID único
            
            fallbackTechnicians.push(technician);
            
            res.status(201).json(technician);
        } else if (req.method === 'DELETE') {
            // Deletar técnico específico
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: 'ID do técnico é obrigatório' });
            }
            
            fallbackTechnicians = fallbackTechnicians.filter(t => t.id !== id);
            
            res.status(200).json({ message: 'Técnico removido com sucesso' });
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de técnicos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 