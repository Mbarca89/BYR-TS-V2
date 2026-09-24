import { useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import { quillFormats, sanitizeRichText } from '../../utils/richText';
import 'quill/dist/quill.snow.css';
import './RichTextEditor.css';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    readOnly?: boolean;
}

const toolbar = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }, { size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['blockquote', 'link', 'clean'],
];

const labels: Record<string, string> = {
    header: 'Titulo o parrafo',
    size: 'Tamano del texto',
    bold: 'Negrita',
    italic: 'Cursiva',
    underline: 'Subrayado',
    strike: 'Tachado',
    color: 'Color del texto',
    background: 'Color de fondo',
    align: 'Alineacion',
    blockquote: 'Cita',
    link: 'Enlace',
    clean: 'Quitar formato',
};

export default function RichTextEditor({ value, onChange, readOnly = false }: RichTextEditorProps) {
    const host = useRef<HTMLDivElement>(null);
    const editor = useRef<Quill | null>(null);
    const props = useRef({ value, onChange, readOnly });
    const lastHtml = useRef(value);

    useLayoutEffect(() => { props.current = { value, onChange, readOnly }; }, [value, onChange, readOnly]);

    useEffect(() => {
        const container = host.current!;
        const target = document.createElement('div');
        container.appendChild(target);
        const quill = new Quill(target, {
            theme: 'snow',
            readOnly: props.current.readOnly,
            modules: { toolbar, history: { userOnly: true } },
            formats: quillFormats,
        });
        editor.current = quill;
        quill.root.setAttribute('role', 'textbox');
        quill.root.setAttribute('aria-label', 'Descripcion de la propiedad');
        quill.root.setAttribute('aria-multiline', 'true');
        quill.clipboard.dangerouslyPasteHTML(sanitizeRichText(props.current.value), 'silent');
        quill.history.clear();
        lastHtml.current = props.current.value;

        container.querySelectorAll<HTMLElement>('.ql-toolbar button, .ql-picker-label').forEach(control => {
            const format = [...control.classList].find(name => name.startsWith('ql-') && name !== 'ql-picker-label')?.slice(3)
                || [...(control.parentElement?.classList || [])].find(name => name in labels || name.startsWith('ql-') && name.slice(3) in labels)?.replace(/^ql-/, '');
            let label = format ? labels[format] : undefined;
            if (format === 'list') label = control.getAttribute('value') === 'ordered' ? 'Lista numerada' : 'Lista con vinetas';
            if (format === 'indent') label = control.getAttribute('value') === '+1' ? 'Aumentar sangria' : 'Reducir sangria';
            if (label) {
                control.setAttribute('aria-label', label);
                control.setAttribute('title', label);
            }
            if (control instanceof HTMLButtonElement) control.type = 'button';
        });

        const changed = (_delta: unknown, _old: unknown, source: string) => {
            if (source !== 'user') return;
            const html = sanitizeRichText(quill.getSemanticHTML());
            lastHtml.current = html;
            props.current.onChange(html);
        };
        quill.on('text-change', changed);
        return () => {
            quill.off('text-change', changed);
            quill.disable();
            quill.scroll.observer.disconnect();
            editor.current = null;
            container.replaceChildren();
        };
    }, []);

    useEffect(() => {
        const quill = editor.current;
        if (!quill || value === lastHtml.current) return;
        quill.clipboard.dangerouslyPasteHTML(sanitizeRichText(value), 'silent');
        quill.history.clear();
        lastHtml.current = value;
    }, [value]);

    useEffect(() => { editor.current?.enable(!readOnly); }, [readOnly]);

    return <div ref={host} className="property-editor" aria-disabled={readOnly} />;
}
