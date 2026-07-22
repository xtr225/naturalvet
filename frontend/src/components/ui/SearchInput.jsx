import { FiSearch, FiX } from "react-icons/fi";
import Input from "./Input";
import IconButton from "./IconButton";

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Buscar",
  ...props
}) {
  const hasValue = Boolean(value);

  return (
    <div className="relative w-full">
      <FiSearch
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={17}
      />

      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-9 pr-11"
        {...props}
      />

      {hasValue && (
        <IconButton
          icon={FiX}
          label="Limpiar busqueda"
          variant="ghost"
          className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2"
          onClick={onClear}
        />
      )}
    </div>
  );
}
