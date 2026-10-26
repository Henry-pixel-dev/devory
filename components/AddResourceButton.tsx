"use client"

import { useRef } from "react";
import Input from "./Input";
import { useState } from "react";
import Button from "./SubmitButton";

export default function AddResourceButton({ children }: { children: React.ReactNode }) {
    const [formData, setFormData] = useState({
        url: "",
        name: "",
        description: "",
        type: "",
        image: "",
    });
    const [errors, setErrors] = useState({})
    const [previewStatus, setPreviewStatus] = useState<"idle" | "loading" | "done">("idle")

    const dialogRef = useRef<HTMLDialogElement>(null)   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}>
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
                    Add Resources
                </h1>
                <p className="text-primary">
                    Add new resources to your collection.
                </p>
            </div>

            <form noValidate className="flex flex-col gap-5">
                <Input
                    id="url"
                    name="ur l"
                    label="URL"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={handleChange}
                    />
                <Input
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Enter resource name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={previewStatus !== "done"}
                    />
                <Input
                    id="description"
                    name="description"
                    label="Description"
                    type="text"
                    placeholder="Enter resource description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={previewStatus !== "done"}
                    />
                <Input
                    id="type"
                    name="type"
                    label="Type"
                    type="text"
                    placeholder="Enter resource type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={previewStatus !== "done"}
                    />
                <Input
                    id="image"
                    name="image"
                    label="Image URL"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                    disabled={previewStatus !== "done"}
                    />

                    <Button disabled={previewStatus !== "done"}>
                        Create Resource
                    </Button>
            </form>
        </div>
      </dialog>
    </>
  )
}
