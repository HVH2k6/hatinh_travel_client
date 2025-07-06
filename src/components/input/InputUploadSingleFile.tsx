'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import axios from 'axios';
import { Label } from '../ui/label';

interface UploadImageProps {
  onUploadSuccess: (url: string) => void;
  initialImageUrl?: string;
}

const InputUploadSingleFile: React.FC<UploadImageProps> = ({
  onUploadSuccess,
  initialImageUrl,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
  const [loading, setLoading] = useState(false);
  const [urlImage, setUrlImage] = useState<string>(initialImageUrl || '');

  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
      setUrlImage(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cloud/cloudinary`,
        formData
      );
      const url = res.data.url;
      setImageUrl(url);
      setUrlImage(url);
      onUploadSuccess(url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cloud/cloudinary/delete`,
        {
          data: { url: urlImage },
        }
      );
      setImageUrl(undefined);
      setUrlImage('');
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 w-60">
      {/* Always keep input */}
      <Input
        type="file"
        id="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {/* Nếu chưa có ảnh */}
      {!imageUrl && !loading && (
        <Label htmlFor="file" className='cursor-pointer w-max h-10 rounded-lg flex items-center justify-center bg-slate-600 text-white font-medium px-3'>
          Upload
        </Label>
      )}

      {/* Nếu đã có ảnh */}
      {imageUrl && !loading && (
        <div className="relative w-full h-60 border rounded overflow-hidden group">
          <label htmlFor="file">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              fill
              className="object-cover cursor-pointer"
            />
          </label>

          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 z-10 cursor-pointer"
            onClick={handleRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang xử lý...
        </div>
      )}
    </div>
  );
};

export default InputUploadSingleFile;
