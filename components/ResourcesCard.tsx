import Image from "next/image";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";

export type resourceType = {
    image: string,
    title: string;
    type?: string;
    description: string;
    id: number;
    url?: string;
}



export default function ResourcesCard({id, image, title , type, description, url }: resourceType) {
  return (
    <div className="bg-primary/10 w-full flex-1 flex flex-row space-x-3 p-3  items-center  md:max-w-64 rounded-2xl  md:flex-col md:space-y-4">
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
            <Link href={`/dashboard/resources/${id}`} className="cursor-pointer *:hover:underline">
                <h3 className="mb-3 font-bold md:text-2xl text-primary whitespace-pre-wrap">
                    {title.slice(0, 20)}
                    <span>...</span>
                </h3>
            </Link>
            <p className="md:hidden mb-3">
                {type}
            </p>
            <p className="hidden md:block md:text-base text-primary">
              {description.slice(0, 50)}
            </p>
        </div>
        <div className="self-start flex flex-col justify-between space-y-12 md:hidden ">
            <div className="max-w-4 max-h-9 relative bg-tertiary/30 rounded-lg p-4 self-end">
                <a href={url}  target="_blank" rel="noopener noreferrer" className="cursor-pointer ">
                    <LuArrowUpRight width={50} height={50} className="absolute top-2 left-2"/>
                </a>
            </div>
        </div>
        <div className="hidden md:block md:text-base text-primary backdrop:blur-sm bg-tertiary/30 rounded-lg p-2 self-end ">
            <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-pointer ">
                <p className="text-primary text-sm underline">Visit</p>                    
            </a>
         </div>
    </div>
  )
}

