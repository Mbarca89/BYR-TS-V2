import DOMPurify from 'dompurify';

export const quillFormats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'indent',
    'align',
    'blockquote', 'link',
];

export function sanitizeRichText(html: string) {
    return DOMPurify.sanitize(html || '', {
        FORBID_TAGS: ['iframe', 'script', 'style', 'math', 'svg', 'video', 'source'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });
}
