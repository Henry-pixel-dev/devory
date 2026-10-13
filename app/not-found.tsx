import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center space-y-4">
        <h1 className="text-primary text-3xl">
            The page 
        </h1>
        <p className="text-accent text-base">
            not available 
        </p>

        <div className="flex space-x-2">
            <p>Go to</p>
            <Link href="/dashboard">
                Home
            </Link>
        </div>
    </div>
  )
}
