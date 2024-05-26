import Form from '@/app/ui/invoices/create-form'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers } from '@/app/lib/data'

export default async function Page() {
  const customers = await fetchCustomers()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true
          }
        ]}
      />
      <input type='checkbox' className='peer' /> 👈🏼 check / uncheck here
      <div className='hover:signal peer-checked:signal'>
        <div className='signal:bg-green-800 bg-red-800 p-1 text-white'>
          or hover here
        </div>
      </div>
      <button className='btn-active'>Active Button</button>
      <button className='btn-inactive'>Inactive Button</button>
      <Form customers={customers} />
    </main>
  )
}
