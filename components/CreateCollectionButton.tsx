"use client"

import { useRef } from "react";
import Input from "./Input";
import { useState, useEffect } from "react";
import Button from "./SubmitButton";
import { createClient } from "@/lib/supabase/client"
import { fetchData } from "@/lib/getUser"

type ResourceOption = {
  name: string
  id: string
}

type Props = {
  children: React.ReactNode
  userId: string
  resourceOptions: ResourceOption[]   // ← receive the data as prop
}


export default  function CreateCollectionButton({children, userId, resourceOptions}: Props) {
    
    

    
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        collectionIds: [] as string[],
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, (opt) => opt.value)
        setFormData((prev) => ({ ...prev, collectionIds: selected }))
    }
        

  return (
    <>
        <button onClick={() => dialogRef.current?.showModal()}>
            {children}
        </button>

        <dialog 
        ref={dialogRef} 
        onClick={(e) => {
            if (e.target === e.currentTarget) dialogRef.current?.close()
        }}
      className="fixed inset-0 open:flex items-center justify-center bg-primary/50 w-full h-full max-w-none max-h-none">
        {/* card */}
        <div className="flex flex-col gap-4 p-6 bg-background w-full h-full rounded-none overflow-y-auto
            md:w-96 md:h-auto md:max-h-[90vh] md:rounded-lg md:border md:border-primary">
            <button className="md:hidden self-end cursor-pointer" onClick={() => dialogRef.current?.close()}>
                <span className="text-2xl font-bold text-primary">✕</span>
            </button>
            <div>
                <h1 className="text-2xl font-bold text-primary">
                    Create a new Collection
                </h1>
                <p className="text-primary">
                    Create a new collection to organize your resources. 
                </p>
            </div>

            <form  noValidate className="flex flex-col gap-5">
                
                <Input
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Enter resource name"
                    value={formData.name}
                    onChange={handleChange}
                    />
                
                
                    {/* list of resources names and id  */}
                    <select className="bg-tertiary/30 p-4"
                        name="resources"
                        multiple
                        value={formData.collectionIds}
                        onChange={handleSelectChange}
                    >
                        {/* {resourceOptions.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))} */}
                    </select>

                    <Button >
                        {loading ? "Creating..." : "Create Resource"}
                    </Button>
            </form>
        </div>
      </dialog>
    </>
  )
}
