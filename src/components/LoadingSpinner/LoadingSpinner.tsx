import ReactLoadingModule from 'react-loading';

const ReactLoading = ((ReactLoadingModule as any).default || ReactLoadingModule) as React.ComponentType<{
    type: string;
    color: string;
    height: string;
    width: string;
}>;

interface LoadingSpinnerProps {
    height?: string;
    width?: string;
}

export default function LoadingSpinner({ height = '5%', width = '5%' }: LoadingSpinnerProps) {
    return <ReactLoading type="spinningBubbles" color="#4a4a4a" height={height} width={width} />;
}
