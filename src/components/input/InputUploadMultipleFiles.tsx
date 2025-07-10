'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Control, Controller } from 'react-hook-form';

interface UploadMultipleImagesProps {
  name: string;
  control: Control<any>; // hoặc Control<FormType>
  initialImageUrls?: string[];
}

const InputUploadMultipleFiles: React.FC<UploadMultipleImagesProps> = ({
  name,
  control,
  initialImageUrls = [],
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { value = [], onChange } = field;
        const error = fieldState.error;

        const handleUpload = async (files: FileList | null) => {
          if (!files) return;
          setLoading(true);
          try {
            const uploadPromises = Array.from(files).map(async (file) => {
              const formData = new FormData();
              formData.append('file', file);
              const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/cloud/cloudinary`,
                formData
              );
              return res.data.url as string;
            });

            const newUrls = await Promise.all(uploadPromises);
            onChange([...value, ...newUrls]); // cập nhật field
          } catch (err) {
            console.error('Upload failed:', err);
          } finally {
            setLoading(false);
          }
        };

        const handleRemove = async (url: string) => {
          setLoading(true);
          try {
            await axios.delete(
              `${process.env.NEXT_PUBLIC_API_URL}/cloud/cloudinary/delete`,
              {
                data: { url },
              }
            );
            const updated = value.filter((item: string) => item !== url);
            onChange(updated);
          } catch (err) {
            console.error('Delete failed:', err);
          } finally {
            setLoading(false);
          }
        };

        return (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              {!loading && (
                <Label
                  htmlFor='multi-image-upload'
                  className='flex items-center gap-2 cursor-pointer w-max h-10 px-3 py-2 border rounded-md bg-slate-600 hover:bg-slate-500 text-white'
                >
                  <Upload className='w-6 h-6' />
                  Tải nhiều ảnh
                </Label>
              )}
              <Input
                id='multi-image-upload'
                type='file'
                accept='image/*'
                multiple
                hidden
                onChange={(e) => handleUpload(e.target.files)}
              />
              {loading && (
                <div className='flex items-center text-sm gap-2 text-muted-foreground'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Đang xử lý...
                </div>
              )}
            </div>

            <div className='flex flex-wrap gap-4'>
              {value.length > 0 ? (
                value.map((url: string, idx: number) => (
                  <div
                    key={idx}
                    className='relative w-28 h-28 border rounded overflow-hidden group'
                  >
                    <Image
                      src={url}
                      alt={`image-${idx}`}
                      fill
                      className='object-cover'
                    />
                    <Button
                      type='button'
                      size='icon'
                      variant='destructive'
                      className='absolute top-1 right-1 opacity-90 hover:opacity-100'
                      onClick={() => handleRemove(url)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                ))
              ) : (
                <p className='text-muted-foreground text-sm'>
                  Chưa có ảnh nào.
                </p>
              )}
            </div>

            {error && (
              <p className='text-sm text-red-500'>{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default InputUploadMultipleFiles;
