const { CosmosClient } = require('@azure/cosmos');

// Configuração do Cosmos DB
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = 'zeli-database';
const containerId = 'medications';

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

module.exports = async function (context, req) {
    context.log('API de Medicamentos chamada');

    try {
        switch (req.method) {
            case 'GET':
                return await getMedications(context, req);
            case 'POST':
                return await createMedication(context, req);
            case 'PUT':
                return await updateMedication(context, req);
            case 'DELETE':
                return await deleteMedication(context, req);
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

// Buscar todos os medicamentos
async function getMedications(context, req) {
    try {
        const querySpec = {
            query: 'SELECT * FROM c ORDER BY c.time ASC'
        };

        const { resources: medications } = await container.items.query(querySpec).fetchAll();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: medications
        };
    } catch (error) {
        context.log.error('Erro ao buscar medicamentos:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao buscar medicamentos' }
        };
    }
}

// Criar novo medicamento
async function createMedication(context, req) {
    try {
        const medication = req.body;
        
        // Validação básica
        if (!medication.name || !medication.time) {
            context.res = {
                status: 400,
                body: { error: 'Nome e horário são obrigatórios' }
            };
            return;
        }

        // Adicionar ID e timestamp
        medication.id = Date.now().toString();
        medication.createdAt = new Date().toISOString();

        const { resource: createdMedication } = await container.items.create(medication);

        context.res = {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: createdMedication
        };
    } catch (error) {
        context.log.error('Erro ao criar medicamento:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao criar medicamento' }
        };
    }
}

// Atualizar medicamento
async function updateMedication(context, req) {
    try {
        const { id } = context.bindingData;
        const updates = req.body;

        const { resource: existingMedication } = await container.item(id, id).read();
        
        // Atualizar campos
        const updatedMedication = { ...existingMedication, ...updates };
        updatedMedication.updatedAt = new Date().toISOString();

        const { resource: result } = await container.item(id, id).replace(updatedMedication);

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: result
        };
    } catch (error) {
        context.log.error('Erro ao atualizar medicamento:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao atualizar medicamento' }
        };
    }
}

// Deletar medicamento
async function deleteMedication(context, req) {
    try {
        const { id } = context.bindingData;

        await container.item(id, id).delete();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { message: 'Medicamento deletado com sucesso' }
        };
    } catch (error) {
        context.log.error('Erro ao deletar medicamento:', error);
        context.res = {
            status: 500,
            body: { error: 'Erro ao deletar medicamento' }
        };
    }
} 