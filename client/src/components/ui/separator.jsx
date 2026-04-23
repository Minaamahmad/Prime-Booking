function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Separator({ className = "", orientation = "horizontal", ...props }) {
  const isVertical = orientation === "vertical";
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cx(
        "shrink-0 bg-neutral-200",
        isVertical ? "h-full w-px" : "h-px w-full",
        className
      )}
      {...props}
    />
  );
}

