interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="my-16 pt-20 md:px-4 lg:px-6 2xl:container text-center font-bold text-xl">
            <div>{message}</div>
        </div>
    );
};

export default ErrorMessage;
