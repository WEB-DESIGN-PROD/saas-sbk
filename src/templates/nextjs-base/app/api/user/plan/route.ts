import { NextResponse } from 'next/server'
import { verifySession, getUserPlan } from '@/lib/dal'

export async function GET() {
  const { userId } = await verifySession()
  const plan = await getUserPlan(userId)
  return NextResponse.json(plan)
}
