// components/editor/RichText.tsx
'use client';
import dynamic from 'next/dynamic';
import * as React from 'react';

// Import kiểu dữ liệu của TinyMCE nếu cần (optional)
// import { Editor as TinyMCEEditor } from 'tinymce';

const TinyEditor = dynamic(
  async () => (await import('@tinymce/tinymce-react')).Editor,
  { ssr: false }
);

type Props = {
  value?: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  height?: number;
  uploadUrl?: string; // Thêm prop để truyền URL API PHP
};

function RichTextBase({
  value = '',
  onChange,
  label = 'Mô tả',
  placeholder,
  disabled,
  id,
  height = 360,
  // Mặc định URL API (Hãy thay đổi localhost thành domain thật của bạn khi deploy)
  uploadUrl = 'https://dichvucloud.online/api_upload.php', 
}: Props) {
  const [mounted, setMounted] = React.useState(false);
  const reactId = React.useId();

  React.useEffect(() => setMounted(true), []);

  const handleChange = React.useCallback(
    (content: string) => onChange(content),
    [onChange]
  );

  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium">{label}</label> : null}
      {!mounted ? (
        <div className="h-[360px] rounded-md border animate-pulse bg-muted" />
      ) : (
        <TinyEditor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          id={id || reactId}
          value={value}
          disabled={disabled}
          onEditorChange={handleChange}
          init={{
            height,
            menubar: false,
            placeholder,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
              'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
              'fullscreen', 'insertdatetime', 'media', 'table', 'help', 
              'wordcount', 'emoticons'
            ],
            toolbar:
              'undo redo | blocks fontsize | ' +
              'bold italic forecolor backcolor | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist outdent indent | ' +
              'image media link emoticons | ' +
              'removeformat code help',

            // ====================================================
            // CẤU HÌNH UPLOAD ẢNH QUA API PHP
            // ====================================================
            
            // 1. Bật tính năng upload
            automatic_uploads: true,
            paste_data_images: true, // Cho phép paste ảnh từ clipboard (sẽ auto trigger upload handler)
            
            // 2. Hàm xử lý upload chính
            // TinyMCE sẽ gọi hàm này khi bạn kéo thả, paste, hoặc chọn file từ máy tính
            images_upload_handler: (blobInfo: { blob: () => Blob; filename: () => string | undefined; }, progress: (arg0: number) => void) => new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.withCredentials = false; // CORS: Thường để false nếu API public
              xhr.open('POST', uploadUrl);

              // Theo dõi tiến trình upload (0-100%)
              xhr.upload.onprogress = (e) => {
                progress(e.loaded / e.total * 100);
              };

              xhr.onload = () => {
                if (xhr.status === 403) {
                  reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
                  return;
                }

                if (xhr.status < 200 || xhr.status >= 300) {
                  reject('HTTP Error: ' + xhr.status);
                  return;
                }

                // Xử lý kết quả trả về từ PHP
                try {
                  const json = JSON.parse(xhr.responseText);

                  // Kiểm tra cấu trúc JSON trả về từ api_upload.php
                  // PHP trả về: { status: 'success', data: { direct_link: '...' } }
                  if (!json || json.status !== 'success' || !json.data?.direct_link) {
                    reject('Invalid JSON: ' + xhr.responseText);
                    return;
                  }

                  // Thành công: Trả về đường dẫn ảnh cho TinyMCE hiển thị
                  resolve(json.data.direct_link);
                } catch (e) {
                  reject('Invalid JSON Response');
                }
              };

              xhr.onerror = () => {
                reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
              };

              const formData = new FormData();
              // Key 'file' phải khớp với $_FILES['file'] trong code PHP
              formData.append('file', blobInfo.blob(), blobInfo.filename());

              xhr.send(formData);
            }),

            // 3. Tùy chỉnh nút chọn file (File Picker)
            // Khi bấm vào icon folder cạnh ô nhập link ảnh
            file_picker_types: 'image',
            file_picker_callback: (callback: (arg0: any, arg1: { title: string; }) => void, value: any, meta: { filetype: string; }) => {
              if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                input.onchange = function () {
                  const file = (this as HTMLInputElement).files?.[0];
                  if (file) {
                    // Chúng ta không convert sang Base64 nữa
                    // Mà gọi cơ chế upload của TinyMCE để nó kích hoạt images_upload_handler
                    
                    // Tuy nhiên, file_picker_callback của TinyMCE React hơi đặc thù.
                    // Cách đơn giản nhất để nó gọi API là giả lập hành vi BlobCache hoặc
                    // đơn giản hơn: Upload thủ công ở đây rồi ném link vào callback.
                    
                    // Cách tốt nhất:
                    const reader = new FileReader();
                    reader.onload = function () {
                      const id = 'blobid' + (new Date()).getTime();
                      const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
                      const base64 = (reader.result as string).split(',')[1];
                      
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);

                      // Gọi callback với blob uri, TinyMCE sẽ tự động nhận diện
                      // đây là blob mới và kích hoạt images_upload_handler để đẩy lên server
                      callback(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }
            },

            // Các tùy chỉnh khác giữ nguyên
            image_advtab: true,
            image_caption: true,
            image_dimensions: true,
            content_style: `
              body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
              img { max-width: 100%; height: auto; }
            `
          }}
        />
      )}
    </div>
  );
}

const RichText = React.memo(RichTextBase);
export default RichText;