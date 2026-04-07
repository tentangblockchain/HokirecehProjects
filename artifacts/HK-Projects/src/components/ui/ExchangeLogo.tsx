interface ExchangeLogoProps {
  exchange: "lighter" | "extended" | "ethereal" | "grvt";
  size?: number;
  className?: string;
}

export function ExchangeLogo({ exchange, size = 16, className = "" }: ExchangeLogoProps) {
  if (exchange === "grvt") {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-sm shrink-0 font-bold text-white ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.6,
          background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        }}
        aria-label="GRVT DEX"
      >
        G
      </span>
    );
  }

  const src =
    exchange === "lighter"
      ? "/images/lighter-icon.png"
      : exchange === "extended"
        ? "/images/extended-icon.png"
        : "/images/ethereal-icon.png";

  const alt =
    exchange === "lighter"
      ? "Lighter DEX"
      : exchange === "extended"
        ? "Extended DEX"
        : "Ethereal DEX";

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-sm object-contain shrink-0 ${className}`}
      style={{ imageRendering: "auto" }}
    />
  );
}
