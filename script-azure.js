// Sistema de Acompanhamento dos Sinais Vitais - Paciente Zeli (Azure Version)

class VitalSignsSystem {
    constructor() {
        this.records = [];
        this.medications = [];
        this.technicians = [];
        this.apiBaseUrl = '/api'; // Será configurado para Azure Static Web Apps
        this.init();
    }

    async init() {
        console.log('Inicializando sistema Azure...');
        this.setupEventListeners();
        this.setCurrentDateTime();
        await this.loadAllData();
        this.setupModal();
        console.log('Sistema Azure inicializado com sucesso!');
    }

    async loadAllData() {
        try {
            await Promise.all([
                this.loadRecords(),
                this.loadMedications(),
                this.loadTechnicians()
            ]);
            this.displayRecords();
            this.displayMedications();
            this.loadAdministeredMedications();
            this.renderTechniciansList();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showNotification('Erro ao carregar dados do servidor', 'error');
        }
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('vitalSignsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRecord();
        });

        // Complications field change
        document.getElementById('complications').addEventListener('change', (e) => {
            this.toggleObservationsRequired(e.target.value);
        });

        // Filter changes
        document.getElementById('filterDate').addEventListener('change', () => {
            this.filterRecords();
        });

        document.getElementById('filterComplications').addEventListener('change', () => {
            this.filterRecords();
        });
    }

    setCurrentDateTime() {
        const now = new Date();
        const dateTimeString = now.toISOString().slice(0, 16);
        document.getElementById('date').value = dateTimeString;
    }

    async saveRecord() {
        const formData = new FormData(document.getElementById('vitalSignsForm'));
        
        // Get technician name
        let technician = formData.get('technician');
        if (technician === 'Outro') {
            const otherTechnician = formData.get('otherTechnician');
            if (!otherTechnician || otherTechnician.trim() === '') {
                this.showNotification('Por favor, preencha o nome do técnico quando selecionar "Outro".', 'error');
                return;
            }
            technician = otherTechnician.trim();
        }
        
        // Get blood pressure
        const systolicPressure = formData.get('systolicPressure');
        const diastolicPressure = formData.get('diastolicPressure');
        const bloodPressure = `${systolicPressure}/${diastolicPressure} mmHg`;
        
        // Get medications
        const selectedMedications = [];
        const checkboxes = document.querySelectorAll('input[name="medications"]:checked');
        checkboxes.forEach(checkbox => {
            const medicationId = checkbox.value;
            const medication = this.getMedicationById(medicationId);
            if (medication) {
                selectedMedications.push(`${medication.name} (${medication.time})`);
            }
        });
        
        const otherMedication = formData.get('otherMedication');
        if (otherMedication && otherMedication.trim() !== '') {
            selectedMedications.push(otherMedication.trim());
        }
        
        const medicationsString = selectedMedications.join(', ');
        
        const record = {
            date: formData.get('date'),
            technician: technician,
            bloodPressure: bloodPressure,
            systolicPressure: systolicPressure,
            diastolicPressure: diastolicPressure,
            oxygenSaturation: formData.get('oxygenSaturation'),
            heartRate: formData.get('heartRate'),
            temperature: formData.get('temperature') || null,
            bowelMovement: formData.get('bowelMovement'),
            observations: formData.get('observations') || '',
            complications: formData.get('complications'),
            medications: medicationsString,
            timestamp: new Date().toISOString()
        };

        if (!this.validateRecord(record)) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(record)
            });

            if (response.ok) {
                const savedRecord = await response.json();
                this.records.unshift(savedRecord);
                this.displayRecords();
                this.clearForm();
                this.showNotification('Registro salvo com sucesso!', 'success');
            } else {
                const error = await response.json();
                this.showNotification(`Erro ao salvar: ${error.error}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao salvar registro:', error);
            this.showNotification('Erro ao conectar com o servidor', 'error');
        }
    }

    validateRecord(record) {
        if (!record.date || !record.technician) {
            this.showNotification('Data e técnico são obrigatórios.', 'error');
            return false;
        }

        if (!record.systolicPressure || !record.diastolicPressure) {
            this.showNotification('Pressão sistólica e diastólica são obrigatórias.', 'error');
            return false;
        }

        if (!record.oxygenSaturation || !record.heartRate) {
            this.showNotification('Saturação de oxigênio e frequência cardíaca são obrigatórias.', 'error');
            return false;
        }

        if (!record.bowelMovement) {
            this.showNotification('Evacuação é obrigatória.', 'error');
            return false;
        }

        if (!record.complications) {
            this.showNotification('Intercorrência é obrigatória.', 'error');
            return false;
        }

        if (record.complications === 'sim' && (!record.observations || record.observations.trim() === '')) {
            this.showNotification('Observações são obrigatórias quando há intercorrência.', 'error');
            return false;
        }

        return true;
    }

    async loadRecords() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/records`);
            if (response.ok) {
                this.records = await response.json();
            } else {
                console.error('Erro ao carregar registros');
            }
        } catch (error) {
            console.error('Erro ao carregar registros:', error);
        }
    }

    displayRecords() {
        const container = document.getElementById('recordsContainer');
        if (!container) return;

        if (this.records.length === 0) {
            container.innerHTML = '<p class="no-records">Nenhum registro encontrado.</p>';
            return;
        }

        const filteredRecords = this.getFilteredRecords();
        container.innerHTML = filteredRecords.map(record => this.createRecordCard(record)).join('');
    }

    createRecordCard(record) {
        const date = new Date(record.date);
        const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const complicationsText = this.getComplicationsText(record.complications);
        const bowelMovementText = this.getBowelMovementText(record.bowelMovement);
        
        return `
            <div class="record-card" onclick="showRecordDetails('${record.id}')">
                <div class="record-header">
                    <div class="record-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </div>
                    <div class="record-technician">
                        <i class="fas fa-user-nurse"></i>
                        ${record.technician}
                    </div>
                </div>
                
                <div class="record-vitals">
                    <div class="vital-item">
                        <span class="vital-label">Pressão:</span>
                        <span class="vital-value">${record.bloodPressure}</span>
                    </div>
                    <div class="vital-item">
                        <span class="vital-label">Saturação:</span>
                        <span class="vital-value">${record.oxygenSaturation}%</span>
                    </div>
                    <div class="vital-item">
                        <span class="vital-label">Freq. Cardíaca:</span>
                        <span class="vital-value">${record.heartRate} bpm</span>
                    </div>
                    ${record.temperature ? `
                    <div class="vital-item">
                        <span class="vital-label">Temperatura:</span>
                        <span class="vital-value">${record.temperature}°C</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="record-details">
                    <div class="detail-item">
                        <span class="detail-label">Evacuação:</span>
                        <span class="detail-value">${bowelMovementText}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Intercorrência:</span>
                        <span class="complications-badge complications-${record.complications}">${complicationsText}</span>
                    </div>
                </div>
                
                ${record.medications ? `
                <div class="record-medications">
                    <span class="medications-label">Medicações:</span>
                    <span class="medications-value">${record.medications}</span>
                </div>
                ` : ''}
                
                ${record.observations ? `
                <div class="record-observations">
                    <span class="observations-label">Observações:</span>
                    <span class="observations-value">${record.observations}</span>
                </div>
                ` : ''}
            </div>
        `;
    }

    getComplicationsText(complication) {
        const complications = {
            'nao': 'Não',
            'sim': 'Sim'
        };
        return complications[complication] || complication;
    }

    getBowelMovementText(bowelMovement) {
        const movements = {
            'normal': 'Normal',
            'diarreia': 'Diarreia',
            'nao': 'Não'
        };
        return movements[bowelMovement] || bowelMovement;
    }

    getFilteredRecords() {
        const dateFilter = document.getElementById('filterDate').value;
        const complicationsFilter = document.getElementById('filterComplications').value;
        
        let filtered = this.records;
        
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate.toDateString() === filterDate.toDateString();
            });
        }
        
        if (complicationsFilter) {
            filtered = filtered.filter(record => record.complications === complicationsFilter);
        }
        
        return filtered;
    }

    filterRecords() {
        this.displayRecords();
    }

    showRecordDetails(recordId) {
        const record = this.records.find(r => r.id === recordId);
        if (!record) return;

        const modal = document.getElementById('recordModal');
        const modalContent = document.getElementById('modalContent');
        
        const date = new Date(record.date);
        const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        modalContent.innerHTML = `
            <h3>Detalhes do Registro</h3>
            <div class="modal-record">
                <p><strong>Data/Hora:</strong> ${formattedDate}</p>
                <p><strong>Técnico:</strong> ${record.technician}</p>
                <p><strong>Pressão Arterial:</strong> ${record.bloodPressure}</p>
                <p><strong>Saturação de Oxigênio:</strong> ${record.oxygenSaturation}%</p>
                <p><strong>Frequência Cardíaca:</strong> ${record.heartRate} bpm</p>
                ${record.temperature ? `<p><strong>Temperatura:</strong> ${record.temperature}°C</p>` : ''}
                <p><strong>Evacuação:</strong> ${this.getBowelMovementText(record.bowelMovement)}</p>
                <p><strong>Intercorrência:</strong> ${this.getComplicationsText(record.complications)}</p>
                ${record.medications ? `<p><strong>Medicações:</strong> ${record.medications}</p>` : ''}
                ${record.observations ? `<p><strong>Observações:</strong> ${record.observations}</p>` : ''}
            </div>
        `;
        
        modal.style.display = 'block';
    }

    setupModal() {
        const modal = document.getElementById('recordModal');
        const span = document.getElementsByClassName('close')[0];
        
        span.onclick = function() {
            modal.style.display = 'none';
        }
        
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    }

    clearForm() {
        document.getElementById('vitalSignsForm').reset();
        this.setCurrentDateTime();
        
        // Clear medication checkboxes
        const checkboxes = document.querySelectorAll('input[name="medications"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Hide other technician field
        document.getElementById('otherTechnicianGroup').style.display = 'none';
        
        // Clear observations required
        document.getElementById('observations').required = false;
    }

    async clearAllData() {
        const confirmDelete = confirm('Tem certeza que deseja apagar TODOS os registros? Esta ação não pode ser desfeita.');
        if (!confirmDelete) return;

        const confirmText = prompt('Digite "CONFIRMAR" para apagar todos os registros permanentemente:');
        if (confirmText !== 'CONFIRMAR') {
            this.showNotification('Operação cancelada.', 'info');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/records`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.records = [];
                this.displayRecords();
                this.showNotification('Todos os registros foram apagados.', 'success');
            } else {
                const error = await response.json();
                this.showNotification(`Erro ao apagar registros: ${error.error}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao apagar registros:', error);
            this.showNotification('Erro ao conectar com o servidor', 'error');
        }
    }

    exportData() {
        if (this.records.length === 0) {
            this.showNotification('Não há dados para exportar.', 'info');
            return;
        }

        const csvContent = this.convertToCSV(this.records);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `registros_zeli_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    convertToCSV(data) {
        const headers = ['Data/Hora', 'Técnico', 'Pressão', 'Saturação', 'Freq. Cardíaca', 'Temperatura', 'Evacuação', 'Intercorrência', 'Medicações', 'Observações'];
        const csvRows = [headers.join(',')];
        
        data.forEach(record => {
            const date = new Date(record.date);
            const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            const row = [
                formattedDate,
                record.technician,
                record.bloodPressure,
                record.oxygenSaturation + '%',
                record.heartRate + ' bpm',
                record.temperature ? record.temperature + '°C' : '',
                this.getBowelMovementText(record.bowelMovement),
                this.getComplicationsText(record.complications),
                record.medications || '',
                record.observations || ''
            ];
            
            csvRows.push(row.map(field => `"${field}"`).join(','));
        });
        
        return csvRows.join('\n');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Medication Management
    async loadMedications() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/medications`);
            if (response.ok) {
                this.medications = await response.json();
            } else {
                console.error('Erro ao carregar medicamentos');
            }
        } catch (error) {
            console.error('Erro ao carregar medicamentos:', error);
        }
    }

    displayMedications() {
        const container = document.getElementById('medicationsList');
        if (!container) return;

        if (this.medications.length === 0) {
            container.innerHTML = '<p class="no-medications">Nenhum medicamento cadastrado.</p>';
            return;
        }

        container.innerHTML = this.medications.map(medication => this.createMedicationCard(medication)).join('');
    }

    createMedicationCard(medication) {
        const scheduleText = medication.schedule === 'free' ? 'Horário Livre' : 'Horário Fixo';
        const scheduleClass = medication.schedule === 'free' ? 'schedule-free' : 'schedule-fixed';
        
        return `
            <div class="medication-item">
                <div class="medication-info">
                    <span class="medication-name">${medication.name}</span>
                    <span class="medication-time">${medication.time}</span>
                    <span class="medication-schedule ${scheduleClass}">${scheduleText}</span>
                </div>
                <button class="btn btn-danger btn-xs" onclick="deleteMedication('${medication.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    async addMedication() {
        document.getElementById('addMedicationForm').style.display = 'block';
    }

    async saveMedication() {
        const name = document.getElementById('newMedicationName').value.trim();
        const time = document.getElementById('newMedicationTime').value;
        const schedule = document.getElementById('newMedicationSchedule').value;

        if (!name || !time) {
            this.showNotification('Nome e horário são obrigatórios.', 'error');
            return;
        }

        const medication = { name, time, schedule };

        try {
            const response = await fetch(`${this.apiBaseUrl}/medications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medication)
            });

            if (response.ok) {
                const savedMedication = await response.json();
                this.medications.push(savedMedication);
                this.displayMedications();
                this.cancelAddMedication();
                this.showNotification('Medicamento adicionado com sucesso!', 'success');
            } else {
                const error = await response.json();
                this.showNotification(`Erro ao adicionar medicamento: ${error.error}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao adicionar medicamento:', error);
            this.showNotification('Erro ao conectar com o servidor', 'error');
        }
    }

    cancelAddMedication() {
        document.getElementById('addMedicationForm').style.display = 'none';
        document.getElementById('newMedicationName').value = '';
        document.getElementById('newMedicationTime').value = '';
        document.getElementById('newMedicationSchedule').value = 'fixed';
    }

    async deleteMedication(id) {
        const confirmDelete = confirm('Tem certeza que deseja excluir este medicamento?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/medications/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.medications = this.medications.filter(m => m.id !== id);
                this.displayMedications();
                this.loadAdministeredMedications();
                this.showNotification('Medicamento excluído com sucesso!', 'success');
            } else {
                const error = await response.json();
                this.showNotification(`Erro ao excluir medicamento: ${error.error}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir medicamento:', error);
            this.showNotification('Erro ao conectar com o servidor', 'error');
        }
    }

    getMedicationById(id) {
        return this.medications.find(m => m.id === id);
    }

    loadAdministeredMedications() {
        const morningContainer = document.getElementById('morningMedications');
        const afternoonContainer = document.getElementById('afternoonMedications');
        
        if (!morningContainer || !afternoonContainer) return;

        morningContainer.innerHTML = '';
        afternoonContainer.innerHTML = '';

        this.medications.forEach(medication => {
            const time = medication.time;
            const hour = parseInt(time.split(':')[0]);
            const isMorning = hour < 12;
            
            const checkbox = this.createMedicationCheckbox(medication);
            
            if (isMorning) {
                morningContainer.appendChild(checkbox);
            } else {
                afternoonContainer.appendChild(checkbox);
            }
        });
    }

    createMedicationCheckbox(medication) {
        const div = document.createElement('div');
        div.className = 'medication-item';
        
        const scheduleClass = medication.schedule === 'free' ? 'schedule-free' : 'schedule-fixed';
        const scheduleText = medication.schedule === 'free' ? 'Horário Livre' : 'Horário Fixo';
        
        div.innerHTML = `
            <label class="medication-checkbox">
                <input type="checkbox" name="medications" value="${medication.id}">
                <span class="medication-name">${medication.name}</span>
                <span class="medication-time ${scheduleClass}">${medication.time}</span>
                <span class="medication-schedule ${scheduleClass}">${scheduleText}</span>
            </label>
        `;
        
        return div;
    }

    // Technician Management
    async loadTechnicians() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/technicians`);
            if (response.ok) {
                this.technicians = await response.json();
            } else {
                console.error('Erro ao carregar técnicos');
            }
        } catch (error) {
            console.error('Erro ao carregar técnicos:', error);
        }
    }

    renderTechniciansList() {
        const container = document.getElementById('techniciansList');
        if (!container) return;

        container.innerHTML = this.technicians.map(technician => `
            <li>
                ${technician.name}
                <button class="btn btn-danger btn-xs" onclick="removeTechnician('${technician.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
        
        this.updateTechnicianDropdown();
    }

    async addTechnician(event) {
        event.preventDefault();
        const name = document.getElementById('newTechnicianName').value.trim();
        
        if (!name) {
            this.showNotification('Nome é obrigatório.', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/technicians`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name })
            });

            if (response.ok) {
                const savedTechnician = await response.json();
                this.technicians.push(savedTechnician);
                this.renderTechniciansList();
                document.getElementById('newTechnicianName').value = '';
                this.showNotification('Técnico adicionado com sucesso!', 'success');
            } else {
                const error = await response.json();
                this.showNotification(`Erro ao adicionar técnico: ${error.error}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao adicionar técnico:', error);
            this.showNotification('Erro ao conectar com o servidor', 'error');
        }
    }

    async removeTechnician(id) {
        const confirmDelete = confirm('Tem certeza que deseja remover este técnico?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/technicians/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.technicians = this.technicians.filter(t => t.id !== id);
                this.renderTechniciansList();
                this.showNotification('Técnico removido com sucesso!', 'success');
            } else {
                const error = await response.json();
                this.showNotification(`Erro ao remover técnico: ${error.error}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao remover técnico:', error);
            this.showNotification('Erro ao conectar com o servidor', 'error');
        }
    }

    updateTechnicianDropdown() {
        const select = document.getElementById('technician');
        const currentValue = select.value;
        
        // Manter as opções padrão
        select.innerHTML = `
            <option value="">Selecione o técnico...</option>
            <option value="Silvana">Silvana</option>
            <option value="Palmira">Palmira</option>
            <option value="Edna">Edna</option>
            <option value="Outro">Outro</option>
        `;
        
        // Adicionar técnicos dinâmicos
        this.technicians.forEach(technician => {
            const option = document.createElement('option');
            option.value = technician.name;
            option.textContent = technician.name;
            select.appendChild(option);
        });
        
        // Restaurar valor selecionado
        select.value = currentValue;
    }
}

// Global functions
function toggleOtherTechnician() {
    const technician = document.getElementById('technician').value;
    const otherGroup = document.getElementById('otherTechnicianGroup');
    
    if (technician === 'Outro') {
        otherGroup.style.display = 'block';
        document.getElementById('otherTechnician').required = true;
    } else {
        otherGroup.style.display = 'none';
        document.getElementById('otherTechnician').required = false;
        document.getElementById('otherTechnician').value = '';
    }
}

function toggleObservationsRequired() {
    const complications = document.getElementById('complications').value;
    const observations = document.getElementById('observations');
    
    if (complications === 'sim') {
        observations.required = true;
        observations.placeholder = 'Observações são obrigatórias quando há intercorrência...';
    } else {
        observations.required = false;
        observations.placeholder = 'Descreva as observações sobre o estado da paciente...';
    }
}

function clearForm() {
    window.vitalSignsSystem.clearForm();
}

function clearAllData() {
    window.vitalSignsSystem.clearAllData();
}

function exportData() {
    window.vitalSignsSystem.exportData();
}

function filterRecords() {
    window.vitalSignsSystem.filterRecords();
}

function addMedication() {
    window.vitalSignsSystem.addMedication();
}

function saveMedication() {
    window.vitalSignsSystem.saveMedication();
}

function cancelAddMedication() {
    window.vitalSignsSystem.cancelAddMedication();
}

function deleteMedication(id) {
    window.vitalSignsSystem.deleteMedication(id);
}

function addTechnician(event) {
    window.vitalSignsSystem.addTechnician(event);
}

function removeTechnician(id) {
    window.vitalSignsSystem.removeTechnician(id);
}

function showRecordDetails(recordId) {
    window.vitalSignsSystem.showRecordDetails(recordId);
}

// Admin functions
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
        showAdminSections();
        closeLoginModal();
        document.getElementById('loginBtn').innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
        document.getElementById('loginBtn').onclick = logoutAdmin;
    } else {
        alert('Usuário ou senha incorretos!');
    }
}

function showAdminSections() {
    document.getElementById('medicationsManagement').style.display = 'block';
    document.getElementById('techniciansManagement').style.display = 'block';
    document.getElementById('adminContainer').style.display = 'block';
}

function logoutAdmin() {
    document.getElementById('medicationsManagement').style.display = 'none';
    document.getElementById('techniciansManagement').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'none';
    document.getElementById('loginBtn').innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    document.getElementById('loginBtn').onclick = openLoginModal;
}

// Initialize system
window.addEventListener('DOMContentLoaded', () => {
    window.vitalSignsSystem = new VitalSignsSystem();
}); 