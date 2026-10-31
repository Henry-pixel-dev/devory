"use client"

import { useRef } from "react";
import Input from "./Input";
import { useState, useEffect } from "react";
import Button from "./SubmitButton";
import { createClient } from "@/lib/supabase/client"
import { fetchData } from "@/lib/getUser"
import {  FaChevronDown, FaChevronRight } from 'react-icons/fa6'

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
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        collectionIds: [] as string[],
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const toggleId = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            collectionIds: prev.collectionIds.includes(id)
            ? prev.collectionIds.filter((x) => x !== id)
            : [...prev.collectionIds, id],
        }))

    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const supabase = createClient()
            const { data: collection, error } = await supabase
                .from('collections')
                .insert({
                    collection_name: formData.name,
                    user_id: userId,
                })
                .select()
                .single()

            if (error || !collection) throw error
            console.log(collection)

            if (formData.collectionIds.length > 0) {
                const { data: collectionResources, error: collectionResourcesError } = await supabase
                    .from('collection_resources')
                    .insert(
                        formData.collectionIds.map((resourceId) => ({
                            collection_id: collection.id,
                            resource_id: resourceId,
                        }))
                    )

                if (collectionResourcesError) throw collectionResourcesError
                console.log(collectionResources)

                dialogRef.current?.close()
                setOpen(false)  // Close the dropdown when the dialog is closed
                setFormData({ name: "", collectionIds: [] })  // Reset form data when the dialog is closed
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            
        }
    }
    

  return (
    <>
        <button onClick={() => dialogRef.current?.showModal()}>
            {children}
        </button>

        <dialog 
        ref={dialogRef} 
        onClick={(e) => {
            if (e.target === e.currentTarget) {
                dialogRef.current?.close()
                setOpen(false)  // Close the dropdown when the dialog is closed
                setFormData({ name: "", collectionIds: [] })  // Reset form data when the dialog is closed
            }
                
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

            <form  noValidate className="flex flex-col gap-5" onSubmit={handleSubmit}>
                
                <Input
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Enter resource name"
                    value={formData.name}
                    onChange={handleChange}
                    />
                
                
                    <div  className="relative w-full rounded-lg border border-primary/30 bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-foreground/40 hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 flex justify-between items-center">
                        <label htmlFor="resources" className="text-xs font-medium uppercase tracking-wide text-foreground/70">
                            Resources
                        </label>
                        <button
                         className="self-end cursor-pointer"
                         onClick={(e) => {
                            e.preventDefault()
                            setOpen((prev) => !prev)
                         }}>
                            {open ? <FaChevronDown className="text-primary" /> : <FaChevronRight className="text-primary" />}
                        </button>

                        {open && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-primary/30 rounded-lg shadow-lg z-10">
                                <div className="py-2  max-h-32 md:max-h-64 overflow-y-auto">
                                    {resourceOptions.map((item) => (
                                        <label htmlFor={`resource-${item.id}`} key={item.id} className="flex gap-2 px-3 py-2 border-b border-primary/30 hover:bg-primary/10 cursor-pointer items-center">
                                            <input
                                                id={`resource-${item.id}`}
                                                type="checkbox"
                                                name="resources"
                                                value={item.id}
                                                onChange={() => toggleId(item.id)}
                                                className="appearance-none w-4 h-4 rounded-full border border-primary checked:bg-primary checked:border-primary "
                                            />
                                             <span>{item.name.slice(0, 20)}{item.name.length > 20 ? "..." : ""}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                    

                    <Button >
                        {loading ? "Creating..." : "Create Resource"}
                    </Button>
            </form>
        </div>
      </dialog>
    </>
  )
}
