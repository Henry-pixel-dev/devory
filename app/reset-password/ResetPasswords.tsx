"use client"

import React, { useState } from "react"
import Button from "@/components/SubmitButton";
import Input from "@/components/Input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswords() {
        const router = useRouter();


    type FormErrors = {
        password?: string;
        confirmPassword?: string;
    }

  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
      password: '',
      confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

     const handleSubmission = async (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const newError: FormErrors = {}

        if(!formData.password) {
            newError.password = 'Password is required'
        } else if(formData.password.length < 6) {
            newError.password = 'Password must be at least 6 characters'
        }
            
        if(!formData.confirmPassword) {
            newError.confirmPassword = 'Please confirm your password'
        } else if(formData.confirmPassword !== formData.password) {
            newError.confirmPassword = 'Passwords do not match'
        }

        if (Object.keys(newError).length > 0) {
            setErrors(newError)
            return
        }

        setErrors({})
        setApiError('')
        setLoading(true)

        try {
            const supabase = createClient()
            const {error} = await supabase.auth.updateUser({
                password: formData.password
            })

            if (error) {
                setApiError(error.message)
            }

            setSuccess(true)
            router.replace('./signin')
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Something went wrong.')
        } finally {
            setLoading(false)
        }
     }

  return (
        <form
            onSubmit={handleSubmission}
            className="flex flex-col gap-5"
        >
                {/* Password */}

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
                

                {/* Confirm Password */}
   
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
          
                {/* Submit */}
                <Button >
                    {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
  )
}
