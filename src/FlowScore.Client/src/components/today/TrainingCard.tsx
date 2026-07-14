import Button from "../ui/Button";
import Card from "../ui/Card";
import TrainingSessionCard from "./TrainingSessionCard";
import Modal from "../ui/Modal";
import { useState } from "react";
import SelectField from "../ui/SelectField";
import CardActionButton from "../ui/CardActionButton";

function TrainingCard() {
    const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

    const [trainingType, setTrainingType] = useState("strength");
    const [trainingDuration, setTrainingDuration] = useState("60");
    const [trainingIntensity, setTrainingIntensity] = useState("moderate");

    const [editingTrainingId, setEditingTrainingId] =
        useState<number | null>(null);

    const [trainingSessions, setTrainingSessions] = useState([
        {
            id: 1,
            type: "Strength Training",
            duration: "60 min",
            intensity: "Moderate",
        },
    ]);

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

    function resetTrainingForm() {
        setTrainingType("strength");
        setTrainingDuration("60");
        setTrainingIntensity("moderate");
        setEditingTrainingId(null);
    }

    function handleSaveTraining() {
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

        if (editingTrainingId !== null) {
            setTrainingSessions((currentSessions) =>
                currentSessions.map((session) =>
                    session.id === editingTrainingId
                        ? {
                            ...session,
                            type: selectedTrainingType.label,
                            duration: selectedDuration.label,
                            intensity: selectedIntensity.label,
                        }
                        : session
                )
            );
        } else {
            const newTrainingSession = {
                id: Date.now(),
                type: selectedTrainingType.label,
                duration: selectedDuration.label,
                intensity: selectedIntensity.label,
            };

            setTrainingSessions((currentSessions) => [
                ...currentSessions,
                newTrainingSession,
            ]);
        }

        resetTrainingForm();
        setIsTrainingModalOpen(false);
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
            (option) => option.label === trainingToEdit.duration
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

    function handleDeleteTraining(trainingId: number) {
        setTrainingSessions((currentSessions) =>
            currentSessions.filter(
                (session) => session.id !== trainingId
            )
        );
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
                    </div>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            resetTrainingForm();
                            setIsTrainingModalOpen(true);
                        }}
                    >
                        Add Training
                    </Button>
                </div>

                <div className="space-y-3">
                    {trainingSessions.map((session) => (
                        <TrainingSessionCard
                            key={session.id}
                            type={session.type}
                            duration={session.duration}
                            intensity={session.intensity}
                            onEdit={() => handleEditTraining(session.id)}
                            onDelete={() => handleDeleteTraining(session.id)}
                        />
                    ))}
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