import Button from "./Button";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-slate-500">
        Pagina {page} de {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
