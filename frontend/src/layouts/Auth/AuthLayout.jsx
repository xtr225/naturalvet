import { motion } from "framer-motion";
import Logo from "../../components/branding/Logo";

export default function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen bg-[color:var(--color-background)] lg:grid-cols-[1fr_540px]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[color:var(--color-primary)] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[color:var(--color-secondary)]/20" />

        <Logo size="medium" className="relative z-10 text-white [&_p:nth-child(2)]:text-white/75 [&_p:nth-child(3)]:text-white/60" showLocation />

        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
            Natural Vet
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal">
            Gestión clínica moderna para una atención veterinaria cercana.
          </h1>
          <p className="mt-5 text-base leading-7 text-white/75">
            Administra pacientes, citas, historia clínica, inventario y pagos
            desde una experiencia clara, cálida y profesional.
          </p>
        </div>

        <p className="relative z-10 text-sm text-white/65">
          Puno - Perú · Acceso demo: admin@vetsystem.test / admin123
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
}
