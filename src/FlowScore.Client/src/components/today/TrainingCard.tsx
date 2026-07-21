import Button from "../ui/Button";
import Card from "../ui/Card";
import TrainingSessionCard from "./TrainingSessionCard";
import Modal from "../ui/Modal";
import { useEffect, useState } from "react";
import SelectField from "../ui/SelectField";
import {
    createTrainingSession,
    deleteTrainingSession,
    getTrainingSessionsByDate,
    updateTrainingSession,
    type TrainingSession,
} from "../../api/trainingApi";
import {
    getTrainingDayByDate,
    updateTrainingDay,
} from "../../api/trainingDayApi";

type TrainingCardProps = {
    today: string;
    onTrainingChanged?: () => void;
};

function TrainingCard({
    today,
    onTrainingChanged,
}: TrainingCardProps) {
    const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

    const [trainingType, setTrainingType] = useState("strength");
    const [trainingDuration, setTrainingDuration] = useState("60");
    const [trainingIntensity, setTrainingIntensity] = useState("moderate");

    const [editingTrainingId, setEditingTrainingId] =
        useState<number | null>(null);

    const [trainingSessions, setTrainingSessions] =
    useState<TrainingSession[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const trainingTypeOptions = [
        { label: "Strength Training", value: "strength" },
        { label: "Running", value: "running" },
        { label: "Cycling", value: "cycling" },
        { label: "Swimming", value: "swimming" },
        { label: "Team Sports", value: "team" },
        { label: "Mobility", value: "mobility" },
        { label: "Yoga", value: "yoga" },
        { label: "HIIT", value: "hiit" },
        { label: "Other", value: "other" },
    ];

    const durationOptions = [
        { label: "30 min", value: "30" },
        { label: "60 min", value: "60" },
        { label: "90 min", value: "90" },
        { label: "120 min", value: "120" },
        { label: "150 min", value: "150" },
        { label: "180 min", value: "180" },
    ];

    const intensityOptions = [
        { label: "Light", value: "light" },
        { label: "Moderate", value: "moderate" },
        { label: "Hard", value: "hard" },
    ];

    const [isRestDay, setIsRestDay] =
    useState(false);

    async function loadTrainingSessions() {
        setIsLoading(true);
        setError("");

        try {
            const loadedTrainingSessions =
                await getTrainingSessionsByDate(today);

            setTrainingSessions(loadedTrainingSessions);
        } catch (error) {
            console.error(
                "Failed to load training sessions:",
                error
            );

            setError("Unable to load training sessions.");
        } finally {
            setIsLoading(false);
        }
    }

    async function loadTrainingDay() {
        try {
            const trainingDay =
                await getTrainingDayByDate(today);

            setIsRestDay(
                trainingDay?.isRestDay ?? false
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function handleRestDayChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const checked = event.target.checked;

        if (
            checked &&
            trainingSessions.length > 0
        ) {
            const confirmed = window.confirm(
                "Marking today as a rest day will delete all training sessions. Continue?"
            );

            if (!confirmed) {
                return;
            }
        }

        try {
            await updateTrainingDay(today, {
                isRestDay: checked,
            });

            setIsRestDay(checked);

            await loadTrainingSessions();

            onTrainingChanged?.();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadTrainingSessions();
        loadTrainingDay();
    }, [today]);

    function resetTrainingForm() {
        setTrainingType("strength");
        setTrainingDuration("60");
        setTrainingIntensity("moderate");
        setEditingTrainingId(null);
    }

    async function handleSaveTraining() {
        const selectedTrainingType = trainingTypeOptions.find(
            (option) => option.value === trainingType
        );

        const selectedDuration = durationOptions.find(
            (option) => option.value === trainingDuration
        );

        const selectedIntensity = intensityOptions.find(
            (option) => option.value === trainingIntensity
        );

        if (
            !selectedTrainingType ||
            !selectedDuration ||
            !selectedIntensity
        ) {
            return;
        }

        const trainingRequest = {
            type: selectedTrainingType.label,
            durationMinutes: Number(selectedDuration.value),
            intensity: selectedIntensity.label,
            date: today,
        };

        try {
            if (editingTrainingId !== null) {
                await updateTrainingSession(
                    editingTrainingId,
                    trainingRequest
                );
            } else {
                await createTrainingSession(trainingRequest);
            }

            await loadTrainingSessions();
            onTrainingChanged?.();
            resetTrainingForm();
            setIsTrainingModalOpen(false);
        } catch (error) {
            console.error(
                "Failed to save training session:",
                error
            );

            setError("Unable to save training session.");
        }
    }

    function handleEditTraining(trainingId: number) {
        const trainingToEdit = trainingSessions.find(
            (session) => session.id === trainingId
        );

        if (!trainingToEdit) {
            return;
        }

        const matchingTrainingType = trainingTypeOptions.find(
            (option) => option.label === trainingToEdit.type
        );

        const matchingDuration = durationOptions.find(
            (option) =>
                Number(option.value) ===
                trainingToEdit.durationMinutes
        );

        const matchingIntensity = intensityOptions.find(
            (option) => option.label === trainingToEdit.intensity
        );

        setTrainingType(matchingTrainingType?.value ?? "strength");
        setTrainingDuration(matchingDuration?.value ?? "60");
        setTrainingIntensity(matchingIntensity?.value ?? "moderate");
        setEditingTrainingId(trainingToEdit.id);
        setIsTrainingModalOpen(true);
    }

    async function handleDeleteTraining(trainingId: number) {
        try {
            await deleteTrainingSession(trainingId);
            await loadTrainingSessions();
            onTrainingChanged?.();
        } catch (error) {
            console.error(
                "Failed to delete training session:",
                error
            );

            setError("Unable to delete training session.");
        }
    }

    return (
        <Card>
            <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                   <div>
                        <h2 className="text-xl font-semibold text-text-main">
                            Training
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Log today's movement or workout session.
                        </p>

                        <label className="mt-4 flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={isRestDay}
                                onChange={handleRestDayChange}
                                className="h-4 w-4 cursor-pointer"
                            />

                            <span className="text-sm text-text-muted">
                                Today is a Rest Day
                            </span>
                        </label>
                    </div>

                    <Button
                        variant="secondary"
                        disabled={isRestDay}
                        onClick={() => {
                            resetTrainingForm();
                            setIsTrainingModalOpen(true);
                        }}
                    >
                        Add Training
                    </Button>
                </div>

                {error && (
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                )}

                <div className="space-y-3">
                    {isLoading ? (
                        <p className="text-sm text-text-muted">
                            Loading training sessions...
                        </p>
                    ) : isRestDay ? (
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                            <p className="text-sm font-medium text-text-main">
                                Today is a Rest Day
                            </p>

                            <p className="mt-1 text-sm text-text-muted">
                                Recovery is part of performance.
                            </p>
                        </div>
                    ) : trainingSessions.length === 0 ? (
                        <p className="text-sm text-text-muted">
                            No training sessions have been added for today.
                        </p>
                    ) : (
                        trainingSessions.map((session) => (
                            <TrainingSessionCard
                                key={session.id}
                                type={session.type}
                                duration={`${session.durationMinutes} min`}
                                intensity={session.intensity}
                                onEdit={() => handleEditTraining(session.id)}
                                onDelete={() => handleDeleteTraining(session.id)}
                            />
                        ))
                    )}
                </div>
            </div>
            <Modal
                isOpen={isTrainingModalOpen}
                title={
                    editingTrainingId !== null
                        ? "Edit Training"
                        : "Add Training"
                }
                onClose={() => setIsTrainingModalOpen(false)}
            >
                <div className="space-y-5">
                    <SelectField
                        label="Training Type"
                        value={trainingType}
                        options={trainingTypeOptions}
                        onChange={setTrainingType}
                    />

                    <SelectField
                        label="Duration"
                        value={trainingDuration}
                        options={durationOptions}
                        onChange={setTrainingDuration}
                    />

                    <SelectField
                        label="Intensity"
                        value={trainingIntensity}
                        options={intensityOptions}
                        onChange={setTrainingIntensity}
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                resetTrainingForm();
                                setIsTrainingModalOpen(false);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button onClick={handleSaveTraining}>
                            {editingTrainingId !== null
                                ? "Save Changes"
                                : "Add Training"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>

        
    );
}

export default TrainingCard;