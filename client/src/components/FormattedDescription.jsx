import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Coffee, Wifi, Waves } from "lucide-react";

const AMENITY_ICON = {
  wifi: Wifi,
  breakfast: Coffee,
  coffee: Coffee,
  pool: Waves,
};

function renderTextWithAmenityIcons(node, keyPrefix = "t") {
  if (typeof node === "string") {
    const parts = node.split(/(:[a-zA-Z]+:)/g);
    return parts.map((part, idx) => {
      const m = part.match(/^:([a-zA-Z]+):$/);
      if (m) {
        const name = m[1].toLowerCase();
        const Icon = AMENITY_ICON[name];
        if (Icon) {
          return (
            <span
              key={`${keyPrefix}-icon-${idx}-${name}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 align-middle mx-0.5"
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium capitalize">{name}</span>
            </span>
          );
        }
      }
      return <span key={`${keyPrefix}-txt-${idx}`}>{part}</span>;
    });
  }

  if (Array.isArray(node)) {
    return node.map((child, idx) => renderTextWithAmenityIcons(child, `${keyPrefix}-${idx}`));
  }

  return node;
}

function wrapChildren(children, keyPrefix) {
  if (Array.isArray(children)) {
    return children.map((c, i) => wrapChildren(c, `${keyPrefix}-${i}`));
  }
  return renderTextWithAmenityIcons(children, keyPrefix);
}

export default function FormattedDescription({ text }) {
  if (!text) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="text-slate-600 leading-relaxed text-base">{wrapChildren(children, "p")}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 space-y-1 text-slate-600">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1 text-slate-600">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{wrapChildren(children, "li")}</li>,
        strong: ({ children }) => <strong className="font-semibold text-slate-900">{wrapChildren(children, "st")}</strong>,
        em: ({ children }) => <em className="italic">{wrapChildren(children, "em")}</em>,
        a: ({ href, children }) => (
          <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
            {wrapChildren(children, "a")}
          </a>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

