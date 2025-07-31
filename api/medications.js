// Fallback storage for when Vercel KV is not configured
let fallbackMedications = [];

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
            res.status(200).json(fallbackMedications);
        } else if (req.method === 'POST') {
            // Criar novo medicamento
            const medication = req.body;
            medication.id = Date.now().toString(); // ID único
            
            fallbackMedications.push(medication);
            
            res.status(201).json(medication);
        } else if (req.method === 'DELETE') {
            // Deletar medicamento específico
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: 'ID do medicamento é obrigatório' });
            }
            
            fallbackMedications = fallbackMedications.filter(m => m.id !== id);
            
            res.status(200).json({ message: 'Medicamento removido com sucesso' });
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de medicamentos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 