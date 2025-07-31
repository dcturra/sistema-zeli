const { CosmosClient } = require('@azure/cosmos');

// Configuração do Cosmos DB
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = 'zeli-database';
const containerId = 'records';

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

module.exports = async function (context, req) {
    context.log('API de Registros chamada');

    try {
        switch (req.method) {
            case 'GET':
                return await getRecords(context, req);
            case 'POST':
                return await createRecord(context, req);
            case 'DELETE':
                return await deleteRecords(context, req);
            default:
                context.res = {
                    status: 405,
                    body: { error: 'Método não permitido' }
                };
        }
    } catch (error) {
        context.log.error('Erro na API:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro interno do servidor' }
        };
    }
};

// Buscar todos os registros
async function getRecords(context, req) {
    try {
        const querySpec = {
            query: 'SELECT * FROM c ORDER BY c.date DESC'
        };

        const { resources: records } = await container.items.query(querySpec).fetchAll();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: records
        };
    } catch (error) {
        context.log.error('Erro ao buscar registros:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao buscar registros' }
        };
    }
}

// Criar novo registro
async function createRecord(context, req) {
    try {
        const record = req.body;
        
        // Validação básica
        if (!record.date || !record.technician) {
            context.res = {
                status: 400,
                body: { error: 'Data e técnico são obrigatórios' }
            };
            return;
        }

        // Adicionar timestamp de criação
        record.id = Date.now().toString();
        record.createdAt = new Date().toISOString();

        const { resource: createdRecord } = await container.items.create(record);

        context.res = {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: createdRecord
        };
    } catch (error) {
        context.log.error('Erro ao criar registro:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao criar registro' }
        };
    }
}

// Deletar todos os registros (apenas admin)
async function deleteRecords(context, req) {
    try {
        // Verificar se é admin (implementar autenticação depois)
        const { resources: records } = await container.items.query({
            query: 'SELECT * FROM c'
        }).fetchAll();

        // Deletar todos os registros
        for (const record of records) {
            await container.item(record.id, record.id).delete();
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { message: 'Todos os registros foram deletados' }
        };
    } catch (error) {
        context.log.error('Erro ao deletar registros:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao deletar registros' }
        };
    }
} 