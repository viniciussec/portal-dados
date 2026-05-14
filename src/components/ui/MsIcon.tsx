type MsIconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function MsIcon({ name, size = 24, className = "" }: MsIconProps) {
  return (
    <span
      className={`material-symbols-outlined${className ? ` ${className}` : ""}`}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}
