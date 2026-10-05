import { FaStar } from "react-icons/fa";
import Logo from "../public/Dlogo.png";
import Image from "next/image";
import bgLogo from "../public/logo_transparent-.png";
import LoginBtn from "@/components/LoginBtn";
import FeatureCards from "@/components/FeaturesCard"; 


export default function LandingPage() {
  return (
    <main className="container mx-auto flex flex-col space-y-8 min-h-screen bg-background">
      <section className=" w-full flex justify-between item-start space-x-8 overflow-hidden  rounded-lg p-6 md:p-12">
         
        {/* first child of the hero  */}
        <div className="relative isolate flex-1 flex flex-col items-start space-y-4 mt-20  p-6">
          <Image
            src={bgLogo}
            alt=""
            fill
            className="object-contain opacity-10 -z-10 pointer-events-none"
          />
          <div className="flex flex-col space-y-2  md:flex-row items-center space-x-2">
            <div className="flex items-center space-x-2 pt-2">
              <Image src={Logo} alt="Logo" width={20} height={20}
              placeholder="blur" quality={70} />
              <div className="flex items-center space-x-1">
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
              </div>
              <p className="text-sm font-semibold ">4.8</p>
            </div>
            <p className="text-sm font-semibold "> The developer's resource hub</p>
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-primary font-display">
            Save. Organize. Build.
          </h1>
          <p className="text-lg text-gray-600">
            Keep your favorite docs, videos, articles, GitHub projects, and other learning resources organized in one simple place.
          </p>
          <div className="mt-20 w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <LoginBtn href="/signin" size="lg">Check In</LoginBtn>
            <LoginBtn href="/signup" size="lg" variant="inverse">Get Started</LoginBtn>
          </div>
        </div>
        {/* Video section */}
        <div className="flex-1 hidden md:flex rounded-lg overflow-hidden  h-140 ">
          <video
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* problem section */}
      <section className="flex flex-col items-center justify-center md:items-start space-y-4 p-6 md:p-12">
        <h2 className="text-center md:text-start max-w-4xl text-2xl md:text-4xl  text-primary font-display">
          Stop losing track of your resources. Keep your <span className="text-primary/50 font-bold"> bookmarks, docs, and developer links </span> perfectly organized.
        </h2>
        <FeatureCards />
      </section>
    </main>
  )
}
