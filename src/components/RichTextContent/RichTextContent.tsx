import { sanitizeRichText } from '../../utils/richText';
import './RichTextContent.css';

export default function RichTextContent({ html }: { html: string }) {
    return <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />;
}
