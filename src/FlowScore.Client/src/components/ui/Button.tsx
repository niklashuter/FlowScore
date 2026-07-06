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
        primary: "bg-primary text-background hover:bg-primary-hover",
        secondary: "bg-surface-light text-text-main hover:bg-border",
        danger: "bg-danger text-white hover:bg-danger-hover",
    };

    const baseClasses = 
        "rounded-lg px-4 py-2 font-medium transition-colors duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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