const API_URL = 'http://localhost:5000/api';

// Get case ID from URL
const urlParams = new URLSearchParams(window.location.search);
const caseId = urlParams.get('id');

// DOM Elements
const caseDetailContainer = document.getElementById('caseDetailContainer');
const backBtn = document.getElementById('backBtn');
const editBtn = document.getElementById('editBtn');
const editModal = document.getElementById('editModal');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editCaseForm = document.getElementById('editCaseForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCaseDetail();
    setupEventListeners();
});

function setupEventListeners() {
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    editBtn.addEventListener('click', openEditModal);
    closeEditModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);
    
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });

    editCaseForm.addEventListener('submit', handleEditSubmit);
}

async function loadCaseDetail() {
    if (!caseId) {
        caseDetailContainer.innerHTML = '<div class="error">No case ID provided</div>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cases/${caseId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch case');
        }
        
        const caseData = await response.json();
        renderCaseDetail(caseData);
    } catch (error) {
        console.error('Error loading case:', error);
        caseDetailContainer.innerHTML = '<div class="error">Error loading case details. Please try again.</div>';
    }
}

function renderCaseDetail(caseData) {
    caseDetailContainer.innerHTML = `
        <div class="case-detail-card">
            <div class="detail-section">
                <h2 class="detail-title">${escapeHtml(caseData.title)}</h2>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Case ID</span>
                        <span class="detail-value">${escapeHtml(caseData.case_number)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Sample Type</span>
                        <span class="detail-value">${escapeHtml(caseData.sample_type || 'N/A')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Line of Business</span>
                        <span class="detail-value">${escapeHtml(caseData.line_of_business || 'N/A')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Market</span>
                        <span class="detail-value">${escapeHtml(caseData.market || 'N/A')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Region</span>
                        <span class="detail-value">${escapeHtml(caseData.region || 'N/A')}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3 class="section-title">Participants</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Client</span>
                        <span class="detail-value">${escapeHtml(caseData.client_name)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Respondent</span>
                        <span class="detail-value">${escapeHtml(caseData.respondent_name)}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3 class="section-title">Responses</h3>
                <div class="responses-container">
                    <div class="response-item">
                        <span class="response-label">Client:</span>
                        <p class="response-text">${escapeHtml(caseData.client_response || 'No response yet')}</p>
                    </div>
                    <div class="response-item">
                        <span class="response-label">Respondent:</span>
                        <p class="response-text">${escapeHtml(caseData.respondent_response || 'No response yet')}</p>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3 class="section-title">Dates</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Created</span>
                        <span class="detail-value">${formatDate(caseData.created_at)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Updated</span>
                        <span class="detail-value">${formatDate(caseData.updated_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function openEditModal() {
    loadCaseForEdit();
    editModal.classList.add('active');
}

function closeModal() {
    editModal.classList.remove('active');
}

async function loadCaseForEdit() {
    try {
        const response = await fetch(`${API_URL}/cases/${caseId}`);
        const caseData = await response.json();

        document.getElementById('editCaseNumber').value = caseData.case_number;
        document.getElementById('editCaseTitle').value = caseData.title;
        document.getElementById('editClientName').value = caseData.client_name;
        document.getElementById('editRespondentName').value = caseData.respondent_name;
        document.getElementById('editSampleType').value = caseData.sample_type || 'Type1';
        document.getElementById('editLineOfBusiness').value = caseData.line_of_business || '';
        document.getElementById('editMarket').value = caseData.market || '';
        document.getElementById('editRegion').value = caseData.region || '';
        document.getElementById('editClientResponse').value = caseData.client_response || '';
        document.getElementById('editRespondentResponse').value = caseData.respondent_response || '';
    } catch (error) {
        console.error('Error loading case for edit:', error);
        alert('Error loading case data');
    }
}

async function handleEditSubmit(e) {
    e.preventDefault();

    const formData = {
        case_number: document.getElementById('editCaseNumber').value.trim(),
        title: document.getElementById('editCaseTitle').value.trim(),
        client_name: document.getElementById('editClientName').value.trim(),
        respondent_name: document.getElementById('editRespondentName').value.trim(),
        sample_type: document.getElementById('editSampleType').value,
        line_of_business: document.getElementById('editLineOfBusiness').value.trim(),
        market: document.getElementById('editMarket').value.trim(),
        region: document.getElementById('editRegion').value.trim(),
        client_response: document.getElementById('editClientResponse').value.trim(),
        respondent_response: document.getElementById('editRespondentResponse').value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/cases/${caseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update case');
        }

        const updatedCase = await response.json();
        closeModal();
        renderCaseDetail(updatedCase);
    } catch (error) {
        console.error('Error updating case:', error);
        alert('Error updating case: ' + error.message);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day.toString().padStart(2, '0')} ${year}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
