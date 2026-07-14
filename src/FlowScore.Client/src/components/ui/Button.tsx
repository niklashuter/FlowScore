import clsx from "clsx";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
};

function Button ({ 
    children, 
    onClick, 
    variant = "primary",
    disabled = false,
}: ButtonProps) {

    const variantClasses = {
        primary:"bg-primary text-white hover:brightness-110 hover:-translate-y-0.5",
        secondary:"bg-surface-light text-text-main hover:brightness-110 hover:-translate-y-0.5",
        danger:"g-red-500 text-white hover:brightness-110 hover:-translate-y-0.5",
    };

    const baseClasses =
        "rounded-lg px-4 py-2 font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer";

    return (
        <button
            onClick={onClick}
            className={clsx(
                baseClasses,
                variantClasses[variant],
                disabled && "cursor-not-allowed opacity-50" 
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;