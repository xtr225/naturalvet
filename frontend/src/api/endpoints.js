export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  dashboard: {
    overview: "/dashboard/overview",
  },
  clients: {
    index: "/clients",
    detail: (id) => `/clients/${id}`,
  },
  pets: {
    index: "/pets",
    detail: (id) => `/pets/${id}`,
  },
  appointments: {
    index: "/appointments",
    detail: (id) => `/appointments/${id}`,
  },
  medicalRecords: {
    index: "/medical-records",
    detail: (id) => `/medical-records/${id}`,
  },
  inventory: {
    products: "/inventory/products",
    movements: "/inventory/movements",
  },
  payments: {
    index: "/payments",
  },
  users: {
    index: "/users",
  },
  reports: {
    summary: "/reports/summary",
  },
};
