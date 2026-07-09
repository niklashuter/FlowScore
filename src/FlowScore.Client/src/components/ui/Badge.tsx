type BadgeProps = {
    children: React.ReactNode;
};

function Badge({ children }: BadgeProps) {
    return (
        <span className="inline-flex rounded-full bg-surface-light px-3 py-1 text-sm font-medium text-text-main">
            {children}
        </span>
    );
}

export default Badge;