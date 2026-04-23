function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const buttonVariants = {
  default: "bg-neutral-900 text-neutral-50 hover:bg-neutral-800",
  outline:
    "border border-neutral-200 bg-transparent text-neutral-950 hover:bg-neutral-100",
  secondary: "bg-neutral-100 text-neutral-950 hover:bg-neutral-200",
  ghost: "bg-transparent text-neutral-950 hover:bg-neutral-100",
};

export function Button({
  className = "",
  variant = "default",
  type = "button",
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 disabled:opacity-50 disabled:pointer-events-none",
        buttonVariants[variant] || buttonVariants.default,
        className
      )}
      {...props}
    />
  );
}

