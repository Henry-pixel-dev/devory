
import { IconType } from 'react-icons'
import Link from "next/link";

type footerProps = {
  href: string;
  icon: IconType;
  children: React.ReactNode;
};

export default function FooterBtn({href, icon, children}: footerProps) {
    const Icon = icon;

  return (
    <Link href={href}  className="flex flex-col items-center space-y-3 text-bg active:text-primary">
        {/* icons */}
        <Icon/>
        <p className="text-xs font-bold">
            {children}
        </p>
    </Link>
  )
}
