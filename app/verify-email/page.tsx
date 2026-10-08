import Image from "next/image";
import Link from "next/link";
import { FaRegEnvelope } from 'react-icons/fa';
import Dlogo from "../../public/Dlogo.png";


export default async function VerifyEmail({ searchParams, }: {  searchParams: Promise<{ email?: string }>;}) {
  const { email } = await searchParams
    
  return (
    <section className="relative isolate flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden bg-background px-6 py-16 ">
      {/* Paper grain texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -hrefp-40 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 rounded-full bg-light-accent/4 blur-[100px] dark:bg-dark-accent/6"
      />

      <div
        className="w-full max-w-104"
      >
        {/* Card */}
        <div className="rounded-2xl border border-primary/40 bg-background p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10 dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
          {/* Logo */}
          <div
           
            className="mb-8 flex flex-col items-center gap-5"
          >
            <Link href="/" className="flex items-end space-x-2">
                <Image
                    src={Dlogo}
                    alt="Logo"
                    width={50}
                    height={50}
                    placeholder="blur"
                    quality={70}
                />
                <p className="text-2xl font-bold text-primary font-display">
                    Devory
                </p>
            </Link>
          </div>

          {/* Icon + heading + subtext */}
          <div
            className="flex flex-col items-center text-center"
          >
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-accent/10 ">
              <FaRegEnvelope
                size={28}
                strokeWidth={1.5}
                className="text-light-accent dark:text-dark-accent"
              />
            </div>

            <h1 className="font-serif text-2xl tracking-[-0.02em] text-primary ">
              Check your email
            </h1>

            <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-tertiary">
              We sent a confirmation link href{' '}
              <span className="font-medium text-light-accent dark:text-dark-accent">
                {email ?? "your email"}
              </span>
            </p>
          </div>

          {/* Instructions */}
          <div
           
            className="mt-6 flex flex-col items-center gap-3 text-center"
          >
            <p className="max-w-xs font-sans text-sm leading-relaxed text-tertiary-foreground ">
              We sent a confirmation link href your email address. Click the link
              in the email href activate your account.
            </p>
            <p className="font-sans text-xs text-tertiary ">
              Can't find it? Check your spam folder.
            </p>
          </div>

          {/* Divider */}
          <div
  
            className="my-6 flex items-center gap-4"
          >
            <div className="h-px flex-1 bg-light-border dark:bg-dark-border" />
            <span className="font-sans text-xs text-tertiary ">
              or
            </span>
            <div className="h-px flex-1 bg-light-border " />
          </div>

          {/* Sign in link */}
          <p

            className="text-center font-sans text-sm text-tertiary"
          >
            Already confirmed?{' '}
            <Link
              href="/signin"
              className="font-medium text-tertiary-foreground underline decoration-accent/30 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent/50 "
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
