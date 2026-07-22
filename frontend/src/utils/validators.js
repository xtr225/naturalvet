import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresa tu correo")
    .email("Ingresa un correo valido"),
  password: z
    .string()
    .min(1, "Ingresa tu contrasena")
    .min(6, "La contrasena debe tener al menos 6 caracteres"),
  remember: z.boolean().default(false),
});

export const clientSchema = z.object({
  firstName: z.string().min(2, "Ingresa al menos 2 caracteres"),
  lastName: z.string().min(2, "Ingresa al menos 2 caracteres"),
  document: z
    .string()
    .min(8, "El documento debe tener al menos 8 digitos")
    .max(12, "El documento no debe superar 12 digitos"),
  phone: z
    .string()
    .min(9, "Ingresa un telefono valido")
    .max(15, "El telefono es demasiado largo"),
  email: z
    .string()
    .min(1, "Ingresa el correo")
    .email("Ingresa un correo valido"),
  address: z.string().min(4, "Ingresa una direccion"),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
});

export const petSchema = z.object({
  name: z.string().min(2, "Ingresa el nombre"),
  species: z.string().min(2, "Selecciona la especie"),
  breed: z.string().min(2, "Ingresa la raza"),
  sex: z.enum(["female", "male"]),
  birthDate: z.string().min(1, "Ingresa la fecha de nacimiento"),
  weight: z.coerce.number().positive("Ingresa un peso valido"),
  color: z.string().min(2, "Ingresa el color"),
  status: z.enum(["active", "inactive"]),
  clientId: z.coerce.number().positive("Selecciona un cliente"),
  notes: z.string().optional(),
});

export const appointmentSchema = z.object({
  clientId: z.coerce.number().positive("Selecciona un cliente"),
  petId: z.coerce.number().positive("Selecciona una mascota"),
  service: z.string().min(3, "Ingresa el servicio"),
  date: z.string().min(1, "Selecciona la fecha"),
  time: z.string().min(1, "Selecciona la hora"),
  status: z.enum(["scheduled", "confirmed", "pending", "completed", "cancelled"]),
  veterinarian: z.string().min(3, "Ingresa el responsable"),
  notes: z.string().optional(),
});

export const medicalRecordSchema = z.object({
  petId: z.coerce.number().positive("Selecciona una mascota"),
  date: z.string().min(1, "Selecciona la fecha"),
  reason: z.string().min(3, "Ingresa el motivo"),
  diagnosis: z.string().min(3, "Ingresa el diagnostico"),
  treatment: z.string().min(3, "Ingresa el tratamiento"),
  vaccines: z.string().optional(),
  attachments: z.string().optional(),
  observations: z.string().optional(),
  veterinarian: z.string().min(3, "Ingresa el responsable"),
});

export const inventoryProductSchema = z.object({
  name: z.string().min(3, "Ingresa el producto"),
  category: z.string().min(2, "Ingresa la categoria"),
  sku: z.string().min(3, "Ingresa el SKU"),
  stock: z.coerce.number().min(0, "El stock no puede ser negativo"),
  minStock: z.coerce.number().min(0, "El stock minimo no puede ser negativo"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  status: z.enum(["active", "inactive"]),
});

export const inventoryMovementSchema = z.object({
  productId: z.coerce.number().positive("Selecciona un producto"),
  type: z.enum(["in", "out"]),
  quantity: z.coerce.number().positive("Ingresa una cantidad valida"),
  reason: z.string().min(3, "Ingresa el motivo"),
});

export const paymentSchema = z.object({
  clientId: z.coerce.number().positive("Selecciona un cliente"),
  concept: z.string().min(3, "Ingresa el concepto"),
  amount: z.coerce.number().positive("Ingresa un monto valido"),
  method: z.enum(["cash", "card", "transfer"]),
  status: z.enum(["paid", "pending", "cancelled"]),
});

export const userSchema = z.object({
  name: z.string().min(3, "Ingresa el nombre"),
  email: z.string().email("Ingresa un correo valido"),
  role: z.enum(["admin", "reception"]),
});
