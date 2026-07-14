import { useEffect, useId, useRef, useState } from "react";

type SelectOption = {
    label: string;
    value: string;
};

type SelectFieldProps = {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
};

function SelectField({
    label,
    value,
    options,
    onChange,
}: SelectFieldProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectId = useId();

    const selectedOption = options.find(
        (option) => option.value === value
    );

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    function handleSelect(optionValue: string) {
        onChange(optionValue);
        setIsOpen(false);
    }

    return (
        <div ref={containerRef} className="relative space-y-2">
            <label
                id={`${selectId}-label`}
                className="text-sm font-medium text-text-main"
            >
                {label}
            </label>

            <button
                type="button"
                aria-labelledby={`${selectId}-label`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                className="
                    flex
                    h-10
                    w-full
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-lg
                    bg-surface-light
                    px-4
                    font-medium
                    text-text-main
                    transition-colors
                    duration-200
                    hover:brightness-110
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                "
            >
                <span>{selectedOption?.label}</span>

                <span
                    className={`text-text-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    ▼
                </span>
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    className="
                        absolute
                        z-20
                        mt-2
                        w-full
                        overflow-hidden
                        rounded-lg
                        border
                        border-border
                        bg-surface
                        p-1
                        shadow-xl
                    "
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => handleSelect(option.value)}
                            className="
                                w-full
                                cursor-pointer
                                rounded-md
                                px-3
                                py-2
                                text-left
                                text-sm
                                text-text-main
                                transition-colors
                                duration-150
                                hover:bg-surface-light
                            "
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SelectField;