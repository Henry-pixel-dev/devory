import Link from "next/link";

type ButtonProps = {
  href: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "inverse";
  children: React.ReactNode;
};


const baseClasses =
  "font-bold text-center rounded transition duration-300  ";

const sizes = {
  sm: "px-4 py-2",
  md: "px-4 py-4 text-base",
  lg: "px-6 py-4 text-lg  flex-1 border",
};

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/80  border border-primary",
  inverse: "bg-primary-foreground text-text hover:bg-foreground/80 border border-gray-300",
};

export default function LoginBtn({ href, size = "sm", variant = "primary", children }: ButtonProps) {
  return (
    <Link href={href} className={`${baseClasses} ${sizes[size]} ${variants[variant]}`}>
      {children}
    </Link>
  );
}