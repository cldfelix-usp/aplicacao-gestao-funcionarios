
const API_URL = "http://localhost:5057/api/v1";

export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: `${API_URL}/auth/login`,
    },

    EMPLOYEES: {
      GET_ALL: `${API_URL}/employees`,
      CREATE: `${API_URL}/employees`,
      GET_BY_ID: (id) => `${API_URL}/employees/${id}`,
      UPDATE: (id) => `${API_URL}/employees/${id}`,
      DELETE: (id) => `${API_URL}/employees/${id}`,
      GETSUBORDINADOS: (userRole) => `${API_URL}/employees/subordinados/${userRole}`
    }
  };
  
  export default API_ENDPOINTS;