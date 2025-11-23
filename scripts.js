// Global variables
let currentSection = 'dashboard';
let isInitialized = false;
let dashboardLoaded = false;
let viewDonorsLoaded = false;
let apiCallInProgress = false;

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== APP STARTED ===');

    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);

    if (currentPage === 'login.html' || currentPage === 'login') {
        initializeLoginPage();
    } else {
        initializeApp();
    }
});

// Login page functionality
function initializeLoginPage() {
    console.log('Initializing login page');
    localStorage.removeItem('loggedIn');

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('loggedIn', 'true');
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Login failed: ' + result.error);
        }
    } catch (error) {
        alert('Network error. Check if server is running.');
    }
}

// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'login.html' || currentPage === 'login') {
        if (isLoggedIn) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    } else {
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Main application initialization
function initializeApp() {
    console.log('initializeApp called');

    if (!checkAuth()) return;

    if (isInitialized) {
        console.log('App already initialized');
        return;
    }

    console.log('First time initialization');
    isInitialized = true;

    setupNavigation();

    // Add quick location buttons
    addQuickLocationButtons();

    // Wait for DOM to be fully ready before showing dashboard
    setTimeout(() => {
        showSection('dashboard');
        // Load dashboard stats after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (!dashboardLoaded) {
                console.log('Loading dashboard stats on app start');
                loadDashboardStats();
            }
        }, 500);
    }, 100);
}

function setupNavigation() {
    console.log('Setting up navigation');

    // Setup navigation buttons
    document.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const text = this.textContent.toLowerCase();
            console.log('Navigation clicked:', text);

            if (text.includes('dashboard')) {
                showSection('dashboard');
                // Always load dashboard when explicitly clicking it
                if (!dashboardLoaded) {
                    console.log('Loading dashboard on button click');
                    loadDashboardStats();
                }
            } else if (text.includes('add')) {
                showSection('addDonor');
            } else if (text.includes('search')) {
                showSection('searchDonors');
            } else if (text.includes('view')) {
                showSection('viewDonors');
            } else if (text.includes('logout')) {
                logout();
            }
        });
    });

    // Setup form submissions
    const addDonorForm = document.getElementById('addDonorForm');
    if (addDonorForm) {
        addDonorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addDonor();
        });
    }

    const searchDonorsForm = document.getElementById('searchDonorsForm');
    if (searchDonorsForm) {
        searchDonorsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchNearestDonors();
        });
    }
}

// Navigation functions
function showSection(sectionId) {
    console.log('showSection called:', sectionId, 'Current:', currentSection);

    if (currentSection === sectionId) {
        console.log('Already on this section');
        return;
    }

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;

        console.log('Section changed to:', sectionId);

        // Update page title
        updatePageTitle(sectionId);

        // Update active nav item
        updateActiveNav(sectionId);

        // Improved section loading logic
        if (sectionId === 'dashboard') {
            // Always try to load dashboard if not loaded, or if it's been a while
            if (!dashboardLoaded) {
                console.log('Loading dashboard in showSection');
                setTimeout(() => loadDashboardStats(), 100);
            }
        } else if (sectionId === 'viewDonors' && !apiCallInProgress) {
            if (!viewDonorsLoaded) {
                console.log('Loading view donors for the first time');
                loadDonors();
            }
        }
    }
}

function updatePageTitle(sectionId) {
    const titles = {
        'dashboard': 'Dashboard',
        'addDonor': 'Add Donor',
        'searchDonors': 'Search Donors',
        'viewDonors': 'View Donors'
    };

    const titleElement = document.getElementById('pageTitle');
    if (titleElement && titles[sectionId]) {
        titleElement.textContent = titles[sectionId];
    }
}

function updateActiveNav(sectionId) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current section
    const navItems = document.querySelectorAll('.nav-item');
    const sectionIndex = ['dashboard', 'addDonor', 'searchDonors', 'viewDonors'].indexOf(sectionId);
    if (sectionIndex !== -1 && navItems[sectionIndex]) {
        navItems[sectionIndex].classList.add('active');
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

// Dashboard functions
async function loadDashboardStats() {
    if (apiCallInProgress) {
        console.log('API call already in progress, skipping dashboard load');
        return;
    }

    console.log('=== LOADING DASHBOARD STATS ===');
    apiCallInProgress = true;

    try {
        // Check if DOM elements exist before trying to update them
        const totalDonorsElement = document.getElementById('totalDonors');
        const bloodGroupStatsElement = document.getElementById('bloodGroupStats');

        if (!totalDonorsElement || !bloodGroupStatsElement) {
            console.error('Dashboard DOM elements not found yet');
            apiCallInProgress = false;
            return;
        }

        console.log('Making API call to:', `${API_BASE_URL}/display_donors?bloodGroup=all`);
        const response = await fetch(`${API_BASE_URL}/display_donors?bloodGroup=all`);

        console.log('API Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Result:', result);

        if (result.success) {
            const donors = result.data.donors || [];
            console.log('Donors data received:', donors);

            // Double-check elements exist before updating
            if (document.getElementById('totalDonors')) {
                document.getElementById('totalDonors').textContent = donors.length;
            }

            const stats = calculateBloodGroupStats(donors);
            displayBloodGroupStats(stats);
            dashboardLoaded = true;

            console.log('Dashboard loaded successfully with', donors.length, 'donors');
        } else {
            console.error('Dashboard API returned error:', result.error);
            // Show error state in UI
            if (document.getElementById('totalDonors')) {
                document.getElementById('totalDonors').textContent = 'Error';
            }
        }
    } catch (error) {
        console.error('Dashboard loading failed:', error);
        // Show error state in UI
        if (document.getElementById('totalDonors')) {
            document.getElementById('totalDonors').textContent = 'Error';
        }
    } finally {
        apiCallInProgress = false;
        console.log('Dashboard loading completed');
    }
}

function calculateBloodGroupStats(donors) {
    const stats = {
        'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
        'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
    };

    donors.forEach(donor => {
        if (stats.hasOwnProperty(donor.bloodGroup)) {
            stats[donor.bloodGroup]++;
        }
    });

    return stats;
}

function displayBloodGroupStats(stats) {
    const container = document.getElementById('bloodGroupStats');
    if (!container) {
        console.error('Blood group stats container not found');
        return;
    }

    container.innerHTML = '';

    for (const [bloodGroup, count] of Object.entries(stats)) {
        const statItem = document.createElement('div');
        statItem.className = 'blood-group-stat';
        statItem.innerHTML = `
            <span class="blood-group">${bloodGroup}</span>
            <span class="count">${count}</span>
        `;
        container.appendChild(statItem);
    }

    console.log('Blood group stats displayed');
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('donorPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');

            // Limit to 10 digits
            if (value.length > 10) {
                value = value.substring(0, 10);
            }

            e.target.value = value;
        });
    }
});

// SIMPLE Geocoding functions - Back to basics
async function geocodeAddress() {
    const addressInput = document.getElementById('donorAddress');
    const address = addressInput.value.trim();

    if (!address) {
        alert('Please enter an address first');
        return;
    }
    showMessage('Searching for address...', 'info');

    try {
        console.log('Searching for address:', address);

        const response = await fetch(`${API_BASE_URL}/geocode`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ address: address })
        });

        const result = await response.json();
        console.log('Geocoding result:', result);

        if (result.success) {
            document.getElementById('donorLatitude').value = result.latitude;
            document.getElementById('donorLongitude').value = result.longitude;
            showMessage(`Address found successfully!`, 'success');
        } else {
            showMessage('Address not found. Try a different format or be more specific.', 'error');
            console.log('Address suggestions:');
            console.log('- Try: "Connaught Place, New Delhi"');
            console.log('- Try: "MG Road, Bangalore"');
            console.log('- Try: "Marine Drive, Mumbai"');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        showMessage('Network error during address search', 'error');
    }
}

// SIMPLE Hospital address geocoding
async function geocodeHospitalAddress() {
    const addressInput = document.getElementById('hospitalAddress');
    const address = addressInput.value.trim();

    if (!address) {
        alert('Please enter hospital address first');
        return;
    }
    showMessage('Searching for hospital address...', 'info');

    try {
        console.log('Searching for hospital:', address);

        const response = await fetch(`${API_BASE_URL}/geocode`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ address: address })
        });

        const result = await response.json();
        console.log('Hospital geocoding result:', result);

        if (result.success) {
            document.getElementById('hospitalLatitude').value = result.latitude;
            document.getElementById('hospitalLongitude').value = result.longitude;
            showMessage(`Hospital location found!`, 'success');
        } else {
            showMessage('Hospital not found. Try: "AIIMS Delhi" or "Apollo Hospital"', 'error');
        }
    } catch (error) {
        console.error('Hospital geocoding error:', error);
        showMessage('Network error during hospital search', 'error');
    }
}

// Add quick location buttons for major cities
function addQuickLocationButtons() {
    const cities = {
        'Delhi': [28.6139, 77.2090],
        'Mumbai': [19.0760, 72.8777],
        'Bangalore': [12.9716, 77.5946],
        'Chennai': [13.0827, 80.2707],
        'Kolkata': [22.5726, 88.3639],
        'Hyderabad': [17.3850, 78.4867]
    };

    const donorButtonContainer = document.createElement('div');
    donorButtonContainer.style.marginTop = '1rem';
    donorButtonContainer.innerHTML = '<strong>Quick City Locations:</strong><br>';

    Object.keys(cities).forEach(city => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-sm';
        button.textContent = city;
        button.style.margin = '0.25rem';
        button.onclick = () => {
            document.getElementById('donorLatitude').value = cities[city][0];
            document.getElementById('donorLongitude').value = cities[city][1];
            showMessage(`Set coordinates for ${city}`, 'success');
        };
        donorButtonContainer.appendChild(button);
    });

    const donorAddressGroup = document.querySelector('.form-group label[for="donorAddress"]')?.parentNode;
    if (donorAddressGroup) {
        donorAddressGroup.appendChild(donorButtonContainer);
    }

    // Also add to hospital address section
    const hospitalButtonContainer = document.createElement('div');
    hospitalButtonContainer.style.marginTop = '1rem';
    hospitalButtonContainer.innerHTML = '<strong>Quick City Locations:</strong><br>';

    Object.keys(cities).forEach(city => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-sm';
        button.textContent = city;
        button.style.margin = '0.25rem';
        button.onclick = () => {
            document.getElementById('hospitalLatitude').value = cities[city][0];
            document.getElementById('hospitalLongitude').value = cities[city][1];
            showMessage(`Set coordinates for ${city}`, 'success');
        };
        hospitalButtonContainer.appendChild(button);
    });

    const hospitalAddressGroup = document.querySelector('.form-group label[for="hospitalAddress"]')?.parentNode;
    if (hospitalAddressGroup) {
        hospitalAddressGroup.appendChild(hospitalButtonContainer);
    }
}

// Donor management functions
async function addDonor() {
    const name = document.getElementById('donorName').value.trim();
    let phone = document.getElementById('donorPhone').value.trim();
    const bloodGroup = document.getElementById('donorBloodGroup').value;
    const address = document.getElementById('donorAddress').value.trim();
    const latitude = parseFloat(document.getElementById('donorLatitude').value);
    const longitude = parseFloat(document.getElementById('donorLongitude').value);

    if (!name || !phone || !bloodGroup || !address || isNaN(latitude) || isNaN(longitude)) {
        alert('Please fill all fields with valid data');
        return;
    }

    if (phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    const formData = { name, phone, bloodGroup, address, latitude, longitude };
    try {
        const response = await fetch(`${API_BASE_URL}/add_donor`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            alert('Donor added successfully!');
            document.getElementById('addDonorForm').reset();
            // Reset flags to force reload
            dashboardLoaded = false;
            viewDonorsLoaded = false;
        } else {
            alert('Error adding donor: ' + result.error);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

// Search functions
async function searchNearestDonors() {
    const bloodGroup = document.getElementById('searchBloodGroup').value;
    const hospitalLat = parseFloat(document.getElementById('hospitalLatitude').value);
    const hospitalLon = parseFloat(document.getElementById('hospitalLongitude').value);

    if (!bloodGroup || isNaN(hospitalLat) || isNaN(hospitalLon)) {
        alert('Please fill all fields with valid data');
        return;
    }

    const formData = { bloodGroup, hospitalLat, hospitalLon };
    try {
        const response = await fetch(`${API_BASE_URL}/search_donors`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            displaySearchResults(result.data.donors || [], hospitalLat, hospitalLon);
        } else {
            alert('Error searching donors: ' + result.error);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

function displaySearchResults(donors, hospitalLat, hospitalLon) {
    const donorsList = document.getElementById('donorsList');
    donorsList.innerHTML = '';

    if (donors.length === 0) {
        donorsList.innerHTML = '<p>No donors found for the specified blood group.</p>';
        return;
    }

    donors.forEach((donor) => {
        const donorItem = document.createElement('div');
        donorItem.className = 'donor-item';
        donorItem.innerHTML = `
            <h4>${donor.name} (${donor.bloodGroup})</h4>
            <p><strong>Phone:</strong> ${donor.phone}</p>
            <p><strong>Address:</strong> ${donor.address}</p>
            <p><strong>Distance:</strong> ${donor.distance ? donor.distance.toFixed(2) : 'N/A'} km</p>
        `;
        donorsList.appendChild(donorItem);
    });
}

// View Donors functions
async function loadDonors() {
    if (apiCallInProgress) {
        console.log('API call already in progress, skipping donors load');
        return;
    }

    console.log('Loading donors...');
    apiCallInProgress = true;

    const bloodGroup = document.getElementById('filterBloodGroup').value;

    try {
        const response = await fetch(`${API_BASE_URL}/display_donors?bloodGroup=${encodeURIComponent(bloodGroup)}`);
        const result = await response.json();

        if (result.success) {
            displayDonorsTable(result.data.donors || []);
            viewDonorsLoaded = true;
            console.log('Donors loaded successfully');
        } else {
            console.error('Donors API error:', result.error);
            alert('Error loading donors: ' + result.error);
        }
    } catch (error) {
        console.error('Donors network error:', error);
        alert('Network error: ' + error.message);
    } finally {
        apiCallInProgress = false;
    }
}

function displayDonorsTable(donors) {
    const container = document.getElementById('donorsTableContainer');
    if (!container) {
        console.error('Donors table container not found');
        return;
    }

    if (donors.length === 0) {
        container.innerHTML = '<p>No donors found.</p>';
        return;
    }

    let tableHTML = `
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Blood Group</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    donors.forEach(donor => {
        tableHTML += `
            <tr>
                <td>${donor.name}</td>
                <td>${donor.phone}</td>
                <td>${donor.bloodGroup}</td>
                <td>${donor.address}</td>
                <td>
                    <button onclick="editDonor('${donor.phone}', '${donor.bloodGroup}')" class="btn btn-sm">Edit</button>
                    <button onclick="deleteDonor('${donor.phone}', '${donor.bloodGroup}')" class="btn btn-sm btn-danger">Delete</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
                </tbody>
            </table>
            <p style="margin-top: 1rem;"><strong>Total donors:</strong> ${donors.length}</p>
        </div>
    `;

    container.innerHTML = tableHTML;
}

async function deleteDonor(phone, bloodGroup) {
    if (!confirm('Are you sure you want to delete this donor?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/delete_donor`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ phone, bloodGroup })
        });

        const result = await response.json();
        if (result.success) {
            alert('Donor deleted successfully!');
            // Reset flags to force reload
            dashboardLoaded = false;
            viewDonorsLoaded = false;
            loadDonors();
        } else {
            alert('Error deleting donor: ' + result.error);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

function editDonor(phone, bloodGroup) {
    const newPhone = prompt('Enter new phone number:', phone);
    if (!newPhone) return;
    
    if (!/^\d{10}$/.test(newPhone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    const newAddress = prompt('Enter new address:');
    if (!newAddress || newAddress.trim() === '') {
        alert('Please enter a valid address');
        return;
    }

    if (confirm(`Update donor?\nOld Phone: ${phone}\nNew Phone: ${newPhone}\nNew Address: ${newAddress}`)) {
        updateDonor(phone, bloodGroup, newAddress.trim(), newPhone);
    }
}

async function updateDonor(oldPhone, bloodGroup, newAddress, newPhone) {
    try {
        showMessage('Updating donor...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/update_donor`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                oldPhone: oldPhone, 
                bloodGroup: bloodGroup, 
                newAddress: newAddress, 
                newPhone: newPhone 
            })
        });

        const result = await response.json();
        
        if (result.success) {
            showMessage('Donor updated successfully!', 'success');
            // Reset flags to force reload
            dashboardLoaded = false;
            viewDonorsLoaded = false;
            // Reload the current view
            if (currentSection === 'viewDonors') {
                loadDonors();
            }
            if (currentSection === 'dashboard') {
                loadDashboardStats();
            }
        } else {
            showMessage('Error updating donor: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
}
// Utility functions
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10000;
        color: white;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Force reload dashboard function
function reloadDashboard() {
    console.log('Force reloading dashboard');
    dashboardLoaded = false;
    loadDashboardStats();
}