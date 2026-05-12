const SALES_API = "http://localhost:3000/sales";
const PRES_API = "http://localhost:3000/prscription";

document.addEventListener("DOMContentLoaded", () => {
    loadPendingPrescriptions();
    document.getElementById("deliverBtn").addEventListener("click", deliverPrescription);
});

async function loadPendingPrescriptions() {
    const tbody = document.querySelector("#pendingTable tbody");
    tbody.innerHTML = "<tr><td colspan='4' style='text-align:center'>Syncing with database...</td></tr>";

    try {
        const res = await fetch(`${PRES_API}/details`);
        const data = await res.json();

        const pending = data.filter(item => item.STATUS !== 'DELIVERED');

        tbody.innerHTML = "";
        if (pending.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:20px;'>All prescriptions processed. ✅</td></tr>";
            return;
        }

        pending.forEach(pres => {
            const pId = pres.PRESCRIPTION_ID;
            const pDate = pres.DATE_P;
            const pPatient = pres.PATIENT_NAME || "Unknown";

            const tr = document.createElement("tr");
            tr.className = "clickable-row";
            tr.onclick = () => { document.getElementById("prescriptionId").value = pId; };

            tr.innerHTML = `
                <td><strong>#${pId}</strong></td>
                <td>${pDate ? new Date(pDate).toLocaleDateString() : 'N/A'}</td>
                <td>${pPatient}</td>
                <td><span class="badge-pending">PENDING</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = "<tr><td colspan='4' style='color:red; text-align:center'>Error: API not reachable</td></tr>";
    }
}

async function deliverPrescription() {
    const presId = document.getElementById("prescriptionId").value.trim();
    const salesId = document.getElementById("salesIdInput").value.trim();
    const statusMsg = document.getElementById("statusMessage");

    if (!presId || !salesId) {
        statusMsg.style.color = "#e74a3b";
        statusMsg.innerText = " Error: Fill both Prescription & Staff ID!";
        return;
    }

    try {
        const res = await fetch(`${SALES_API}/deliver/${presId}/${salesId}`, { method: "PUT" });

        if (res.ok) {
            statusMsg.style.color = "#1cc88a";
            statusMsg.innerHTML = ` Successfully Fulfilled #${presId}`;

            addActivityLog(presId, salesId);
            loadPendingPrescriptions();
            document.getElementById("prescriptionId").value = "";
        } else {
            const err = await res.json().catch(() => ({}));
            statusMsg.style.color = "#e74a3b";
            statusMsg.innerText = ` Error: ${err.error || 'Delivery failed'}`;
        }
    } catch (err) {
        statusMsg.innerText = " Connection to server failed.";
    }
}

function addActivityLog(pId, sId) {
    const list = document.getElementById("logList");
    const li = document.createElement("li");
    li.innerHTML = `<span>Prescription <b>#${pId}</b> delivered by Staff <b>#${sId}</b></span> <small>${new Date().toLocaleTimeString()}</small>`;
    list.prepend(li);
}