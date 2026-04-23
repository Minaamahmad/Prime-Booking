function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className = "", ...props }) {
  return (
    <div
      className={cx(
        "rounded-xl border border-neutral-200 bg-white text-neutral-950",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return <div className={cx("p-6", className)} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={cx("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className = "", ...props }) {
  return <div className={cx("p-6 pt-0", className)} {...props} />;
}

