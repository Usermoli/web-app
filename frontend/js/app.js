const API_URL = 'http://localhost:5000/api';

// DOM Elements
const caseGrid = document.getElementById('caseGrid');
const searchInput = document.getElementById('searchInput');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const caseModal = document.getElementById('caseModal');
const caseForm = document.getElementById('caseForm');

// State
let searchTimeout = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCases();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', handleSearch);
    
    // Modal buttons
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    caseModal.addEventListener('click', (e) => {
        if (e.target === caseModal) {
            closeModal();
        }
    });
    
    // Form submission
    caseForm.addEventListener('submit', handleFormSubmit);
}

// Load Cases from API
async function loadCases(search = '') {
    try {
        caseGrid.innerHTML = '<div class="loading">Loading cases...</div>';
        
        const url = search 
            ? `${API_URL}/cases?search=${encodeURIComponent(search)}`
            : `${API_URL}/cases`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch cases');
        }
        
        const cases = await response.json();
        renderCases(cases);
    } catch (error) {
        console.error('Error loading cases:', error);
        caseGrid.innerHTML = '<div class="empty-state"><p>Error loading cases. Please try again.</p></div>';
    }
}

// Handle Search
function handleSearch(e) {
    const query = e.target.value.trim();
    
    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadCases(query);
    }, 300);
}

// Render Cases
function renderCases(cases) {
    caseGrid.innerHTML = '';
    
    // Add case cards
    cases.forEach((caseItem, index) => {
        const card = createCaseCard(caseItem);
        caseGrid.appendChild(card);
    });
    
    // Add "New Case" card at the end
    const addCard = createAddCaseCard();
    caseGrid.appendChild(addCard);
    
    if (cases.length === 0) {
        // Add empty state message
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No cases found</p>';
        caseGrid.insertBefore(emptyState, caseGrid.lastElementChild);
    }
}

// Create Case Card
function createCaseCard(caseItem) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        window.location.href = `case-detail.html?id=${caseItem.id}`;
    });
    
    const createdDate = formatDate(caseItem.created_at);
    const updatedDate = formatDate(caseItem.updated_at);
    const isNew = isCaseNew(caseItem.created_at);
    
    card.innerHTML = `
        <div class="case-header">
            <div class="case-number">${escapeHtml(caseItem.case_number)}</div>
            ${isNew ? '<span class="new-tag">New</span>' : ''}
        </div>
        <div class="case-title">${escapeHtml(caseItem.title)}</div>
        <div class="case-participants">
            <div class="participant">
                <span class="participant-label">Client</span>
                <span class="participant-name">${escapeHtml(caseItem.client_name)}</span>
            </div>
            <div class="participant">
                <span class="participant-label">Respondent</span>
                <span class="participant-name">${escapeHtml(caseItem.respondent_name)}</span>
            </div>
        </div>
        <div class="case-dates">
            <p>Created on ${createdDate}</p>
            <p>Updated on ${updatedDate}</p>
        </div>
    `;
    
    return card;
}

// Create Add Case Card
function createAddCaseCard() {
    const card = document.createElement('div');
    card.className = 'add-case-card';
    card.addEventListener('click', openModal);
    
    card.innerHTML = `
        <button class="add-case-btn">
            <span class="plus-icon">+</span>
            <span>New Case</span>
        </button>
    `;
    
    return card;
}

// Modal Functions
function openModal() {
    caseModal.classList.add('active');
    caseForm.reset();
    document.getElementById('caseNumber').focus();
}

function closeModal() {
    caseModal.classList.remove('active');
}

// Handle Form Submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        case_number: document.getElementById('caseNumber').value.trim(),
        title: document.getElementById('caseTitle').value.trim(),
        client_name: document.getElementById('clientName').value.trim(),
        respondent_name: document.getElementById('respondentName').value.trim()
    };
    
    try {
        const response = await fetch(`${API_URL}/cases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create case');
        }
        
        const newCase = await response.json();
        
        // Close modal and reload cases
        closeModal();
        loadCases(searchInput.value.trim());
        
    } catch (error) {
        console.error('Error creating case:', error);
        alert('Error creating case: ' + error.message);
    }
}

// Utility Functions
function isCaseNew(dateString) {
    const caseDate = new Date(dateString);
    const today = new Date();
    
    return caseDate.getFullYear() === today.getFullYear() &&
           caseDate.getMonth() === today.getMonth() &&
           caseDate.getDate() === today.getDate();
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
