type PageTitleProps = {
    title: string;
    description: string;
};

function PageTitle({
    title,
    description,
}: PageTitleProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main sm:text-3xl">
                {title}
            </h1>

            <p className="mt-2 text-text-muted">
                {description}
            </p>
        </div>
    );
}

export default PageTitle;