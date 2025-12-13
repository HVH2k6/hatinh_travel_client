import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='text-2xl text-center font-bold text-blue-600'>Trang không tồn tại</h2>
      <p>Trang bạn tìm không tồn tại hoặc đã bị xóa</p>
      <Link href="/" className='text-blue-600'>Return Home</Link>
    </div>
  )
}