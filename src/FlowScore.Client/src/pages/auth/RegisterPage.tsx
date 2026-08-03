import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import flowScoreLogo from "../../assets/logo.svg";
import Button from "../../components/ui/Button";
import { register } from "../../api/authApi";

function RegisterPage() {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            await register({
                name,
                email,
                password,
            });

            navigate("/login");
        } catch {
            setError("Registration failed.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 shadow-2xl">

                <div className="mb-10 flex flex-col items-center">
                    <img
                        src={flowScoreLogo}
                        alt="FlowScore logo"
                        className="mb-6 h-20 w-20"
                    />

                    <h1 className="text-4xl font-bold text-cyan-400">
                        FlowScore
                    </h1>

                    <p className="mt-3 text-center text-slate-400">
                        Create your FlowScore account.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            autoComplete="name"
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Email
                        </label>

                        <input
                            required
                            autoComplete="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                required
                                autoComplete="new-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition focus:border-cyan-400"
                            />
                            
                            <button
                                type="button"
                                onClick={() => setShowPassword((previous) => !previous)}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-cyan-400"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-cyan-400 hover:text-cyan-300"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;