import Link from "next/link";




export default function Signup() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center md:flex-row md:justify-between md:items-start md:gap-10">
        {/* the form */}
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
                className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 rounded-full bg-light-accent/[0.04] blur-[100px] "
              />

              <div
                className="w-full max-w-104"
              >
                {/* Card */}
                <div className="rounded-2xl border border-light-border bg-light-surface p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10 ">


                  {/* Form */}
                  <form className="flex flex-col gap-5"
                  >
                    
                  </form>

                  {/* Divider */}
                  <p
                    className="my-6 flex items-center gap-4"
                  >
                    <div className="h-px flex-1 bg-light-border " />
                    <span className="font-sans text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      or
                    </span>
                    <div className="h-px flex-1 bg-light-border " />
                  </p>

                  {/* Sign in link */}
                  <p
                    className="text-center font-sans text-sm text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    Already have an account?{' '}
                    
                  </p>
                </div>

                {/* Footer note */}
                <p
                  
                  className="mt-6 text-center font-sans text-xs leading-relaxed text-light-text-tertiary dark:text-dark-text-tertiary"
                >
                  By creating an account you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </section>

        {/* video section */}
        <div className="flex-1 hidden md:flex rounded-lg overflow-hidden  h-full ">
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
