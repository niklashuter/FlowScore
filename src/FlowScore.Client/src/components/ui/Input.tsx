type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
    return (
        <input
            {...props}
            className="
                w-full
                rounded-lg
                border
                border-slate-700
                bg-slate-900
                px-4
                py-2
                text-white
                placeholder:text-slate-500
                focus:border-cyan-400
                focus:outline-none
                focus:ring-2
                focus:ring-cyan-400/30
                transition-colors
            "
        />
    );
}

export default Input;