import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";

export type resourceType = {
    image: string,
    title: string;
    author?: string;
    description: string;
}



export default function ResourcesCard({image,title ,author, description }: resourceType) {
  return (
    <div className="bg-primary/10 w-full flex-1 flex flex-row space-x-4 p-3  items-center  md:max-w-64 rounded-2xl  md:flex-col md:space-y-4">
        <div className="relative h-24 w-24 shrink-0 md:h-32 md:w-full ">
            <Image
                src={image}
                fill
                unoptimized
                alt={title}
                className="object-cover"
            />
         </div>
        <div>
            <h3 className="mb-3 font-bold md:text-2xl text-primary ">
                {title.slice(0, 40)}
                <span>...</span>
            </h3>
            <p className="md:hidden mb-3">
                {author}
            </p>
            <p className="hidden md:block md:text-base text-primary">
              {description.slice(0, 50)}
            </p>
        </div>
        <div className="self-start flex flex-col justify-between space-y-12 md:hidden ">
            <div className="max-w-4 max-h-9 relative bg-tertiary/30 rounded-lg p-4 self-end">
                <LuArrowUpRight width={50} height={50} className="absolute top-2 left-2"/>
            </div>
        </div>
    </div>
  )
}
