type CardProps ={
    children: React.ReactNode;
};

function Card({ children }: CardProps) {
    return (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            {children}
        </div>
    );
}

export default Card;