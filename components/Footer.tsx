import Image from "next/image";
import { FaXTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center space-y-4 p-6 md:flex-row md:justify-between md:space-y-0 md:p-12 border-t md:space-x-32 border-primary/50">
        <div className="flex flex-col items-center justify-center space-y-3 md:items-start">
            <div className="flex items-end space-x-2">
                <Image src="/Dlogo.png" alt="Logo" width={50} height={50} />
                <p className="text-3xl font-bold text-primary font-display">
                    Devory
                </p>
            </div>
            <div className="flex space-x-3 items-center">
                <Link href="https://twitter.com/DevoryApp" target="_blank" rel="noopener noreferrer">
                    <FaXTwitter className="text-2xl text-primary hover:text-primary/80 transition duration-300" />
                </Link>
                <Link href="https://www.linkedin.com/company/devoryapp/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedinIn className="text-2xl text-primary hover:text-primary/80 transition duration-300" />
                </Link>
                <Link href="https://github.com/DevoryApp" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-2xl text-primary hover:text-primary/80 transition duration-300" />
                </Link>
            </div>
        </div>

        {/* second column */}
        <div className="w-full flex flex-col space-y-6 md:flex-row md:space-y-0 md:justify-around items-start">
            <div className="w-full flex flex-col items-center justify-center space-y-3 md:items-start">
                <h3 className="text-lg font-bold text-primary">Products</h3>
                <ul className="flex flex-col items-center justify-center space-y-2 md:items-start">
                    <li>
                        <Link href="/dashboard" className="text-primary hover:text-primary/80 transition duration-300">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/resources" className="text-primary hover:text-primary/80 transition duration-300">
                            Resources
                        </Link>
                    </li>
                    <li>
                        <Link href="/collections" className="text-primary hover:text-primary/80 transition duration-300">
                            Collections
                        </Link>
                    </li>
                    <li>
                        <Link href="/favorite" className="text-primary hover:text-primary/80 transition duration-300">
                            Favorites
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="w-full flex flex-col items-center justify-center space-y-3 md:items-start">
                <h3 className="text-lg font-bold text-primary">Company</h3>
                <ul className="flex flex-col items-center justify-center space-y-2 md:items-start">
                    <li>
                        <Link href="/about" className="text-primary hover:text-primary/80 transition duration-300">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/careers" className="text-primary hover:text-primary/80 transition duration-300">
                            Careers
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="text-primary hover:text-primary/80 transition duration-300">
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="w-full flex flex-col items-center justify-center space-y-3 md:items-start">
                <h3 className="text-lg font-bold text-primary">Legal</h3>
                <ul className="flex flex-col items-center justify-center space-y-2 md:items-start">
                    <li>
                        <Link href="/privacy" className="text-primary hover:text-primary/80 transition duration-300">
                            Privacy Policy
                        </Link>
                    </li>
                    <li>
                        <Link href="/terms" className="text-primary hover:text-primary/80 transition duration-300">
                            Terms of Service
                        </Link>
                    </li>
                </ul>


                <div className="mt-8 text-sm text-primary/80">
                    &copy; {new Date().getFullYear()} Devory. Built for developers. All rights reserved.
                </div>
            </div>
        </div>
    </footer>
  )
}
