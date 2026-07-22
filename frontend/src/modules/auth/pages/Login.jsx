import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../../components/branding/Logo";
import AuthLayout from "../../../layouts/Auth/AuthLayout";
import FormActions from "../../../components/forms/FormActions";
import FormField from "../../../components/forms/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import Checkbox from "../../../components/ui/Checkbox";
import IconButton from "../../../components/ui/IconButton";
import Input from "../../../components/ui/Input";
import LoaderButton from "../../../components/ui/LoaderButton";
import StatusBadge from "../../../components/ui/StatusBadge";
import { useAuth } from "../../../hooks/useAuth";
import { DEMO_CREDENTIALS } from "../../../utils/constants";
import { loginSchema } from "../../../utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname ?? "/dashboard";

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      remember: true,
    },
  });

  const onSubmit = async (values) => {
    setAuthError("");

    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.message ?? "No se pudo iniciar sesion";
      setAuthError(message);
      Swal.fire({
        title: "Acceso denegado",
        text: message,
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <AuthLayout>
      <Card hover={false} className="shadow-xl shadow-slate-200/70">
        <CardHeader>
          <div className="mb-6 flex justify-center">
            <Logo size="large" stacked showLocation />
          </div>

          <div className="mb-3 flex items-center justify-center gap-3">
            <StatusBadge variant="info">
              <FiShield size={13} />
              Acceso seguro
            </StatusBadge>
          </div>

          <CardTitle className="text-center">Iniciar sesión</CardTitle>
          <p className="mt-1 text-center text-sm text-slate-500">
            Ingresa con tus credenciales para continuar.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              id="email"
              label="Correo electronico"
              error={errors.email?.message}
            >
              <Input
                id="email"
                autoComplete="email"
                error={errors.email}
                {...register("email")}
              />
            </FormField>

            <FormField
              id="password"
              label="Contrasena"
              error={errors.password?.message}
            >
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="pr-12"
                  error={errors.password}
                  {...register("password")}
                />

                <IconButton
                  icon={showPassword ? FiEyeOff : FiEye}
                  label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  variant="ghost"
                  className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2"
                  onClick={() => setShowPassword((current) => !current)}
                />
              </div>
            </FormField>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <Checkbox {...register("remember")} />
              Mantener sesion iniciada
            </label>

            {authError && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                {authError}
              </div>
            )}

            <FormActions className="pt-4">
              <LoaderButton
                type="submit"
                isLoading={isLoading}
                loadingText="Validando"
                className="w-full"
              >
                Entrar al sistema
              </LoaderButton>
            </FormActions>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
