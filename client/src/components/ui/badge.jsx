function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const badgeVariants = {
  default: "bg-neutral-900 text-neutral-50",
  secondary: "bg-neutral-100 text-neutral-900",
  outline: "border border-neutral-200 text-neutral-900",
};

export function Badge({ className = "", variant = "default", ...props }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-4",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}

