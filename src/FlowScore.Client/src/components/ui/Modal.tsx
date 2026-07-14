type ModalProps = {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
};

function Modal({
    isOpen,
    title,
    children,
    onClose,
}: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <h2
                        id="modal-title"
                        className="text-xl font-semibold text-text-main"
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer text-2xl leading-none text-text-muted transition-colors hover:text-text-main"
                        aria-label="Close modal"
                    >
                        x
                    </button>
                </div>

                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;