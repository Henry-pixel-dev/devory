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
  const [formData, setFormData] = useState({
      password: '',
      confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

     const handleSubmission = async (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const newErrors: FormErrors = {}
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
