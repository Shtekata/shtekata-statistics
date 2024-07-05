'use server'
import { z } from 'zod'
import { sql } from './sql-postgres-client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.'
  }),
  date: z.string(),
  time: z.string()
})

function Validate(formData: FormData) {
  let error: State = {}
  const ZodInvoice = FormSchema.omit({ id: true, date: true, time: true })
  const validatedFields = ZodInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  if (!validatedFields.success) {
    error = {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.'
    }
    return { customerId: '', amountInCents: '', status: '', error }
  }

  const { customerId, amount, status } = validatedFields.data
  const amountInCents = Math.round(amount * 100)
  const dateAndTime = new Date().toISOString().split('T')
  const date = dateAndTime[0]
  const time = dateAndTime[1].split('.')[0]
  return { customerId, amountInCents, status, error, date, time }
}

export async function createInvoice(prevState: State, formData: FormData) {
  const { customerId, amountInCents, status, error, date, time } =
    Validate(formData)
  if (error.message) return error
  try {
    await sql`
    insert into invoices (customer_id,amount,status,date,time)
    values (${customerId},${amountInCents},${status},${date},${time})`
  } catch (error) {
    return { message: 'Database Error: Failed to Create Invoice.' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const { customerId, amountInCents, status, error } = Validate(formData)
  if (error.message) return error
  try {
    await sql`update invoices
    set customer_id=${customerId},amount=${amountInCents},status=${status}
    where id=${id}`
  } catch (error) {
    return { message: 'Database error: Failed to Update Invoice.' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  try {
    await sql`delete from invoices where id=${id}`
    revalidatePath('/dashboard/invoices')
    return { message: 'Deleted Invoice' }
  } catch (error) {
    return { message: 'Database error: Failed to Delete Invoice.' }
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      // if (error.cause?.err instanceof Error) return error.cause.err.message // return "custom error"
      const err = error.cause?.err as any
      switch (err.code) {
        case 'credentials':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}
