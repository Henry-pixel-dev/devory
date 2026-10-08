

import Link from "next/link";
import Image from "next/image";
import Dlogo from "../../public/Dlogo.png";
import SignInForm from "./SignInForm";




export default function Signin() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center md:flex-row md:justify-between md:items-start md:gap-10">
        {/* the form */}
            <section className="flex-1 relative isolate flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden bg-background md:pr-16 py-6 ">
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
                className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 rounded-full bg-light-accent/[0.04] blur-[100px] "
              />

              <div
                className="w-full max-w-104"
              >
                {/* Card */}
                <div className="rounded-2xl border border-primary bg-background p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10 ">
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

                    <div className="text-center">
                      <h1 className="font-serif text-2xl tracking-[-0.02em] text-primary ">
                        Welcome back
                      </h1>
                      <p className="mt-1.5 font-sans text-sm text-accent ">
                        Login to access your devory
                      </p>
                    </div>
                  </div>


                  {/* Form */}
                  <SignInForm/>

                  {/* Divider */}
                  <div
                    className="my-6 flex items-center gap-4"
                  >
                    <div className="h-px flex-1 bg-primary/50 " />
                    <span className="font-sans text-xs  ">
                      or
                    </span>
                    <div className="h-px flex-1 bg-primary/50 " />
                  </div>

                  {/* Sign in link */}
                  <p
                    className="text-center font-sans text-sm  text-accent"
                  >
                    Don't have an account?{' '}

                    <Link
                      href="/signup"
                      className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary/50 hover:decoration-primary/30"
                    >
                      Create one
                    </Link>
                    
                  </p>
                </div>

                {/* Footer note */}
                <p
                  
                  className="mt-6 text-center font-sans text-xs leading-relaxed text-tertiary "
                >
                  By creating an account you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </section>

        {/* video section */}
        <div className="flex-1 hidden md:flex rounded-lg overflow-hidden  h-screen">
          <video
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
    </main>
  )
}
