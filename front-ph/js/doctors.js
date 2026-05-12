const API_URL = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', () => {

    const role = localStorage.getItem('userRole');

    const viewSection = document.getElementById('view-doctors-section');
    const registerSection = document.getElementById('register-doctor-section');
    const prescriptionSection = document.getElementById('prescription-section');

    [viewSection, registerSection, prescriptionSection].forEach(s => {
        if (s) s.classList.add('hidden');
    });

    if (role === 'patient' || role === 'salesperson') {
        if (viewSection) viewSection.classList.remove('hidden');
        loadDoctorsList();
    }
    else if (role === 'doctor') {
        fetchMedicines();
        checkDoctorStatus();
    }
});


// تأكد من حالة الطبيب 

async function checkDoctorStatus() {

    const savedId = localStorage.getItem('activeDoctorId');
    const registerSection = document.getElementById('register-doctor-section');
    const prescriptionSection = document.getElementById('prescription-section');
    const historySection = document.getElementById('patient-history-section');

    if (savedId && savedId !== "null") {
        if (prescriptionSection) prescriptionSection.classList.remove('hidden');
        if (historySection) historySection.classList.remove('hidden');
        if (registerSection) registerSection.classList.add('hidden');
        loadPatientsDropdown();
        return;
    }

    // استبدال prompt بـ SweetAlert2
    const { value: docId } = await Swal.fire({
        title: 'Welcome Doctor!',
        text: 'Please enter your Medical License ID or (cancel) to Login :',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Verify ID',
        confirmButtonColor: '#2563eb',
        allowOutsideClick: false,
    });

    if (docId) {

        try {
            const response = await fetch(`${API_URL}/doctors/${docId}`);
            if (response.ok) {

                localStorage.setItem('activeDoctorId', docId);

                if (prescriptionSection) prescriptionSection.classList.remove('hidden');
                if (historySection) historySection.classList.remove('hidden');
                if (registerSection) registerSection.classList.add('hidden');

                loadPatientsDropdown();
            } else {
                // استبدال alert بـ SweetAlert2
                Swal.fire('Error', 'ID not found.', 'error');
                showRegistration(registerSection, prescriptionSection, historySection);
            }
        } catch (err) {
            Swal.fire('Error', 'Connection error.', 'error');
        }
    } else {
        showRegistration(registerSection, prescriptionSection, historySection);
    }
}


function showRegistration(reg, pres, hist) {
    if (reg) reg.classList.remove('hidden');
    if (pres) pres.classList.add('hidden');
    if (hist) hist.classList.add('hidden');
    setupRegistration();
}


// الاطباء لي يشوفهم لمريض 

async function loadDoctorsList() {
    try {
        const response = await fetch(`${API_URL}/doctors`);
        const doctors = await response.json();
        const listContainer = document.getElementById('doctors-list');

        listContainer.innerHTML = doctors.map(doc => `
            <div class="doctor-card">
                <i class="fas fa-user-md"></i>
                <span class="speciality-tag">${doc.SPECIALITY}</span>
                <h3>Dr. ${doc.NAME_D}</h3>
                <div class="location-box">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${doc.ADDRESS}</span>
                </div>
                <p style="margin-top: 15px; font-size: 0.8rem; color: #1b222a;">License ID: #${doc.ID_D}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading doctors:", err);
    }
}

// دالة تسجيل الطبيب 

function setupRegistration() {

    const form = document.getElementById('doctor-reg-form');
    form.onsubmit = async (e) => {

        e.preventDefault();

        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Registering...`;
        submitBtn.style.pointerEvents = 'none';

        const doctorData = {
            NAME_D: document.getElementById('reg-name').value,
            SPECIALITY: document.getElementById('reg-speciality').value,
            ADDRESS: document.getElementById('reg-address').value
        };

        try {

            const response = await fetch(`${API_URL}/doctors/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doctorData)
            });

            if (response.ok) {

                const allDocsRes = await fetch(`${API_URL}/doctors`);
                const allDocs = await allDocsRes.json();

                const myInfo = allDocs.find(doc =>
                    doc.NAME_D === doctorData.NAME_D &&
                    doc.ADDRESS === doctorData.ADDRESS
                );

                if (myInfo) {

                    localStorage.setItem('activeDoctorId', myInfo.ID_D);
                    // استبدال alert بـ SweetAlert2
                    await Swal.fire('Success', ``, 'success');


                    document.getElementById('register-doctor-section').classList.add('hidden');
                    document.getElementById('prescription-section').classList.remove('hidden');

                    const historySection = document.getElementById('patient-history-section');
                    if (historySection) historySection.classList.remove('hidden');

                    loadPatientsDropdown();
                }
            }
        } catch (err) {
            Swal.fire('Error', 'Error during registration process.', 'error');
            submitBtn.innerHTML = "Register & Continue";
            submitBtn.style.pointerEvents = "auto";
        }
    };
}


// جلب قائمة المرضى لي كاين في داتا بايز 

async function loadPatientsDropdown() {
    try {
        const response = await fetch(`${API_URL}/patientes`);
        const patients = await response.json();


        const selectPrescription = document.getElementById('patient-select');

        const selectHistory = document.getElementById('history-patient-select');

        const optionsHTML = `<option value="" disabled selected>Select Patient</option>` +
            patients.map(p =>
                `<option value="${p.ID_P}">
                    ID: ${p.ID_P} | ${p.FANAME} ${p.LNAME} (Age: ${p.AGE})
                </option>`
            ).join('');


        if (selectPrescription) selectPrescription.innerHTML = optionsHTML;
        if (selectHistory) selectHistory.innerHTML = optionsHTML;

    } catch (err) {
        console.error("Error loading patients:", err);
    }
}

// جلب الدواء لي كاين 

let availableMedicines = [];

async function fetchMedicines() {
    try {
        const response = await fetch(`${API_URL}/medicines`);
        availableMedicines = await response.json();
        console.log("Medicines loaded:", availableMedicines);
    } catch (err) {
        console.error("Failed to load medicines list", err);
    }
}


// زيادة صف في معلومات الوصفة لي رح يديرها طبيب 

function addMedicineRow() {

    const list = document.getElementById('medicines-list');
    const row = document.createElement('div');
    row.className = 'medicine-row';

    const medicineOptions = availableMedicines.map(med =>
        `<option value="${med.NAME}">${med.NAME}</option>`
    ).join('');

    row.innerHTML = `
        <div class="col">
            <select class="med-id" required>
                <option value="" disabled selected>Select Medication</option>
                ${medicineOptions}
            </select>
        </div>
        <div class="col">
            <input type="number" class="med-freq" placeholder="Freq " min="1" required>
        </div>
        <div class="col">
            <input type="number" class="med-dosage" placeholder="Dose (mg)" min="1" required>
        </div>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()" title="Remove">
            <i class="fas fa-times"></i>
        </button>
    `;
    list.appendChild(row);
}


//  زيادة الوصفة للداتا بايز 

document.getElementById('prescription-form').onsubmit = async (e) => {

    e.preventDefault();

    const doctorId = localStorage.getItem('activeDoctorId');
    const patientId = document.getElementById('patient-select').value;


    const today = new Date().toISOString().split('T')[0];

    const medicineRows = document.querySelectorAll('.medicine-row');

    const medicinesArray = Array.from(medicineRows).map(row => ({
        ID_MED: row.querySelector('.med-id').value.trim(),
        FREQ: parseInt(row.querySelector('.med-freq').value) || 0,
        DOSAGE: parseInt(row.querySelector('.med-dosage').value) || 0
    }));

    if (medicinesArray.length === 0) {
        Swal.fire('Note', 'Please add at least one medicine.', 'info');
        return;
    }


    const prescriptionPayload = {
        DATE_P: today,
        ID_DOCTOR: parseInt(doctorId),
        ID_PATIENT: parseInt(patientId),
        MEDICINES: medicinesArray
    };

    console.log("Payload to send:", prescriptionPayload);

    try {
        const response = await fetch(`${API_URL}/prscription/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prescriptionPayload)
        });

        if (response.ok) {
            Swal.fire('Success', 'E-Prescription issued successfully! 🟢', 'success');
            document.getElementById('medicines-list').innerHTML = '';
            e.target.reset();
        } else {
            const errorText = await response.text();
            Swal.fire('Server Error', errorText, 'error');
        }
    } catch (err) {
        Swal.fire('Error', 'Connection error: Make sure the server is running.', 'error');
    }
};

// سجلات المرضى 

async function viewPatientHistory() {
    const patientId = document.getElementById('history-patient-select').value;
    const resultsContainer = document.getElementById('history-results');

    if (!patientId) {
        Swal.fire('Selection Required', 'Please select a patient first.', 'info');
        return;
    }


    resultsContainer.innerHTML = `
        <div class="loader-container" style="text-align: center; padding: 40px; color: #3b82f6;">
            <i class="fas fa-circle-notch fa-spin fa-3x"></i>
            <p style="margin-top: 15px; font-weight: 600;">Fetching Medical Records...</p>
        </div>`;

    try {
        const response = await fetch(`${API_URL}/doctor/patient-history/${patientId}`);

        if (!response.ok) throw new Error("History not found");

        const history = await response.json();

        if (!history || history.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-data-msg" style="text-align: center; padding: 50px; background: #f8fafc; border-radius: 20px;">
                    <i class="fas fa-folder-open fa-4x" style="color: #cbd5e1; margin-bottom: 20px;"></i>
                    <p style="color: #64748b; font-size: 1.1rem;">No previous medical records found for this patient.</p>
                </div>`;
            return;
        }


        resultsContainer.innerHTML = history.map(pres => `
            <div class="history-card">
                <div class="card-header">
                    <div class="header-left">
                        <span class="pres-id-badge">ID: #${pres.PRESCRIPTION_ID}</span>
                        <span class="date-text"><i class="far fa-calendar-alt"></i> ${new Date(pres.DATE_P).toLocaleDateString()}</span>
                    </div>
                    <span class="status-badge-pending" style="background: #fff7ed; color: #c2410c; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; border: 1px solid #ffedd5;">
                        ${pres.STATUS || 'PENDING'}
                    </span>
                </div>
                
                <div class="card-content">
                    <div class="doctor-info-box">
                        <div class="doctor-name">Dr. ${pres.DOCTOR_NAME}</div>
                        <div class="speciality-tag">${pres.SPECIALITY || 'General Physician'}</div>
                        <div style="margin-top:12px; font-size: 0.85rem; color:#64748b; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-clinic-medical" style="color: #3b82f6;"></i> 
                            ${pres.PHARMACY_NAME || 'Main Medical Center'}
                        </div>
                    </div>

                    <div class="meds-container">
                        <p style="font-weight:700; margin-bottom:12px; font-size:0.9rem; color: #1e293b; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-pills" style="color: #2563eb;"></i> Prescribed Medications
                        </p>
                        <div class="meds-display-list">
                            ${pres.MEDICINES.map(m => `
                                <div class="med-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: #f8fafc; border-radius: 12px; margin-bottom: 8px; border: 1px solid #f1f5f9;">
                                    <span style="font-weight: 600; color: #2563eb;">${m.MEDICINE_NAME || "Unknown Medicine"}</span>
                                    <span style="font-size: 0.85rem; color: #64748b; background: white; padding: 4px 10px; border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 500;">
                                        ${m.DOSAGE}mg — ${m.FREQUENCY}x Daily
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="card-footer" style="border-top: 1px solid #f1f5f9; padding: 10px 20px; background: #fafafa;">
                    <button onclick="printPrescription(${pres.PRESCRIPTION_ID})" class="btn-search" style="width: 100%; justify-content: center; background: #334155;">
                        <i class="fas fa-print"></i> Print Medical Report
                    </button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        Swal.fire('Error', 'Connection Error: Could not reach the history service.', 'error');
    }
}

// طباعة 

async function printPrescription(prescriptionId) {

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    printWindow.document.write('<html><body><p style="text-align:center; font-family:sans-serif;">Generating Prescription Preview...</p></body></html>');

    try {
        const response = await fetch(`${API_URL}/doctor/patient-history/${document.getElementById('history-patient-select').value}`);
        const history = await response.json();
        const pres = history.find(p => p.PRESCRIPTION_ID == prescriptionId);

        if (!pres) {
            printWindow.document.body.innerHTML = "Error: Prescription details not found.";
            return;
        }

        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>Prescription #${pres.PRESCRIPTION_ID}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
                    .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                    .hospital-name { font-size: 24px; font-weight: 800; color: #2563eb; text-transform: uppercase; }
                    .rx-symbol { font-size: 60px; color: #f1f5f9; position: absolute; top: 80px; right: 50px; z-index: -1; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 10px; }
                    .info-item { font-size: 14px; }
                    .info-item strong { color: #64748b; text-transform: uppercase; font-size: 11px; display: block; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #2563eb; color: white; text-align: left; padding: 15px; font-size: 13px; }
                    td { padding: 15px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
                    .med-name { font-weight: 700; color: #1e293b; }
                    .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
                    .signature-box { margin-top: 50px; text-align: right; }
                    .sig-line { border-top: 1px solid #334155; width: 200px; display: inline-block; margin-top: 40px; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="rx-symbol">Rx</div>
                <div class="header">
                    <div class="hospital-name">Medical Prescription</div>
                    <div style="text-align: right">
                        <div style="font-weight: bold;">ID: #${pres.PRESCRIPTION_ID}</div>
                        <div style="font-size: 13px; color: #64748b;">Date: ${new Date(pres.DATE_P).toLocaleDateString()}</div>
                    </div>
                </div>
                
                <div class="info-grid">
                    <div class="info-item"><strong>Doctor Name</strong>Dr. ${pres.DOCTOR_NAME}</div>
                    <div class="info-item"><strong>Speciality</strong>${pres.SPECIALITY || 'General Practice'}</div>
                    <div class="info-item"><strong>Facility</strong>${pres.PHARMACY_NAME || 'Main Medical Center'}</div>
                    <div class="info-item"><strong>Patient ID</strong>#${document.getElementById('history-patient-select').value}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Medication Name</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pres.MEDICINES.map(m => `
                            <tr>
                                <td class="med-name">${m.MEDICINE_NAME}</td>
                                <td>${m.DOSAGE} mg</td>
                                <td>${m.FREQUENCY} times daily</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="signature-box">
                    <p style="margin-bottom: 0;">Authorized Signature</p>
                    <span class="sig-line"></span>
                </div>

                <div class="footer">
                    <p>This document is an official medical record issued via the Digital Health System.</p>
                </div>

                <div style="text-align: center; margin-top: 30px;" class="no-print">
                    <button onclick="window.print()" style="padding: 12px 30px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-print"></i> Print Now
                    </button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();

    } catch (err) {
        console.error("Print Error:", err);
        if (printWindow) printWindow.document.body.innerHTML = "Failed to load prescription data.";
    }
}