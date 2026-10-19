import { NextResponse } from "next/server"
import { seedUserData } from "@/lib/seedUserData"

export async function POST(request: Request) {
  const body = await request.json()
  const { userId } = body

  try {
    await seedUserData(userId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}