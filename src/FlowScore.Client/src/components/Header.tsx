import flowScoreLogo from "../assets/logo.svg";

function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-24 items-center border-b border-slate-800 bg-slate-950 px-10">
            <div className="flex items-center gap-5">
                <img
                    src={flowScoreLogo}
                    alt="FlowScore logo"
                    className="h-14 w-14"
                />

                <h1 className="text-3xl font-bold tracking-tight text-cyan-400">
                    FlowScore
                </h1>
            </div>
        </header>
    );
}

export default Header;