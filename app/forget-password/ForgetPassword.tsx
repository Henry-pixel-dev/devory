"use client"


import Button from "@/components/SubmitButton";
import Input from "@/components/Input";
import {  useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation";


export default function ResetPasswordCom() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [apiError, setApiError] = useState('')
    const [loading, setLoading] = useState(false)
   
    
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()


        if (!email) {
             setError('Email is required')
             return;
        } 
            
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid')
            return;
        }

        setError('')
        setLoading(true)

        try {
            const supabase = createClient()
            const { error} = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback`
            })
            
            if (error) {
                setError(error.message)
                return
            }
            

            router.replace(`/verify-email?email=${encodeURIComponent(email)}`)
            
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Something went wrong.')
        } finally{
            setLoading(false)
        }
         
    }
  
  return (
    <form 
    onSubmit={handleSubmit}
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errors={error}
        />
        {apiError && <p className="text-sm  text-light-error text-error">{apiError}</p>} 
                  
        {/* button submit */}
        <Button >
            {loading ? "Reseting..." : 'Reset Password'}
        </Button>
                  
    </form>
  )
}
