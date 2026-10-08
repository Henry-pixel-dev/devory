"use client"

import React, { useState } from "react"
import Button from "@/components/SubmitButton";
import Input from "@/components/Input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";




export default function SignInForm() {
    const router = useRouter();

  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  type FormErrors = {
        email?: string;
        password?: string;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmission = async (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newErrors: FormErrors = {}

        if (!formData.email) {
            newErrors.email = 'Email is required'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        setApiError('')
        setLoading(true)
        
        try {
            const supabase = createClient();
            const {data, error} = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            })


            if (error) {
                setApiError(error.message)
                return
            }

            router.replace(`/dashboard`)
            router.refresh()
        } catch (error) {
            setApiError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }


  return (
    <form 
    onSubmit={handleSubmission}
    className="flex flex-col gap-5"
    noValidate
    >
        {/* email */}
        <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="@example.com"
            value={formData.email}
            onChange={handleChange}
            errors={errors.email}
            />

        {/* password  */}
        <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            errors={errors.password}
        />

         {apiError && (
            <div className="rounded-lg border border-light-error/20 bg-light-error/5 px-4 py-3 text-sm text-light-error ">
            {apiError}
            </div>
        )}           
                    
        {/* button submit */}
        <Button >
            {loading ? 'Signing In...' : 'Sign In'}
        </Button>
                    
    </form>
  )
}
