"use client"
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "./SubmitButton";
import Input from "./Input";
import { useRef } from "react";
import { useRouter } from "next/navigation";




export default  function EditnDelete({userId, resourceId, name, description, type}: {userId?: string, resourceId?: number, name: string, description: string, type: string}) {
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: name,
        description: description,
        type: type,
    });
    const dialogRef = useRef<HTMLDialogElement>(null)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase =  createClient()
            const { error } = await supabase
             .from("resources").update({
                resource_name: formData.name,
                resource_description: formData.description,
                resource_type: formData.type,
             })
            .eq("id", resourceId)
            .eq("user_id", userId)

            if (error) {
                console.error("Error updating resource:", error)
                return
            }

            dialogRef.current?.close()
            router.refresh()
        } catch (error) {
            console.error("Unexpected error:", error)
        } finally {
            setLoading(false)
        }
    }




    const handleDelete = async () => {
        if (!window.confirm("Delete this resource? This can't be undone.")) return

        setDeleting(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from("resources")
                .delete()
                .eq("id", resourceId)
                .eq("user_id", userId)

            if (error) throw error

            router.back()
            router.refresh()
        } catch (error) {
            console.error("Error deleting resource:", error)
            window.alert("Couldn't delete the resource. Please try again.")
        } finally {
            setDeleting(false)
        }
    }



  return (
    <div className="flex flex-row justify-end space-x-4 p-4">
        <button 
        onClick={() => dialogRef.current?.showModal()}
         className="bg-primary/10 text-primary rounded-lg py-2 px-3 max-w-20 cursor-pointer hover:bg-primary/30 hover:text-white  ">
            Edit
        </button>
        <button onClick={handleDelete} disabled={deleting} className="bg-primary/10 text-primary rounded-lg p-2 max-w-20 cursor-pointer hover:bg-red-500 hover:text-white  ">
            {deleting ? "Deleting..." : "Delete"}
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
                    Edit Resources
                </h1>
                <p className="text-primary">
                    Edit existing resources.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <Input
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Enter resource name"
                    value={formData.name}
                    onChange={handleChange}
                    />
                <Input
                    id="description"
                    name="description"
                    label="Description"
                    type="text"
                    placeholder="Enter resource description"
                    value={formData.description}
                    onChange={handleChange}
                    />
                <Input
                    id="type"
                    name="type"
                    label="Type"
                    type="text"
                    placeholder="Enter resource type"
                    value={formData.type}
                    onChange={handleChange}
                    />
                        {/* not needed for display purposes */}

                    <Button>
                        {loading ? "Editing..." : "Edit Resource"}
                    </Button>
            </form>
        </div>
      </dialog>
    </div>
  )
}
