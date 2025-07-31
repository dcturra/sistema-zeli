// API de teste simples
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            res.status(200).json({ 
                message: 'API funcionando!', 
                timestamp: new Date().toISOString(),
                method: req.method 
            });
        } else if (req.method === 'POST') {
            res.status(200).json({ 
                message: 'POST funcionando!', 
                data: req.body,
                timestamp: new Date().toISOString(),
                method: req.method 
            });
        } else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de teste:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 