type CardActionButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "danger";
};

function CardActionButton({
    children,
    onClick,
    variant = "default",
}: CardActionButtonProps) {

    const variantClasses = {
        default:
            "text-text-muted hover:bg-surface hover:text-text-main",

        danger:
            "text-red-400 hover:bg-red-500/10 hover:text-red-300",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                rounded-md
                px-2
                py-1
                text-sm
                cursor-pointer
                transition-all
                duration-200
                hover:-translate-y-0.5
                ${variantClasses[variant]}
            `}
        >
            {children}
        </button>
    );
}

export default CardActionButton;