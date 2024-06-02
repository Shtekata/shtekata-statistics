'use server'
import { z } from 'zod'
import { sql } from './sql-postgres-client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
  time: z.string()
})

function Validate(formData: FormData) {
  const ZodInvoice = FormSchema.omit({ id: true, date: true, time: true })
  const { customerId, amount, status } = ZodInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })
  const amountInCents = Math.round(amount * 100)
  return { customerId, amountInCents, status }
}

function Revalidate() {
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function createInvoice(formData: FormData) {
  const { customerId, amountInCents, status } = Validate(formData)

  const dateAndTime = new Date().toISOString().split('T')
  const date = dateAndTime[0]
  const time = dateAndTime[1].split('.')[0]

  try {
    await sql`
    insert into invoices (customer_id,amount,status,date,time)
    values (${customerId},${amountInCents},${status},${date},${time})`
  } catch (error) {
    return { message: 'Database Error: Failed to Create Invoice.' }
  }

  Revalidate()
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amountInCents, status } = Validate(formData)

  try {
    await sql`update invoices
    set customer_id=${customerId},amount=${amountInCents},status=${status}
    where id=${id}`
  } catch (error) {
    return { message: 'Database error: Failed to Update Invoice.' }
  }

  Revalidate()
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice')
  try {
    await sql`delete from invoices where id=${id}`
    revalidatePath('/dashboard/invoices')
    return { message: 'Deleted Invoice' }
  } catch (error) {
    return { message: 'Database error: Failed to Delete Invoice.' }
  }
}
