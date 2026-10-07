"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/SubmitButton";
import Input from "@/components/Input";
import { createClient } from "@/lib/supabase/client";



export default function SignupForm() {
    const router = useRouter();

    type FormErrors = {
        email?: string;
        password?: string;
        confirmPassword?: string;
    }

    const [errors, setErrors] = useState<FormErrors>({})
    const [apiError, setApiError] = useState('')
    const [loading, setLoading] = useState(false) 
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })

    
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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
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
            const {error} = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/signin`,
                },
            })
            
            if (error) {
                setApiError(error.message)
                return
            }

            router.replace("/verify-email");
        } catch (error) {
            setApiError("Something went wrong. Please try again.")
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

        {/* confirm password  */}
        <Input
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            errors={errors.confirmPassword}
        />

        {apiError && (
        <div className="rounded-lg border border-light-error/20 bg-light-error/5 px-4 py-3 text-sm text-light-error ">
          {apiError}
        </div>
        )}
        {/* button submit */}
        <Button >
            {loading ? 'Creating account...' : 'Create Account'}
        </Button>
                    
    </form>
  )
}
