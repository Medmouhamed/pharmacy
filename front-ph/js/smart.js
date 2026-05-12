const SEARCH_API = "http://localhost:3000/patientes/search";
const SALES_API = "http://localhost:3000/sales";

async function runSmartSearch() {
    const prescriptionId = document.getElementById('prescInput').value.trim();
    const resultsContainer = document.getElementById('resultsContainer');
    const loader = document.getElementById('loader');

    if (!prescriptionId) return alert("Please enter Prescription ID");

    resultsContainer.innerHTML = "";
    loader.classList.remove('hidden');

    try {
        const response = await fetch(`http://localhost:3000/patientes/search/${prescriptionId}`);

        if (response.status === 400) {
            throw new Error("UNAVAILABLE: Some medicines are out of stock.");
        }

        const data = await response.json();

    
        if (data.status === "AVAILABLE" && data.parmacies) {
            renderResults(data.parmacies, data.message);
        } else {
            resultsContainer.innerHTML = `<div class="error-msg">No pharmacies found.</div>`;
        }

    } catch (err) {
        resultsContainer.innerHTML = `<div class="error-msg" style="color:#e74a3b">${err.message}</div>`;
    } finally {
        loader.classList.add('hidden');
    }
}

function renderResults(pharmacies, message) {
    const container = document.getElementById('resultsContainer');

    
    container.innerHTML = `<p style="color: #1cc88a; font-weight: bold;"> ${message}</p>`;

    pharmacies.forEach(ph => {
        container.innerHTML += `
            <div class="pharmacy-card" style="border-left: 5px solid #4e73df; padding: 15px; margin: 10px 0; background: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <strong style="font-size: 1.1em; color: #2e59d9;"> ${ph.NAME}</strong>
                <p style="margin: 5px 0; color: #5a5c69;">Address: ${ph.ADDRESS}</p>
            </div>`;
    });
}


async function verifyStaffAndRedirect() {
    const staffId = document.getElementById('staffIdInput').value.trim();
    const statusMsg = document.getElementById('staffStatus');

    if (!staffId) {
        statusMsg.style.color = "#e74a3b";
        statusMsg.innerText = " Error: Enter Staff ID!";
        return;
    }

    try {
        const res = await fetch(`${SALES_API}/employees`);
        const employees = await res.json();


        const staff = employees.find(emp => emp.ID_SP == staffId);

        if (staff) {
            statusMsg.style.color = "#1cc88a";
            statusMsg.innerText = ` Welcome ${staff.NAME}! Redirecting...`;

            setTimeout(() => {
                window.location.href = "sales.html";
            }, 800);
        } else {
            statusMsg.style.color = "#e74a3b";
            statusMsg.innerText = " Access Denied: Staff ID not found.";
        }
    } catch (err) {
        statusMsg.style.color = "#e74a3b";
        statusMsg.innerText = " Connection to server failed.";
    }
}
