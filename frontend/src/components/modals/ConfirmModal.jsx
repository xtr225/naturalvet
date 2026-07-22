import Swal from "sweetalert2";

export function confirmAction({
  title = "Confirmar accion",
  text = "Esta accion no se puede deshacer.",
  confirmButtonText = "Confirmar",
  icon = "warning",
}) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    confirmButtonText,
    cancelButtonText: "Cancelar",
  });
}
