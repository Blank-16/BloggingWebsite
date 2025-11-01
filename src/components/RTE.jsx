import { useEffect, useRef } from 'react';
import { Controller } from 'react-hook-form';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className='w-full bg-white text-black'>
            {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
            <Controller
                name={name || "content"}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, value } }) => (
                    <QuillEditor
                        value={value || ''}
                        onChange={onChange}
                    />
                )}
            />
        </div>
    )
}

function QuillEditor({ value, onChange }) {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const onChangeRef = useRef(onChange);
    const isInitialMount = useRef(true);
    const initializedRef = useRef(false);

    // Keep onChange ref updated
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        // Prevent double initialization
        if (initializedRef.current || !containerRef.current) {
            return;
        }

        initializedRef.current = true;

        // Clear any existing content
        containerRef.current.innerHTML = '';

        // Create editor div
        const editorDiv = document.createElement('div');
        containerRef.current.appendChild(editorDiv);

        // Initialize Quill
        const quill = new Quill(editorDiv, {
            theme: 'snow',
            placeholder: 'Write your content here...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['blockquote', 'code-block'],
                    ['link', 'image', 'video'],
                    ['clean']
                ]
            }
        });

        quillRef.current = quill;

        // Set initial value if provided
        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }

        // Handle text changes
        const handleTextChange = () => {
            const html = quill.root.innerHTML;
            onChangeRef.current(html);
        };
        
        quill.on('text-change', handleTextChange);

        // Cleanup
        return () => {
            if (quillRef.current) {
                quillRef.current.off('text-change', handleTextChange);
                quillRef.current = null;
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            initializedRef.current = false;
        };
    }, []);

    // Update editor content when value changes externally
    useEffect(() => {
        if (!quillRef.current) return;

        // Skip on initial mount since we set the value during initialization
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const quill = quillRef.current;
        const currentContent = quill.root.innerHTML;
        
        if (value !== currentContent) {
            const selection = quill.getSelection();
            quill.root.innerHTML = value || '';
            if (selection) {
                quill.setSelection(selection);
            }
        }
    }, [value]);

    return <div ref={containerRef} className="quill-wrapper" />;
}