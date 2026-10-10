"use client"

import React, { useState } from "react"
import Button from "@/components/SubmitButton";
import Input from "@/components/Input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Dlogo from "../../public/Dlogo.png";
import { FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';


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
                return;
            }

            setSuccess(true)
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Something went wrong.')
        } finally {
            setLoading(false)
        }
     }

  return success ? (
    <>
        <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-light-success/10 dark:bg-dark-success/10">
                <FaRegCheckCircle size={24} className="text-light-success dark:text-dark-success" />
            </div>

            <div>
                <h1 className="font-serif text-2xl tracking-[-0.02em] text-primary ">
                    Password updated
                </h1>
                <p className="mt-2 font-sans text-sm leading-relaxed text-secondary ">
                    Your password has been updated successfully
                </p>
            </div>

            <Link
                href="/signin"
                className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary px-8 py-3.5 font-sans text-base font-medium text-white transition-all duration-200 hover:bg-primary/85 hover:scale-[1.01] active:scale-[0.99] "
            >
                Sign in to your account
            </Link>
        </div>
    </>
  ) : (
        <>
            <div className="mb-8 flex flex-col items-center gap-5">
                       <Link href="/" className="flex items-end space-x-2">
                          <Image
                              src={Dlogo}
                              alt="Logo"
                              width={50}
                              height={50}
                              placeholder="blur"
                              quality={70}
                          />
                          <p className="text-2xl font-bold text-primary font-display">
                              Devory
                          </p>
                      </Link>
                      <div className="text-center">
                        <h1 className="text-2xl tracking-[-0.02em] text-primary ">
                          Set new password
                        </h1>
                        <p className="mt-1.5 font-sans text-sm text-secondary ">
                          Enter your new password below
                        </p>
                      </div>
                    </div>
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
        </>
  ) 
}
