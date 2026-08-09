import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    showPassword: boolean;
    onChange: (value: string) => void;
    onToggleVisibility: () => void;
};

function PasswordField({
    id,
    label,
    placeholder,
    value,
    showPassword,
    onChange,
    onToggleVisibility,
}: PasswordFieldProps) {
    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-sm font-medium text-text-main"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-text-main outline-none transition focus:border-cyan-400"
                />

                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-4 text-slate-400 transition hover:text-cyan-400"
                >
                    {showPassword ? (
                        <EyeOff size={20} />
                    ) : (
                        <Eye size={20} />
                    )}
                </button>
            </div>
        </div>
    );
}

export default PasswordField;