const { CosmosClient } = require('@azure/cosmos');

// Configuração do Cosmos DB
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = 'zeli-database';
const containerId = 'technicians';

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

module.exports = async function (context, req) {
    context.log('API de Técnicos chamada');

    try {
        switch (req.method) {
            case 'GET':
                return await getTechnicians(context, req);
            case 'POST':
                return await createTechnician(context, req);
            case 'DELETE':
                return await deleteTechnician(context, req);
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

// Buscar todos os técnicos
async function getTechnicians(context, req) {
    try {
        const querySpec = {
            query: 'SELECT * FROM c ORDER BY c.name ASC'
        };

        const { resources: technicians } = await container.items.query(querySpec).fetchAll();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: technicians
        };
    } catch (error) {
        context.log.error('Erro ao buscar técnicos:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao buscar técnicos' }
        };
    }
}

// Criar novo técnico
async function createTechnician(context, req) {
    try {
        const technician = req.body;
        
        // Validação básica
        if (!technician.name) {
            context.res = {
                status: 400,
                body: { error: 'Nome é obrigatório' }
            };
            return;
        }

        // Verificar se já existe
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.name = @name',
            parameters: [{ name: '@name', value: technician.name }]
        };

        const { resources: existing } = await container.items.query(querySpec).fetchAll();
        
        if (existing.length > 0) {
            context.res = {
                status: 409,
                body: { error: 'Técnico já existe' }
            };
            return;
        }

        // Adicionar ID e timestamp
        technician.id = Date.now().toString();
        technician.createdAt = new Date().toISOString();

        const { resource: createdTechnician } = await container.items.create(technician);

        context.res = {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: createdTechnician
        };
    } catch (error) {
        context.log.error('Erro ao criar técnico:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao criar técnico' }
        };
    }
}

// Deletar técnico
async function deleteTechnician(context, req) {
    try {
        const { id } = context.bindingData;

        await container.item(id, id).delete();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { message: 'Técnico deletado com sucesso' }
        };
    } catch (error) {
        context.log.error('Erro ao deletar técnico:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao deletar técnico' }
        };
    }
} 