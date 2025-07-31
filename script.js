// Sistema de Acompanhamento dos Sinais Vitais - Paciente Zeli

class VitalSignsSystem {
    constructor() {
        this.records = this.loadRecords();
        this.init();
    }

    init() {
        console.log('Inicializando sistema...');
        this.setupEventListeners();
        this.setCurrentDateTime();
        this.displayRecords();
        this.setupModal();
        this.displayMedications();
        this.loadAdministeredMedications();
        console.log('Sistema inicializado com sucesso!');
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



    saveRecord() {
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
            id: Date.now(),
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
            createdAt: new Date().toISOString()
        };

        // Validation
        if (!this.validateRecord(record)) {
            return;
        }

        this.records.unshift(record);
        this.saveRecords();
        this.displayRecords();
        this.clearForm();
        this.showNotification('Registro salvo com sucesso!', 'success');
    }

    validateRecord(record) {
        // Basic validation
        if (!record.systolicPressure || !record.diastolicPressure || !record.oxygenSaturation || !record.heartRate) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return false;
        }

        // Validate blood pressure
        const systolic = parseInt(record.systolicPressure);
        const diastolic = parseInt(record.diastolicPressure);
        if (systolic < 50 || systolic > 300) {
            this.showNotification('Pressão sistólica deve estar entre 50 e 300 mmHg.', 'error');
            return false;
        }
        if (diastolic < 30 || diastolic > 200) {
            this.showNotification('Pressão diastólica deve estar entre 30 e 200 mmHg.', 'error');
            return false;
        }
        if (systolic <= diastolic) {
            this.showNotification('A pressão sistólica deve ser maior que a diastólica.', 'error');
            return false;
        }

        // Validate oxygen saturation
        const sat = parseInt(record.oxygenSaturation);
        if (sat < 0 || sat > 100) {
            this.showNotification('Saturação de oxigênio deve estar entre 0 e 100%.', 'error');
            return false;
        }

        // Validate heart rate
        const hr = parseInt(record.heartRate);
        if (hr < 0 || hr > 300) {
            this.showNotification('Frequência cardíaca deve estar entre 0 e 300 bpm.', 'error');
            return false;
        }

        // Validate temperature if provided
        if (record.temperature) {
            const temp = parseFloat(record.temperature);
            if (temp < 30 || temp > 45) {
                this.showNotification('Temperatura deve estar entre 30°C e 45°C.', 'error');
                return false;
            }
        }

        // Validate observations when complications is "sim"
        if (record.complications === 'sim' && (!record.observations || record.observations.trim() === '')) {
            this.showNotification('Observações são obrigatórias quando há intercorrência.', 'error');
            return false;
        }

        return true;
    }

    displayRecords() {
        console.log('Exibindo registros...');
        const container = document.getElementById('recordsContainer');
        console.log('Container encontrado:', container);
        
        const filteredRecords = this.getFilteredRecords();
        console.log('Registros filtrados:', filteredRecords);

        if (filteredRecords.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h4>Nenhum registro encontrado</h4>
                    <p>Comece preenchendo o formulário ao lado para criar o primeiro registro.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredRecords.map(record => this.createRecordCard(record)).join('');
        console.log('Registros exibidos com sucesso!');
    }

    createRecordCard(record) {
        const date = new Date(record.date);
        const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const complicationsClass = `complications-${record.complications}`;
        const complicationsText = this.getComplicationsText(record.complications);
        const bowelMovementText = this.getBowelMovementText(record.bowelMovement);
        
        return `
            <div class="record-card" onclick="vitalSignsSystem.showRecordDetails(${record.id})">
                <div class="record-header">
                    <div class="record-date">${formattedDate}</div>
                    <div class="record-technician">${record.technician}</div>
                </div>
                
                <div class="record-vitals">
                    <div class="vital-item">
                        <div class="vital-label">Pressão</div>
                        <div class="vital-value">${record.bloodPressure}</div>
                    </div>
                    <div class="vital-item">
                        <div class="vital-label">Saturação</div>
                        <div class="vital-value">${record.oxygenSaturation}%</div>
                    </div>
                    <div class="vital-item">
                        <div class="vital-label">Freq. Cardíaca</div>
                        <div class="vital-value">${record.heartRate} bpm</div>
                    </div>
                    ${record.temperature ? `
                        <div class="vital-item">
                            <div class="vital-label">Temperatura</div>
                            <div class="vital-value">${record.temperature}°C</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="record-status">
                    <span class="complications-badge ${complicationsClass}">${complicationsText}</span>
                    <span class="bowel-movement">
                        <i class="fas fa-${record.bowelMovement === 'nao' ? 'times-circle' : 'check-circle'}"></i>
                        Evacuação: ${bowelMovementText}
                    </span>
                </div>
                ${record.medications ? `
                    <div class="record-medications">
                        <i class="fas fa-pills"></i>
                        <span>Medicações: ${record.medications}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getComplicationsText(complication) {
        const texts = {
            'nao': 'Não',
            'sim': 'Sim'
        };
        return texts[complication] || complication;
    }

    getBowelMovementText(bowelMovement) {
        const texts = {
            'normal': 'Normal',
            'diarreia': 'Diarreia',
            'nao': 'Não'
        };
        return texts[bowelMovement] || bowelMovement;
    }

    getFilteredRecords() {
        let filtered = [...this.records];
        
        const filterDate = document.getElementById('filterDate').value;
        const filterComplications = document.getElementById('filterComplications').value;
        
        if (filterDate) {
            const filterDateObj = new Date(filterDate);
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate.toDateString() === filterDateObj.toDateString();
            });
        }
        
        if (filterComplications) {
            filtered = filtered.filter(record => record.complications === filterComplications);
        }
        
        return filtered;
    }

    filterRecords() {
        this.displayRecords();
    }

    showRecordDetails(recordId) {
        const record = this.records.find(r => r.id === recordId);
        if (!record) return;

        const date = new Date(record.date);
        const formattedDate = date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR');
        
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <h3>Detalhes do Registro</h3>
            <div class="modal-details">
                <div class="modal-section">
                    <h4><i class="fas fa-calendar"></i> Data e Hora</h4>
                    <p>${formattedDate}</p>
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-user"></i> Técnico Responsável</h4>
                    <p>${record.technician}</p>
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-heartbeat"></i> Sinais Vitais</h4>
                    <p><strong>Pressão Arterial:</strong> ${record.bloodPressure}</p>
                    <p><strong>Saturação de Oxigênio:</strong> ${record.oxygenSaturation}%</p>
                    <p><strong>Frequência Cardíaca:</strong> ${record.heartRate} bpm</p>
                    ${record.temperature ? `<p><strong>Temperatura:</strong> ${record.temperature}°C</p>` : ''}
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-info-circle"></i> Outras Informações</h4>
                    <p><strong>Evacuação:</strong> ${this.getBowelMovementText(record.bowelMovement)}</p>
                    <p><strong>Intercorrência:</strong> ${this.getComplicationsText(record.complications)}</p>
                </div>
                
                ${record.observations ? `
                    <div class="modal-section">
                        <h4><i class="fas fa-sticky-note"></i> Observações</h4>
                        <p>${record.observations}</p>
                    </div>
                ` : ''}
                
                ${record.medications ? `
                    <div class="modal-section">
                        <h4><i class="fas fa-pills"></i> Medicações Administradas</h4>
                        <p>${record.medications}</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.getElementById('recordModal').style.display = 'block';
    }

    setupModal() {
        const modal = document.getElementById('recordModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    clearForm() {
        document.getElementById('vitalSignsForm').reset();
        this.setCurrentDateTime();
        document.getElementById('otherTechnicianGroup').style.display = 'none';
        document.getElementById('observations').required = false;
        document.getElementById('otherMedication').value = '';
        
        // Clear medication checkboxes
        const checkboxes = document.querySelectorAll('input[name="medications"]:checked');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    clearAllData() {
        if (confirm('ATENÇÃO: Você está prestes a excluir TODOS os registros do sistema.\n\nEsta ação é IRREVERSÍVEL e não pode ser desfeita.\n\nTem certeza absoluta que deseja continuar?')) {
            const confirmacao = prompt('Para confirmar, digite "CONFIRMAR" (em maiúsculas):');
            if (confirmacao === 'CONFIRMAR') {
                this.records = [];
                this.saveRecords();
                this.displayRecords();
                this.showNotification('Todos os registros foram excluídos permanentemente.', 'success');
            } else {
                this.showNotification('Operação cancelada.', 'info');
            }
        }
    }

    exportData() {
        if (this.records.length === 0) {
            this.showNotification('Não há dados para exportar.', 'error');
            return;
        }

        const data = {
            patient: 'Zeli',
            exportDate: new Date().toISOString(),
            totalRecords: this.records.length,
            records: this.records
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sinais-vitais-zeli-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Dados exportados com sucesso!', 'success');
    }

    loadRecords() {
        const saved = localStorage.getItem('vitalSignsRecords');
        return saved ? JSON.parse(saved) : [];
    }

    saveRecords() {
        localStorage.setItem('vitalSignsRecords', JSON.stringify(this.records));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Medications Management
    displayMedications() {
        const container = document.getElementById('medicationsList');
        const medications = this.loadMedications();

        if (medications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pills"></i>
                    <h4>Nenhum medicamento cadastrado</h4>
                    <p>Clique em "Adicionar Medicamento" para começar.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = medications.map(med => this.createMedicationCard(med)).join('');
    }

    createMedicationCard(medication) {
        const scheduleText = medication.schedule === 'free' ? 'Horário Livre' : 'Horário Fixo';
        const scheduleClass = medication.schedule === 'free' ? 'schedule-free' : 'schedule-fixed';
        
        return `
            <div class="medication-card">
                <div class="medication-info">
                    <div class="medication-name">${medication.name}</div>
                    <div class="medication-time">Horário: ${medication.time}</div>
                    <div class="medication-schedule ${scheduleClass}">${scheduleText}</div>
                </div>
                <div class="medication-actions">
                    <button class="delete-medication" onclick="vitalSignsSystem.deleteMedication(${medication.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    }

    addMedication() {
        document.getElementById('addMedicationForm').style.display = 'block';
        document.getElementById('newMedicationName').focus();
    }

    saveMedication() {
        const name = document.getElementById('newMedicationName').value.trim();
        const time = document.getElementById('newMedicationTime').value;
        const schedule = document.getElementById('newMedicationSchedule').value;

        if (!name || !time) {
            this.showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }

        const medications = this.loadMedications();
        const newMedication = {
            id: Date.now(),
            name: name,
            time: time,
            schedule: schedule,
            createdAt: new Date().toISOString()
        };

        medications.push(newMedication);
        this.saveMedications(medications);
        this.displayMedications();
        this.loadAdministeredMedications();
        this.cancelAddMedication();
        this.showNotification('Medicamento adicionado com sucesso!', 'success');
    }

    cancelAddMedication() {
        document.getElementById('addMedicationForm').style.display = 'none';
        document.getElementById('newMedicationName').value = '';
        document.getElementById('newMedicationTime').value = '';
        document.getElementById('newMedicationSchedule').value = 'fixed';
    }

    deleteMedication(id) {
        if (confirm('Você tem certeza que deseja excluir este medicamento?')) {
            const medications = this.loadMedications();
            const filteredMedications = medications.filter(med => med.id !== id);
            this.saveMedications(filteredMedications);
            this.displayMedications();
            this.loadAdministeredMedications();
            this.showNotification('Medicamento excluído com sucesso!', 'success');
        }
    }

    loadMedications() {
        const saved = localStorage.getItem('medicationsList');
        return saved ? JSON.parse(saved) : [];
    }

    saveMedications(medications) {
        localStorage.setItem('medicationsList', JSON.stringify(medications));
    }

    getMedicationById(id) {
        const medications = this.loadMedications();
        return medications.find(med => med.id === parseInt(id));
    }

    loadAdministeredMedications() {
        console.log('Carregando medicações administradas...');
        const medications = this.loadMedications();
        console.log('Medicações carregadas:', medications);
        
        const morningContainer = document.getElementById('morningMedications');
        const afternoonContainer = document.getElementById('afternoonMedications');
        
        console.log('Container manhã:', morningContainer);
        console.log('Container tarde:', afternoonContainer);
        
        // Clear containers
        morningContainer.innerHTML = '';
        afternoonContainer.innerHTML = '';
        
        medications.forEach(medication => {
            const medicationItem = this.createMedicationCheckbox(medication);
            
            // Determine if it's morning or afternoon based on time
            const hour = parseInt(medication.time.split(':')[0]);
            if (hour < 12) {
                morningContainer.appendChild(medicationItem);
            } else {
                afternoonContainer.appendChild(medicationItem);
            }
        });
        console.log('Medicações administradas carregadas com sucesso!');
    }

    createMedicationCheckbox(medication) {
        const div = document.createElement('div');
        div.className = 'medication-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `med_${medication.id}`;
        checkbox.name = 'medications';
        checkbox.value = medication.id;
        
        const label = document.createElement('label');
        label.htmlFor = `med_${medication.id}`;
        label.textContent = medication.name;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'medication-time';
        timeSpan.textContent = medication.time;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        div.appendChild(timeSpan);
        
        return div;
    }
}

// Técnicos iniciais
const DEFAULT_TECHNICIANS = ["Palmira", "Edna", "Silvana", "Outro"];

function loadTechnicians() {
    const saved = localStorage.getItem('techniciansList');
    if (saved) return JSON.parse(saved);
    return [...DEFAULT_TECHNICIANS];
}
function saveTechnicians(list) {
    localStorage.setItem('techniciansList', JSON.stringify(list));
    updateTechnicianDropdown();
}
function renderTechniciansList() {
    const list = loadTechnicians();
    const ul = document.getElementById('techniciansList');
    ul.innerHTML = list.map((t, i) => `
        <li>${t} ${t !== 'Outro' ? `<button onclick='removeTechnician(${i})' class='btn btn-outline btn-xs'>Remover</button>` : ''}</li>
    `).join('');
}
function addTechnician(event) {
    event.preventDefault();
    const name = document.getElementById('newTechnicianName').value.trim();
    if (!name) return false;
    const list = loadTechnicians();
    if (list.includes(name)) {
        alert('Técnico já cadastrado!');
        return false;
    }
    list.push(name);
    saveTechnicians(list);
    renderTechniciansList();
    document.getElementById('addTechnicianForm').reset();
    return false;
}
function removeTechnician(idx) {
    if (!confirm('Remover este técnico?')) return;
    const list = loadTechnicians();
    list.splice(idx, 1);
    saveTechnicians(list);
    renderTechniciansList();
}
function updateTechnicianDropdown() {
    const select = document.getElementById('technician');
    if (!select) return;
    const list = loadTechnicians();
    select.innerHTML = '<option value="">Selecione o técnico...</option>' +
        list.map(t => `<option value="${t}">${t}</option>`).join('');
}

// Global functions for HTML onclick events
function toggleOtherTechnician() {
    const technicianSelect = document.getElementById('technician');
    const otherTechnicianGroup = document.getElementById('otherTechnicianGroup');
    const otherTechnicianInput = document.getElementById('otherTechnician');
    
    if (technicianSelect.value === 'Outro') {
        otherTechnicianGroup.style.display = 'block';
        otherTechnicianInput.required = true;
        otherTechnicianInput.focus();
    } else {
        otherTechnicianGroup.style.display = 'none';
        otherTechnicianInput.required = false;
        otherTechnicianInput.value = '';
    }
}

function toggleObservationsRequired() {
    const complicationsSelect = document.getElementById('complications');
    const observationsField = document.getElementById('observations');
    
    if (complicationsSelect.value === 'sim') {
        observationsField.required = true;
        observationsField.placeholder = 'Observações são obrigatórias quando há intercorrência...';
        observationsField.focus();
    } else {
        observationsField.required = false;
        observationsField.placeholder = 'Descreva as observações sobre o estado da paciente...';
    }
}

function clearForm() {
    vitalSignsSystem.clearForm();
}

function clearAllData() {
    vitalSignsSystem.clearAllData();
}

function exportData() {
    vitalSignsSystem.exportData();
}

function filterRecords() {
    vitalSignsSystem.filterRecords();
}

// Global functions for medications
function addMedication() {
    vitalSignsSystem.addMedication();
}

function saveMedication() {
    vitalSignsSystem.saveMedication();
}

function cancelAddMedication() {
    vitalSignsSystem.cancelAddMedication();
}

function toggleFreeTimeOption() {
    const schedule = document.getElementById('newMedicationSchedule').value;
    const timeInput = document.getElementById('newMedicationTime');
    
    if (schedule === 'free') {
        timeInput.value = '';
        timeInput.placeholder = 'Horário livre (se necessário)';
        timeInput.required = false;
    } else {
        timeInput.placeholder = 'Selecione o horário';
        timeInput.required = true;
    }
}

function renderManagementMedications() {
    const container = document.getElementById('managementTabMedications');
    const medications = JSON.parse(localStorage.getItem('medicationsList') || '[]');
    // Separar manhã e tarde/noite
    const morning = medications.filter(med => med.time && med.time < '12:00');
    const afternoon = medications.filter(med => med.time && med.time >= '12:00');
    container.innerHTML = `
        <div style="display: flex; gap: 32px; flex-wrap: wrap;">
            <div style="flex:1; min-width: 220px;">
                <h4 style="display:flex;align-items:center;gap:8px;color:#f7b731;font-size:1.1rem;margin-bottom:16px;">
                    <i class="fas fa-sun"></i> Manhã (até 12h)
                </h4>
                <ul style="list-style:none;padding:0;">
                    ${morning.length === 0 ? '<li style=\'color:#aaa\'>Nenhum medicamento</li>' :
                        morning.map(med => `
                        <li style='margin-bottom:10px;'>
                            <b>${med.name}</b> <span style='color:#667eea;font-weight:600;'>${med.time}</span>
                            <button onclick="deleteAdminMedication(${med.id})" class="btn btn-outline btn-xs" style="margin-left:8px;">Remover</button>
                        </li>`).join('')}
                </ul>
            </div>
            <div style="flex:1; min-width: 220px;">
                <h4 style="display:flex;align-items:center;gap:8px;color:#764ba2;font-size:1.1rem;margin-bottom:16px;">
                    <i class="fas fa-moon"></i> Tarde/Noite (após 12h)
                </h4>
                <ul style="list-style:none;padding:0;">
                    ${afternoon.length === 0 ? '<li style=\'color:#aaa\'>Nenhum medicamento</li>' :
                        afternoon.map(med => `
                        <li style='margin-bottom:10px;'>
                            <b>${med.name}</b> <span style='color:#667eea;font-weight:600;'>${med.time}</span>
                            <button onclick="deleteAdminMedication(${med.id})" class="btn btn-outline btn-xs" style="margin-left:8px;">Remover</button>
                        </li>`).join('')}
                </ul>
            </div>
        </div>
        <hr style="margin:18px 0;">
        <form id="addMedicationFormAdmin" onsubmit="saveAdminMedication();return false;">
            <input type="text" id="newMedicationNameAdmin" placeholder="Nome do medicamento" required style="width: 22%; margin-right: 8px;">
            <input type="time" id="newMedicationTimeAdmin" required style="width: 18%; margin-right: 8px;">
            <button type="submit" class="btn btn-primary btn-xs">Adicionar</button>
        </form>
    `;
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    setTimeout(() => {
        document.getElementById('adminUser').focus();
    }, 100);
}
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginForm').reset();
}
function adminLogin(event) {
    event.preventDefault();
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value;
    if (user === 'admin' && pass === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        closeLoginModal();
        showAdminSections();
        return false;
    } else {
        alert('Usuário ou senha inválidos!');
        return false;
    }
}
function showAdminSections() {
    var med = document.getElementById('medicationsManagement');
    var tech = document.getElementById('techniciansManagement');
    var admin = document.getElementById('adminContainer');
    if (med) med.style.display = 'block';
    if (tech) tech.style.display = 'block';
    if (admin) admin.style.display = 'block';
    const btn = document.getElementById('loginBtn');
    btn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
    btn.onclick = logoutAdmin;
}
function logoutAdmin() {
    localStorage.removeItem('isAdmin');
    document.getElementById('medicationsManagement').style.display = 'none';
    document.getElementById('techniciansManagement').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'none';
    const btn = document.getElementById('loginBtn');
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    btn.onclick = openLoginModal;
}
// Mostrar seções se já estiver logado
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isAdmin') === 'true') showAdminSections();
});

// Initialize the system when the page loads
let vitalSignsSystem;
document.addEventListener('DOMContentLoaded', () => {
    vitalSignsSystem = new VitalSignsSystem();
    renderTechniciansList();
    updateTechnicianDropdown();
}); 