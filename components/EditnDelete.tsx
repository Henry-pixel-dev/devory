"use client"

export default function EditnDelete() {
  return (
    <div className="flex flex-row justify-end space-x-4 p-4">
        <button className="bg-primary/10 text-primary rounded-lg py-2 px-3 max-w-20 cursor-pointer hover:bg-primary/30 hover:text-white  ">
            Edit
        </button>
        <button className="bg-primary/10 text-primary rounded-lg p-2 max-w-20 cursor-pointer hover:bg-red-500 hover:text-white  ">
            Delete
        </button>
    </div>
  )
}
