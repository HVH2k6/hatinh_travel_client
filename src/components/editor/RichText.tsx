// components/editor/RichText.tsx
'use client';
import dynamic from 'next/dynamic';
import * as React from 'react';

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
};

function RichTextBase({
  value = '',
  onChange,
  label = 'Mô tả',
  placeholder,
  disabled,
  id,
  height = 360,
}: Props) {
  const [mounted, setMounted] = React.useState(false);
  const reactId = React.useId(); // id ổn định nếu không truyền id
  React.useEffect(() => setMounted(true), []);
  const handleChange = React.useCallback((content: string) => onChange(content), [onChange]);

  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium">{label}</label> : null}
      {!mounted ? (
        <div className="h-[360px] w-full rounded-md border animate-pulse" />
      ) : (
        <TinyEditor
          id={id || `rt-${reactId}`}
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={value}
          onEditorChange={handleChange}
          init={{
            height,
            menubar: false,
            branding: false,
            statusbar: false,
            placeholder,
            plugins:
              'link lists table code codesample image charmap preview anchor autolink fullscreen',
            toolbar:
              'undo redo | blocks fontfamily | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | removeformat | code fullscreen preview',
            content_style:
              'body { font-family: Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif; font-size:14px }',
          }}
          disabled={disabled}
        />
      )}
    </div>
  );
}

const RichText = React.memo(RichTextBase);
export default RichText;
