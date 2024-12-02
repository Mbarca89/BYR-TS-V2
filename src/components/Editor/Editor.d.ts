import 'react-quill/dist/quill.snow.css';
interface EditorProps {
    propertyId: string;
    updateList: () => void;
}
declare const Editor: React.FC<EditorProps>;
export default Editor;
