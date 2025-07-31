// Configuração da API
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : 'https://diario-zeli-backend.vercel.app/api'; // URL do Vercel - será atualizada

// Classe principal do sistema
class VitalSignsSystem {
    constructor() {
        this.records = [];
        this.medicationsList = [];
        this.techniciansList = [];
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.displayRecords();
        this.displayMedications();
        this.loadTechnicians();
        this.updateTechnicianDropdown();
        this.loadAdministeredMedications();
        this.showAdminSections();
    }

    // Carregar dados da API
    async loadData() {
        try {
            // Carregar registros
            const recordsResponse = await fetch(`${API_BASE_URL}/records`);
            this.records = await recordsResponse.json();

            // Carregar medicamentos
            const medicationsResponse = await fetch(`${API_BASE_URL}/medications`);
            this.medicationsList = await medicationsResponse.json();

            // Carregar técnicos
            const techniciansResponse = await fetch(`${API_BASE_URL}/technicians`);
            this.techniciansList = await techniciansResponse.json();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados. Verifique a conexão com o servidor.');
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        document.getElementById('vitalSignsForm').addEventListener('submit', (e) => this.saveRecord(e));
        document.getElementById('clearFormBtn').addEventListener('click', () => this.clearForm());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        
        // Event listeners para técnico responsável
        document.getElementById('technicianSelect').addEventListener('change', () => this.toggleOtherTechnician());
        
        // Event listeners para intercorrência
        document.getElementById('complicationsYes').addEventListener('change', () => this.toggleObservationsRequired());
        document.getElementById('complicationsNo').addEventListener('change', () => this.toggleObservationsRequired());
        
        // Event listeners para medicamentos
        document.getElementById('addMedicationBtn').addEventListener('click', () => this.addMedication('open'));
        document.getElementById('saveMedicationBtn').addEventListener('click', () => this.saveMedication('open'));
        document.getElementById('cancelAddMedicationBtn').addEventListener('click', () => this.cancelAddMedication('open'));
        
        // Event listeners para admin
        document.getElementById('addMedicationBtnAdmin').addEventListener('click', () => this.addMedication('admin'));
        document.getElementById('saveMedicationBtnAdmin').addEventListener('click', () => this.saveMedication('admin'));
        document.getElementById('cancelAddMedicationBtnAdmin').addEventListener('click', () => this.cancelAddMedication('admin'));
        
        // Event listeners para técnicos
        document.getElementById('addTechnicianBtn').addEventListener('click', () => this.addTechnician());
        document.getElementById('saveTechnicianBtn').addEventListener('click', () => this.saveTechnician());
        document.getElementById('cancelAddTechnicianBtn').addEventListener('click', () => this.cancelAddTechnician());
    }

    // Salvar registro
    async saveRecord(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Validações
        const pressureSystolic = parseInt(formData.get('pressureSystolic'));
        const pressureDiastolic = parseInt(formData.get('pressureDiastolic'));
        const saturation = parseInt(formData.get('saturation'));
        const heartRate = parseInt(formData.get('heartRate'));
        const temperature = parseFloat(formData.get('temperature'));
        const vte = parseInt(formData.get('vte'));
        const fuga = parseFloat(formData.get('fuga'));
        const complications = formData.get('complications');
        const observations = formData.get('observations');
        
        // Validações de pressão
        if (pressureSystolic < 70 || pressureSystolic > 200) {
            alert('Pressão Sistólica deve estar entre 70 e 200 mmHg');
            return;
        }
        if (pressureDiastolic < 40 || pressureDiastolic > 120) {
            alert('Pressão Diastólica deve estar entre 40 e 120 mmHg');
            return;
        }
        if (pressureDiastolic >= pressureSystolic) {
            alert('Pressão Diastólica deve ser menor que a Sistólica');
            return;
        }
        
        // Validações de saturação e frequência cardíaca
        if (saturation < 70 || saturation > 100) {
            alert('Saturação deve estar entre 70% e 100%');
            return;
        }
        if (heartRate < 40 || heartRate > 200) {
            alert('Frequência Cardíaca deve estar entre 40 e 200 bpm');
            return;
        }
        if (temperature < 35 || temperature > 42) {
            alert('Temperatura deve estar entre 35°C e 42°C');
            return;
        }
        if (vte < 0 || vte > 2000) {
            alert('Vte deve estar entre 0 e 2000 ml');
            return;
        }
        if (fuga < 0 || fuga > 50) {
            alert('Fuga deve estar entre 0 e 50 L/min');
            return;
        }
        
        // Validação de observações obrigatórias
        if (complications === 'Sim' && (!observations || observations.trim() === '')) {
            alert('Observações são obrigatórias quando há intercorrência');
            return;
        }
        
        // Verificar se algum medicamento teve horário alterado
        const timeInputs = document.querySelectorAll('.medication-free-time-filled');
        const hasTimeChanges = Array.from(timeInputs).some(input => input.style.display !== 'none' && input.value !== '');
        
        if (hasTimeChanges && (!observations || observations.trim() === '')) {
            alert('Observações são obrigatórias quando o horário de um medicamento é alterado. Explique o motivo da alteração.');
            return;
        }
        
        // Coletar medicamentos administrados
        const administeredMedications = [];
        const medicationCheckboxes = document.querySelectorAll('input[name="administeredMedications"]:checked');
        medicationCheckboxes.forEach(checkbox => {
            const medicationName = checkbox.value;
            const timeInput = document.getElementById(`time_${medicationName.replace(/\s+/g, '_')}`);
            const time = timeInput ? timeInput.value : '';
            administeredMedications.push(`${medicationName}${time ? ` - ${time}` : ''}`);
        });
        
        const record = {
            technician: formData.get('technician') === 'Outro' ? formData.get('otherTechnician') : formData.get('technician'),
            pressureSystolic: pressureSystolic,
            pressureDiastolic: pressureDiastolic,
            saturation: saturation,
            heartRate: heartRate,
            temperature: temperature,
            vte: vte,
            fuga: fuga,
            bowelMovement: formData.get('bowelMovement'),
            observations: observations,
            complications: complications,
            administeredMedications: administeredMedications,
            otherMedications: formData.get('otherMedications')
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            });
            
            if (response.ok) {
                const newRecord = await response.json();
                this.records.unshift(newRecord);
                this.displayRecords();
                this.clearForm();
                alert('Registro salvo com sucesso!');
            } else {
                throw new Error('Erro ao salvar registro');
            }
        } catch (error) {
            console.error('Erro ao salvar registro:', error);
            alert('Erro ao salvar registro. Tente novamente.');
        }
    }

    // Exibir registros
    displayRecords() {
        const recordsContainer = document.getElementById('recordsContainer');
        if (!recordsContainer) return;
        
        recordsContainer.innerHTML = '';
        
        this.records.forEach(record => {
            const recordDiv = document.createElement('div');
            recordDiv.className = 'record-item';
            
            const date = new Date(record.date).toLocaleString('pt-BR');
            const medications = record.administeredMedications.length > 0 
                ? record.administeredMedications.join(', ') 
                : 'Nenhuma';
            
            recordDiv.innerHTML = `
                <div class="record-header">
                    <strong>Data/Hora:</strong> ${date} | 
                    <strong>Técnico:</strong> ${record.technician}
                </div>
                <div class="record-content">
                    <div class="vital-signs">
                        <strong>Sinais Vitais:</strong><br>
                        Pressão: ${record.pressureSystolic}/${record.pressureDiastolic} mmHg | 
                        Saturação: ${record.saturation}% | 
                        FC: ${record.heartRate} bpm | 
                        Temperatura: ${record.temperature}°C | 
                        Vte: ${record.vte} ml | 
                        Fuga: ${record.fuga} L/min
                    </div>
                    <div class="other-info">
                        <strong>Evacuação:</strong> ${record.bowelMovement} | 
                        <strong>Intercorrência:</strong> ${record.complications}
                    </div>
                    <div class="medications">
                        <strong>Medicações:</strong> ${medications}
                        ${record.otherMedications ? `<br><strong>Outros:</strong> ${record.otherMedications}` : ''}
                    </div>
                    ${record.observations ? `<div class="observations"><strong>Observações:</strong> ${record.observations}</div>` : ''}
                </div>
            `;
            
            recordsContainer.appendChild(recordDiv);
        });
    }

    // Limpar formulário
    clearForm() {
        document.getElementById('vitalSignsForm').reset();
        document.getElementById('otherTechnician').style.display = 'none';
        
        // Limpar campo observações
        const observations = document.getElementById('observations');
        observations.required = false;
        observations.classList.remove('observations-required');
        observations.placeholder = 'Descreva as observações sobre o estado da paciente...';
        
        // Limpar checkboxes de medicamentos
        const checkboxes = document.querySelectorAll('input[name="administeredMedications"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            const timeInput = document.getElementById(`time_${checkbox.value.replace(/\s+/g, '_')}`);
            if (timeInput) {
                timeInput.style.display = 'none';
                timeInput.value = '';
                timeInput.classList.remove('medication-free-time-filled');
            }
        });
        
        // Restaurar horários originais
        const timeSpans = document.querySelectorAll('.medication-time');
        const clockBtns = document.querySelectorAll('.clock-edit-btn');
        timeSpans.forEach(span => span.style.display = 'inline');
        clockBtns.forEach(btn => btn.style.display = 'inline-block');
    }

    // Exportar dados
    exportData() {
        const data = {
            records: this.records,
            medications: this.medicationsList,
            technicians: this.techniciansList,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diario_zeli_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Toggle para técnico "Outro"
    toggleOtherTechnician() {
        const technicianSelect = document.getElementById('technicianSelect');
        const otherTechnician = document.getElementById('otherTechnician');
        
        if (technicianSelect.value === 'Outro') {
            otherTechnician.style.display = 'block';
            otherTechnician.required = true;
        } else {
            otherTechnician.style.display = 'none';
            otherTechnician.required = false;
        }
    }

    // Toggle para observações obrigatórias
    toggleObservationsRequired() {
        const observations = document.getElementById('observations');
        const complicationsYes = document.getElementById('complicationsYes');
        
        observations.required = complicationsYes.checked;
    }

    // Exibir medicamentos
    displayMedications() {
        this.displayMedicationsInSection('medicationsList', this.medicationsList);
        this.displayMedicationsInSection('medicationsListAdmin', this.medicationsList);
    }

    displayMedicationsInSection(containerId, medications) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (medications.length === 0) {
            container.innerHTML = '<p>Nenhum medicamento cadastrado.</p>';
            return;
        }
        
        medications.forEach(medication => {
            const card = this.createMedicationCard(medication, containerId.includes('Admin') ? 'admin' : 'open');
            container.appendChild(card);
        });
    }

    // Criar card de medicamento
    createMedicationCard(medication, target) {
        const card = document.createElement('div');
        card.className = 'medication-card';
        
        const timeDisplay = medication.isFreeTime ? 'Horário Livre' : medication.time;
        
        card.innerHTML = `
            <div class="medication-info">
                <strong>${medication.name}</strong> - ${timeDisplay}
            </div>
            <button class="delete-medication" onclick="vitalSignsSystem.deleteMedication('${medication._id}', '${target}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        return card;
    }

    // Adicionar medicamento
    addMedication(target) {
        const formId = target === 'admin' ? 'addMedicationFormAdmin' : 'addMedicationForm';
        const form = document.getElementById(formId);
        form.style.display = 'block';
        
        // Focar no campo de nome
        const nameInput = document.getElementById(`newMedicationName${target === 'admin' ? 'Admin' : ''}`);
        nameInput.focus();
    }

    // Salvar medicamento
    async saveMedication(target) {
        const nameInput = document.getElementById(`newMedicationName${target === 'admin' ? 'Admin' : ''}`);
        const timeInput = document.getElementById(`newMedicationTime${target === 'admin' ? 'Admin' : ''}`);
        const freeTimeCheckbox = document.getElementById(`newMedicationFreeTime${target === 'admin' ? 'Admin' : ''}`);
        
        const name = nameInput.value.trim();
        const time = timeInput.value;
        const isFreeTime = freeTimeCheckbox.checked;
        
        if (!name) {
            alert('Nome do medicamento é obrigatório');
            return;
        }
        
        if (!isFreeTime && !time) {
            alert('Horário é obrigatório para medicamentos com horário fixo');
            return;
        }
        
        const medication = {
            name: name,
            time: isFreeTime ? '' : time,
            isFreeTime: isFreeTime
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/medications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medication)
            });
            
            if (response.ok) {
                const newMedication = await response.json();
                this.medicationsList.push(newMedication);
                this.displayMedications();
                this.loadAdministeredMedications();
                this.cancelAddMedication(target);
                alert('Medicamento adicionado com sucesso!');
            } else {
                throw new Error('Erro ao adicionar medicamento');
            }
        } catch (error) {
            console.error('Erro ao adicionar medicamento:', error);
            alert('Erro ao adicionar medicamento. Tente novamente.');
        }
    }

    // Cancelar adição de medicamento
    cancelAddMedication(target) {
        const formId = target === 'admin' ? 'addMedicationFormAdmin' : 'addMedicationForm';
        const form = document.getElementById(formId);
        form.style.display = 'none';
        
        // Limpar campos
        const nameInput = document.getElementById(`newMedicationName${target === 'admin' ? 'Admin' : ''}`);
        const timeInput = document.getElementById(`newMedicationTime${target === 'admin' ? 'Admin' : ''}`);
        const freeTimeCheckbox = document.getElementById(`newMedicationFreeTime${target === 'admin' ? 'Admin' : ''}`);
        
        nameInput.value = '';
        timeInput.value = '';
        freeTimeCheckbox.checked = false;
    }

    // Deletar medicamento
    async deleteMedication(medicationId, target) {
        if (!confirm('Tem certeza que deseja excluir este medicamento?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/medications?id=${medicationId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.medicationsList = this.medicationsList.filter(m => m._id !== medicationId);
                this.displayMedications();
                this.loadAdministeredMedications();
                alert('Medicamento excluído com sucesso!');
            } else {
                throw new Error('Erro ao excluir medicamento');
            }
        } catch (error) {
            console.error('Erro ao excluir medicamento:', error);
            alert('Erro ao excluir medicamento. Tente novamente.');
        }
    }

    // Carregar medicamentos administrados
    loadAdministeredMedications() {
        const morningContainer = document.getElementById('morningMedications');
        const afternoonContainer = document.getElementById('afternoonMedications');
        
        if (!morningContainer || !afternoonContainer) return;
        
        morningContainer.innerHTML = '';
        afternoonContainer.innerHTML = '';
        
        this.medicationsList.forEach(medication => {
            const checkbox = this.createMedicationCheckbox(medication);
            
            if (medication.isFreeTime) {
                morningContainer.appendChild(checkbox);
            } else {
                const time = medication.time;
                const hour = parseInt(time.split(':')[0]);
                
                if (hour < 12) {
                    morningContainer.appendChild(checkbox);
                } else {
                    afternoonContainer.appendChild(checkbox);
                }
            }
        });
    }

    // Criar checkbox de medicamento
    createMedicationCheckbox(medication) {
        const container = document.createElement('div');
        container.className = 'medication-item';
        
        const checkboxId = `med_${medication.name.replace(/\s+/g, '_')}`;
        const timeInputId = `time_${medication.name.replace(/\s+/g, '_')}`;
        
        let timeDisplay = '';
        if (medication.isFreeTime) {
            timeDisplay = `
                <input type="time" id="${timeInputId}" class="medication-free-time-input" style="display:none;">
                <span class="medication-time">Horário Livre</span>
            `;
        } else {
            timeDisplay = `
                <span class="medication-time">${medication.time}</span>
                <button type="button" class="clock-edit-btn" onclick="vitalSignsSystem.toggleTimeEdit('${medication.name}')" title="Alterar horário">
                    <i class="fas fa-clock"></i>
                </button>
                <input type="time" id="${timeInputId}" class="medication-free-time-input" style="display:none;">
            `;
        }
        
        container.innerHTML = `
            <label>
                <input type="checkbox" name="administeredMedications" value="${medication.name}" id="${checkboxId}">
                ${medication.name}
            </label>
            <div class="medication-time-container">
                ${timeDisplay}
            </div>
        `;
        
        // Event listener para checkbox
        const checkbox = container.querySelector(`#${checkboxId}`);
        checkbox.addEventListener('change', () => {
            const timeInput = document.getElementById(timeInputId);
            if (medication.isFreeTime) {
                if (checkbox.checked) {
                    timeInput.style.display = 'inline-block';
                    timeInput.required = true;
                } else {
                    timeInput.style.display = 'none';
                    timeInput.required = false;
                    timeInput.value = '';
                }
            }
        });
        
        return container;
    }

    // Toggle para edição de horário
    toggleTimeEdit(medicationName) {
        const timeInputId = `time_${medicationName.replace(/\s+/g, '_')}`;
        const timeInput = document.getElementById(timeInputId);
        const timeSpan = timeInput.previousElementSibling;
        const clockBtn = timeInput.nextElementSibling;
        
        // Confirmação mais detalhada
        const confirmMessage = `Deseja alterar o horário do medicamento "${medicationName}"?\n\nIMPORTANTE: Se confirmar, você será obrigado a preencher o campo "Observações" explicando o motivo da alteração.`;
        
        if (confirm(confirmMessage)) {
            timeInput.style.display = 'inline-block';
            timeInput.classList.add('medication-free-time-filled');
            timeSpan.style.display = 'none';
            if (clockBtn) clockBtn.style.display = 'none';
            
            // Tornar campo "Observações" obrigatório
            const observations = document.getElementById('observations');
            observations.required = true;
            observations.placeholder = 'OBRIGATÓRIO: Explique o motivo da alteração do horário do medicamento';
            
            // Destacar o campo observações
            observations.classList.add('observations-required');
            
            // Mostrar alerta
            alert('Campo "Observações" agora é obrigatório. Explique o motivo da alteração do horário.');
        }
    }

    // Carregar técnicos
    async loadTechnicians() {
        try {
            const response = await fetch(`${API_BASE_URL}/technicians`);
            this.techniciansList = await response.json();
            this.renderTechniciansList();
        } catch (error) {
            console.error('Erro ao carregar técnicos:', error);
        }
    }

    // Renderizar lista de técnicos
    renderTechniciansList() {
        const container = document.getElementById('techniciansList');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.techniciansList.forEach(technician => {
            const item = document.createElement('div');
            item.className = 'technician-item';
            item.innerHTML = `
                <span>${technician.name}</span>
                <button class="delete-technician" onclick="vitalSignsSystem.removeTechnician('${technician._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            container.appendChild(item);
        });
    }

    // Adicionar técnico
    addTechnician() {
        const form = document.getElementById('addTechnicianForm');
        form.style.display = 'block';
        document.getElementById('newTechnicianName').focus();
    }

    // Salvar técnico
    async saveTechnician() {
        const nameInput = document.getElementById('newTechnicianName');
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Nome do técnico é obrigatório');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/technicians`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name })
            });
            
            if (response.ok) {
                const newTechnician = await response.json();
                this.techniciansList.push(newTechnician);
                this.renderTechniciansList();
                this.updateTechnicianDropdown();
                this.cancelAddTechnician();
                alert('Técnico adicionado com sucesso!');
            } else {
                throw new Error('Erro ao adicionar técnico');
            }
        } catch (error) {
            console.error('Erro ao adicionar técnico:', error);
            alert('Erro ao adicionar técnico. Tente novamente.');
        }
    }

    // Cancelar adição de técnico
    cancelAddTechnician() {
        const form = document.getElementById('addTechnicianForm');
        form.style.display = 'none';
        document.getElementById('newTechnicianName').value = '';
    }

    // Remover técnico
    async removeTechnician(technicianId) {
        if (!confirm('Tem certeza que deseja excluir este técnico?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/technicians?id=${technicianId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.techniciansList = this.techniciansList.filter(t => t._id !== technicianId);
                this.renderTechniciansList();
                this.updateTechnicianDropdown();
                alert('Técnico excluído com sucesso!');
            } else {
                throw new Error('Erro ao excluir técnico');
            }
        } catch (error) {
            console.error('Erro ao excluir técnico:', error);
            alert('Erro ao excluir técnico. Tente novamente.');
        }
    }

    // Atualizar dropdown de técnicos
    updateTechnicianDropdown() {
        const select = document.getElementById('technicianSelect');
        const currentValue = select.value;
        
        // Manter apenas "Outro" e adicionar técnicos dinâmicos
        select.innerHTML = '<option value="">Selecione...</option>';
        
        this.techniciansList.forEach(technician => {
            const option = document.createElement('option');
            option.value = technician.name;
            option.textContent = technician.name;
            select.appendChild(option);
        });
        
        // Restaurar valor selecionado se ainda existir
        if (currentValue && this.techniciansList.some(t => t.name === currentValue)) {
            select.value = currentValue;
        }
    }

    // Mostrar seções de admin
    showAdminSections() {
        if (!this.isAdmin) return;
        
        const sections = [
            'medicationsManagement',
            'techniciansManagement',
            'adminContainer'
        ];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
            }
        });
        
        // Atualizar botão de login
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
            loginBtn.onclick = () => this.logoutAdmin();
        }
    }

    // Logout admin
    logoutAdmin() {
        this.isAdmin = false;
        localStorage.removeItem('isAdmin');
        
        const sections = [
            'medicationsManagement',
            'techniciansManagement',
            'adminContainer'
        ];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
        
        // Atualizar botão de login
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.onclick = () => openLoginModal();
        }
    }

    // Limpar todos os registros (apenas admin)
    async clearAllData() {
        if (!this.isAdmin) {
            alert('Apenas administradores podem limpar todos os registros');
            return;
        }
        
        const confirm1 = prompt('Digite "CONFIRMAR" para limpar todos os registros:');
        if (confirm1 !== 'CONFIRMAR') {
            alert('Operação cancelada');
            return;
        }
        
        const confirm2 = confirm('Tem certeza absoluta que deseja limpar TODOS os registros? Esta ação não pode ser desfeita.');
        if (!confirm2) {
            alert('Operação cancelada');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/records`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.records = [];
                this.displayRecords();
                alert('Todos os registros foram limpos com sucesso!');
            } else {
                throw new Error('Erro ao limpar registros');
            }
        } catch (error) {
            console.error('Erro ao limpar registros:', error);
            alert('Erro ao limpar registros. Tente novamente.');
        }
    }
}

// Funções globais para compatibilidade com HTML
let vitalSignsSystem;

// Inicializar sistema quando página carregar
document.addEventListener('DOMContentLoaded', () => {
    vitalSignsSystem = new VitalSignsSystem();
});

// Funções de login (mantidas para compatibilidade)
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function adminLogin(event) {
    event.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    
    if (user === 'admin' && pass === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        closeLoginModal();
        vitalSignsSystem.isAdmin = true;
        vitalSignsSystem.showAdminSections();
    } else {
        alert('Usuário ou senha incorretos!');
    }
}

function logoutAdmin() {
    if (vitalSignsSystem) {
        vitalSignsSystem.logoutAdmin();
    }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
} 