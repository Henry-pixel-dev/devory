import type { Metadata } from "next";
import { Lora, Archivo_Black } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation" 


const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: "Devory",
  description: "Discover, save and organise your learning journey",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient()

  const { data: {user} } = await supabase.auth.getUser()


  return (
    <html
      lang="en"
      className={`${lora.variable} h-full antialiased ${archivo.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {!user && <Navbar />}
        {children}
      </body>
    </html>
  );
}
