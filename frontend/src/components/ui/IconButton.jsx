import Button from "./Button";

export default function IconButton({
  icon: Icon,
  label,
  children,
  ...props
}) {
  return (
    <Button size="icon" aria-label={label} title={label} {...props}>
      {Icon ? <Icon size={18} /> : children}
    </Button>
  );
}
