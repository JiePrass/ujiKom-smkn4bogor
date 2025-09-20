"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"

import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Undo,
    Redo,
} from "lucide-react"

interface TiptapProps {
    value?: string
    onChange?: (value: string) => void
}

export default function Tiptap({ value, onChange }: TiptapProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            Heading.configure({ levels: [1, 2, 3] }),
            BulletList,
            OrderedList,
            ListItem,
            TextAlign.configure({ types: ["heading", "paragraph", "listItem"] }),
        ],
        content: value || "<p>Tulis deskripsi event di sini...</p>",
        onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    })

    if (!editor) return null

    const btnClass = (active: boolean) =>
        `${active ? "bg-gray-200" : ""} p-2 rounded hover:bg-gray-100 transition`

    return (
        <div className="border rounded-lg">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 border-b p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={btnClass(editor.isActive("paragraph"))}
                >
                    <span className="text-sm font-medium">P</span>
                </button>
                {/* Headings */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={btnClass(editor.isActive("heading", { level: 1 }))}
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={btnClass(editor.isActive("heading", { level: 2 }))}
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={btnClass(editor.isActive("heading", { level: 3 }))}
                >
                    <Heading3 className="w-4 h-4" />
                </button>

                {/* Lists */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={btnClass(editor.isActive("bulletList"))}
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={btnClass(editor.isActive("orderedList"))}
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                {/* Align */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={btnClass(editor.isActive({ textAlign: "left" }))}
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={btnClass(editor.isActive({ textAlign: "center" }))}
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={btnClass(editor.isActive({ textAlign: "right" }))}
                >
                    <AlignRight className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    className={btnClass(editor.isActive({ textAlign: "justify" }))}
                >
                    <AlignJustify className="w-4 h-4" />
                </button>

                {/* Undo / Redo */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-2 rounded hover:bg-gray-100 transition"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-2 rounded hover:bg-gray-100 transition"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                role="presentation"
                className="tiptap min-h-[150px] p-3"
            />
        </div>
    )
}
