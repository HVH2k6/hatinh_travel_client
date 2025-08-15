'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Tắt Heading/List mặc định để dùng bản tùy chỉnh nếu muốn
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Image,
    ],
    content: `
      <h2>Tiêu đề blog</h2>
      <p>Chào mừng đến với bài viết!</p>
      <ul>
        <li>Điểm đến thú vị</li>
        <li>Ẩm thực</li>
        <li>Trải nghiệm độc đáo</li>
      </ul>
      <p><img src="https://placekitten.com/300/200" alt="Mèo dễ thương"/></p>
    `,
  })

  return <EditorContent editor={editor} />
}

export default Tiptap
