const API_BASE_URL = "http://localhost:3000";

export const endpoints = {
    getDoctors: `${API_BASE_URL}/doctors`,
    addPrescription: `${API_BASE_URL}/prscription/add`,
    getHistory: (id) => `${API_BASE_URL}/patientes/history/${id}`,
};