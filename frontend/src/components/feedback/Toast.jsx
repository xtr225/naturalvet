import Swal from "sweetalert2";

export function showToast({ title, icon = "success" }) {
  return Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2600,
    timerProgressBar: true,
    icon,
    title,
  });
}
