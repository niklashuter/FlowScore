type ProfileFieldProps = {
    label: string;
    value: string;
    disabled?: boolean;
};

function ProfileField({
    label,
    value,
    disabled = false,
}: ProfileFieldProps) {
    return (
        <div
            className={`rounded-xl p-4 ${
                disabled
                    ? "bg-slate-900/70"
                    : "bg-surface-light"
            }`}
        >
            <p
                className={`text-xs uppercase tracking-wide ${
                    disabled
                        ? "text-slate-600"
                        : "text-text-muted"
                }`}
            >
                {label}
            </p>

            <p
                className={`mt-2 font-medium ${
                    disabled
                        ? "text-slate-500"
                        : "text-text-main"
                }`}
            >
                {value}
            </p>
        </div>
    );
}

export default ProfileField;