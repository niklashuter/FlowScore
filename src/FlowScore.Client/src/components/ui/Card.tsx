type CardProps ={
    children: React.ReactNode;
};

function Card({ children }: CardProps) {
    return (
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6">
            {children}
        </div>
    );
}

export default Card;