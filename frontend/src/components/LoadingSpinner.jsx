function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className={`${sizes[size]} border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin`}></div>
            {text && <p className="text-sm text-gray-500">{text}</p>}
        </div>
    );
}

export default LoadingSpinner;
