
import {  FiChevronRight } from "react-icons/fi";




export default function CollectionCard(collectionName : string) {

    
  return (
    <div className="bg-radial-[at_50%_0%] from-blue-500/30 via-slate-900 to-slate-950 min-w-32 min-h-32 w-full flex-1   text-secondary p-3 flex flex-col space-y-6 border rounded-2xl justify-between  ">
      <div className="w-full flex items-end justify-end mb-3">
        <div className=" w-7 h-7 rounded-full border border-accent flex items-center">
          <FiChevronRight size={64} color="#ffffff" fill="none" stroke="currentColor" strokeWidth={2} />
        </div>
      </div>

      <div className="flex flex-col space-y-2 ">
        <h1 className="text-xl text-secondary">
            {collectionName}
        </h1>

      </div>
    
    </div>
  )
}
