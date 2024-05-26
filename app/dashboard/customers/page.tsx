export default function Page() {
  return (
    <>
      <p className='f-2-4xl-md'>Customers Page</p>
      <button className='btn-active'>Active Button</button>
      <button className='btn-inactive'>Inactive Button</button>
      <div className='custom-card m-10'>Ala-Bala</div>
      <button className='btn-bg-blue'>Button</button>
      <button className='btn-bg-green'>Button</button>
      <p>-------------------------------------------------------</p>
      <div className='has-[:is(input:checked,div:hover)]:signal'>
        <input type='checkbox' /> 👈🏼 check/uncheck here
        <div className='bg-red-800 p-1 text-white signal:bg-green-800'>
          or hover here
        </div>
      </div>
      <p>------------------------------------------------------</p>
      <input type='checkbox' className='peer' /> 👈🏼 check/uncheck here
      <div className='peer-checked:signal hover:signal'>
        <div className='signal:bg-green-800 bg-red-800 p-1 text-white'>
          or hover here
        </div>
      </div>
      <p>-------------------------------------------------------</p>
      <input type='checkbox' className='peer/checkable' /> 👈🏼 check/uncheck here
      <div className='peer/hoverable bg-slate-700 text-white'>
        ✨ hover/unhover here ✨
      </div>
      <div className='active:signal/custom peer-checked/checkable:signal peer-hover/hoverable:signal'>
        <div className="bg-red-800 text-white after:content-['_Ala_._._._Bala_👀_👀_👀'] signal/custom:!bg-purple-800 signal:bg-green-800 signal/custom:after:!content-['_🦄'] signal:after:content-['_😱']">
          press me
        </div>
      </div>
    </>
  )
}
