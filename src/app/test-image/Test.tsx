'use client';

import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';

export default function TestImagePage() {
  const handleUploadComplete = (url: string) => {
    console.log('📸 Ảnh đã upload thành công:', url);
    // Bạn có thể lưu url vào state hoặc form
  };
  const handleUploadMultipleComplete = (urls: string[]) => {
    console.log('📸 Nhàp hình thức:', urls);
    // Bạn có thể lưu url vào state hoặc form
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Test Upload Image</h1>
      <InputUploadSingleFile onUploadSuccess={handleUploadComplete} />
      <InputUploadMultipleFiles onUploadSuccess={handleUploadMultipleComplete} />
    </div>
  );
}
