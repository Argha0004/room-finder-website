import Image from "next/image";
import { ICONS } from "@/lib/icons";

export default function IconButton({
  icon,
  alt,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded transition hover:bg-neutral-800 ${className}`}
    >
      <Image
        src={ICONS[icon]}
        alt={alt}
        width={26}
        height={26}
      />
    </button>
  );
}
