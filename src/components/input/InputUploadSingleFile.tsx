'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import axios from 'axios';
import { Label } from '../ui/label';
import { FormMessage } from '../ui/form';
import { Control, Controller } from 'react-hook-form';

interface UploadImageProps {
  name: string;
  control: Control<any>; // hoặc cụ thể hơn: Control<FormType>
  initialImageUrl?: string;
}

const InputUploadSingleFile: React.FC<UploadImageProps> = ({
  name,
  control,
  initialImageUrl,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { value, onChange } = field;
        const error = fieldState.error;

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
            onChange(url); // set value in form
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
                data: { url: value },
              }
            );
            onChange(''); // clear value
          } catch (err) {
            console.error('Delete failed:', err);
          } finally {
            setLoading(false);
          }
        };

        return (
          <div className="space-y-3 w-60">
            <Input
              type="file"
              id={`file-${name}`}
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />

            {!value && !loading && (
              <Label
                htmlFor={`file-${name}`}
                className="cursor-pointer w-max h-10 rounded-lg flex items-center justify-center bg-slate-600 text-white font-medium px-3"
              >
                Upload
              </Label>
            )}

            {value && !loading && (
              <div className="relative w-full h-60 border rounded overflow-hidden group">
                <label htmlFor={`file-${name}`}>
                  <Image
                    src={value}
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

            {loading && (
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </div>
            )}

            {/* ✅ Hiển thị lỗi */}
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};

export default InputUploadSingleFile;
