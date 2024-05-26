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

const CreateInvoice = FormSchema.omit({ id: true, date: true, time: true })

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })
  const amountInCents = Math.round(amount * 100)
  const dateAndTime = new Date().toISOString().split('T')
  const date = dateAndTime[0]
  const time = dateAndTime[1].split('.')[0]

  await sql`
    insert into invoices (customer_id,amount,status,date,time)
    values (${customerId},${amountInCents},${status},${date},${time})`

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
