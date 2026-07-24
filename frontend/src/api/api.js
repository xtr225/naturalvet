import { apiClient } from "./axios";
import { endpoints } from "./endpoints";

const AUTH_STORAGE_KEY = "vet-system-auth";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

function authConfig() {
  const session = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) ?? "null");

  return session?.token
    ? { headers: { Authorization: `Bearer ${session.token}` } }
    : {};
}

function unwrap(response) {
  return response.data.data ?? response.data;
}

function fullName(value) {
  return value?.full_name ?? `${value?.first_name ?? ""} ${value?.last_name ?? ""}`.trim();
}

function mapClient(client) {
  return {
    id: client.id,
    firstName: client.first_name,
    lastName: client.last_name,
    fullName: fullName(client),
    document: client.document,
    phone: client.phone,
    email: client.email,
    address: client.address,
    status: client.status,
    notes: client.notes ?? "",
    pets: client.pets_count ?? client.pets?.length ?? 0,
    lastVisit: client.last_visit ?? null,
    createdAt: client.created_at,
  };
}

function clientPayload(payload) {
  return {
    first_name: payload.firstName,
    last_name: payload.lastName,
    document: payload.document,
    phone: payload.phone,
    email: payload.email,
    address: payload.address,
    status: payload.status,
    notes: payload.notes,
  };
}

function mapPet(pet) {
  return {
    id: pet.id,
    clientId: pet.client_id,
    client: pet.client ? mapClient(pet.client) : null,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    birthDate: pet.birth_date,
    weight: Number(pet.weight),
    color: pet.color,
    status: pet.status,
    notes: pet.notes ?? "",
    history: (pet.medical_records ?? []).map((record) => ({
      id: record.id,
      date: record.date,
      title: record.reason,
      description: record.diagnosis,
    })),
  };
}

function petPayload(payload) {
  return {
    client_id: payload.clientId,
    name: payload.name,
    species: payload.species,
    breed: payload.breed,
    sex: payload.sex,
    birth_date: payload.birthDate,
    weight: payload.weight,
    color: payload.color,
    status: payload.status,
    notes: payload.notes,
  };
}

function mapAppointment(appointment) {
  const statusMeta = {
    scheduled: ["Programada", "info"],
    confirmed: ["Confirmada", "success"],
    pending: ["Pendiente", "warning"],
    completed: ["Atendida", "neutral"],
    cancelled: ["Cancelada", "danger"],
  };
  const [label, variant] = statusMeta[appointment.status] ?? [appointment.status, "neutral"];

  return {
    id: appointment.id,
    clientId: appointment.client_id,
    petId: appointment.pet_id,
    client: appointment.client ? mapClient(appointment.client) : null,
    pet: appointment.pet ? mapPet(appointment.pet) : null,
    service: appointment.service,
    date: appointment.date,
    time: appointment.time?.slice(0, 5) ?? "",
    status: appointment.status,
    statusLabel: label,
    variant,
    veterinarian: appointment.veterinarian,
    notes: appointment.notes ?? "",
  };
}

function appointmentPayload(payload) {
  return {
    client_id: payload.clientId,
    pet_id: payload.petId,
    service: payload.service,
    date: payload.date,
    time: payload.time,
    status: payload.status,
    veterinarian: payload.veterinarian,
    notes: payload.notes,
  };
}

function mapMedicalRecord(record) {
  return {
    id: record.id,
    petId: record.pet_id,
    pet: record.pet ? mapPet(record.pet) : null,
    date: record.date,
    reason: record.reason,
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    vaccines: record.vaccines ?? "",
    attachments: record.attachments ?? "",
    observations: record.observations ?? "",
    veterinarian: record.veterinarian,
  };
}

function medicalRecordPayload(payload) {
  return {
    pet_id: payload.petId,
    date: payload.date,
    reason: payload.reason,
    diagnosis: payload.diagnosis,
    treatment: payload.treatment,
    vaccines: payload.vaccines,
    attachments: payload.attachments,
    observations: payload.observations,
    veterinarian: payload.veterinarian,
  };
}

function mapProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    sku: product.sku,
    stock: product.stock,
    minStock: product.min_stock,
    price: Number(product.price),
    status: product.status,
  };
}

function productPayload(payload) {
  return {
    name: payload.name,
    category: payload.category,
    sku: payload.sku,
    stock: payload.stock,
    min_stock: payload.minStock,
    price: payload.price,
    status: payload.status,
  };
}

function mapMovement(movement) {
  return {
    id: movement.id,
    productId: movement.product_id,
    product: movement.product ? mapProduct(movement.product) : null,
    type: movement.type,
    quantity: movement.quantity,
    reason: movement.reason,
    date: movement.created_at,
  };
}

function movementPayload(payload) {
  return {
    product_id: payload.productId,
    type: payload.type,
    quantity: payload.quantity,
    reason: payload.reason,
  };
}

function mapPayment(payment) {
  return {
    id: payment.id,
    clientId: payment.client_id,
    client: payment.client ? mapClient(payment.client) : null,
    concept: payment.concept,
    amount: Number(payment.amount),
    method: payment.method,
    status: payment.status,
    date: payment.created_at,
  };
}

function paymentPayload(payload) {
  return {
    client_id: payload.clientId,
    concept: payload.concept,
    amount: payload.amount,
    method: payload.method,
    status: payload.status,
  };
}

function mapUser(user) {
  if (!user?.id) {
    throw new Error("La API no devolvio los datos del usuario. Verifica que el frontend apunte a Laravel local.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles ?? [user.role],
    permissions: user.permissions ?? [],
  };
}

function mapDashboard(data) {
  return {
    stats: data.stats,
    activity: data.activity,
    serviceMix: data.serviceMix,
    inventoryAlerts: (data.inventoryAlerts ?? []).map(mapProduct),
    appointments: (data.appointments ?? []).map((appointment) => {
      const mapped = mapAppointment(appointment);
      return {
        ...mapped,
        pet: mapped.pet?.name,
        client: mapped.client?.fullName,
        status: mapped.statusLabel,
      };
    }),
  };
}

export const authApi = {
  endpoint: endpoints.auth,

  async login(credentials) {
    const response = await apiClient.post(endpoints.auth.login, {
      email: credentials.email,
      password: credentials.password,
    });

    return {
      token: response.data.token,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      user: mapUser(response.data.user),
    };
  },

  async logout() {
    await apiClient.post(endpoints.auth.logout, {}, authConfig());
    return true;
  },

  async me() {
    const response = await apiClient.get(endpoints.auth.me, authConfig());
    return mapUser(response.data.user);
  },

  async refresh() {
    const user = await this.me();
    const session = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) ?? "null");

    return {
      ...session,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      user,
    };
  },
};

export const dashboardApi = {
  endpoint: endpoints.dashboard,

  async getOverview() {
    const response = await apiClient.get(endpoints.dashboard.overview, authConfig());
    return mapDashboard(unwrap(response));
  },
};

export const clientsApi = {
  endpoint: endpoints.clients,

  async list(params = {}) {
    const response = await apiClient.get(endpoints.clients.index, {
      ...authConfig(),
      params,
    });
    return unwrap(response).map(mapClient);
  },

  async find(id) {
    const response = await apiClient.get(endpoints.clients.detail(id), authConfig());
    return mapClient(unwrap(response));
  },

  async create(payload) {
    const response = await apiClient.post(endpoints.clients.index, clientPayload(payload), authConfig());
    return mapClient(unwrap(response));
  },

  async update(id, payload) {
    const response = await apiClient.put(endpoints.clients.detail(id), clientPayload(payload), authConfig());
    return mapClient(unwrap(response));
  },

  async remove(id) {
    await apiClient.delete(endpoints.clients.detail(id), authConfig());
    return true;
  },
};

export const petsApi = {
  endpoint: endpoints.pets,

  async list(params = {}) {
    const response = await apiClient.get(endpoints.pets.index, {
      ...authConfig(),
      params,
    });
    return unwrap(response).map(mapPet);
  },

  async find(id) {
    const response = await apiClient.get(endpoints.pets.detail(id), authConfig());
    return mapPet(unwrap(response));
  },

  async create(payload) {
    const response = await apiClient.post(endpoints.pets.index, petPayload(payload), authConfig());
    return mapPet(unwrap(response));
  },

  async update(id, payload) {
    const response = await apiClient.put(endpoints.pets.detail(id), petPayload(payload), authConfig());
    return mapPet(unwrap(response));
  },

  async remove(id) {
    await apiClient.delete(endpoints.pets.detail(id), authConfig());
    return true;
  },
};

export const appointmentsApi = {
  endpoint: endpoints.appointments,

  async list(params = {}) {
    const response = await apiClient.get(endpoints.appointments.index, {
      ...authConfig(),
      params,
    });
    return unwrap(response).map(mapAppointment);
  },

  async find(id) {
    const response = await apiClient.get(endpoints.appointments.detail(id), authConfig());
    return mapAppointment(unwrap(response));
  },

  async create(payload) {
    const response = await apiClient.post(endpoints.appointments.index, appointmentPayload(payload), authConfig());
    return mapAppointment(unwrap(response));
  },

  async update(id, payload) {
    const response = await apiClient.put(endpoints.appointments.detail(id), appointmentPayload(payload), authConfig());
    return mapAppointment(unwrap(response));
  },

  async remove(id) {
    await apiClient.delete(endpoints.appointments.detail(id), authConfig());
    return true;
  },
};

export const medicalRecordsApi = {
  endpoint: endpoints.medicalRecords,

  async list(params = {}) {
    const response = await apiClient.get(endpoints.medicalRecords.index, {
      ...authConfig(),
      params,
    });
    return unwrap(response).map(mapMedicalRecord);
  },

  async find(id) {
    const response = await apiClient.get(endpoints.medicalRecords.detail(id), authConfig());
    return mapMedicalRecord(unwrap(response));
  },

  async create(payload) {
    const response = await apiClient.post(
      endpoints.medicalRecords.index,
      medicalRecordPayload(payload),
      authConfig()
    );
    return mapMedicalRecord(unwrap(response));
  },
};

export const inventoryApi = {
  endpoint: endpoints.inventory,

  async listProducts(params = {}) {
    const response = await apiClient.get(endpoints.inventory.products, {
      ...authConfig(),
      params,
    });
    return unwrap(response).map(mapProduct);
  },

  async listMovements() {
    const response = await apiClient.get(endpoints.inventory.movements, authConfig());
    return unwrap(response).map(mapMovement);
  },

  async createProduct(payload) {
    const response = await apiClient.post(
      endpoints.inventory.products,
      productPayload(payload),
      authConfig()
    );
    return mapProduct(unwrap(response));
  },

  async createMovement(payload) {
    const response = await apiClient.post(
      endpoints.inventory.movements,
      movementPayload(payload),
      authConfig()
    );
    return mapMovement(unwrap(response));
  },
};

export const paymentsApi = {
  endpoint: endpoints.payments,

  async list(params = {}) {
    const response = await apiClient.get(endpoints.payments.index, {
      ...authConfig(),
      params,
    });
    return unwrap(response).map(mapPayment);
  },

  async create(payload) {
    const response = await apiClient.post(endpoints.payments.index, paymentPayload(payload), authConfig());
    return mapPayment(unwrap(response));
  },
};

export const usersApi = {
  endpoint: endpoints.users,

  async list() {
    const response = await apiClient.get(endpoints.users.index, authConfig());
    return unwrap(response).map(mapUser);
  },

  async create(payload) {
    const response = await apiClient.post(endpoints.users.index, payload, authConfig());
    return mapUser(unwrap(response));
  },
};

export const reportsApi = {
  endpoint: endpoints.reports,

  async summary() {
    const response = await apiClient.get(endpoints.reports.summary, authConfig());
    const data = unwrap(response);

    return {
      totals: data.totals,
      appointmentStatus: data.appointmentStatus,
      topProducts: data.topProducts.map(mapProduct),
    };
  },
};
export const notificationsApi = {
    endpoint: endpoints.notifications,

    async list(status = "all") {
        const response = await apiClient.get(
            "/notifications",
            {
                ...authConfig(),
                params: { status },
            }
        );

        return unwrap(response);
    },

    async create(payload) {
        const response = await apiClient.post(
            "/notifications",
            payload,
            authConfig()
        );

        return unwrap(response);
    },

    async generateReminders() {
        const response = await apiClient.post(
            "/notifications/reminders",
            {},
            authConfig()
        );

        return unwrap(response);
    },

    async markSent(id) {
        const response = await apiClient.patch(
            `/notifications/${id}/sent`,
            {},
            authConfig()
        );

        return unwrap(response);
    },
};

export { AUTH_STORAGE_KEY };
