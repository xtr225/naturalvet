import { FiAlertTriangle } from "react-icons/fi";
import Button from "../ui/Button";

export default function ErrorState({
  title = "Algo salio mal",
  description = "No pudimos completar la accion.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
      <FiAlertTriangle className="text-red-600" size={24} />
      <h3 className="mt-3 text-sm font-semibold text-red-950">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-red-700">{description}</p>
      {onRetry && (
        <Button variant="danger" className="mt-4" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
