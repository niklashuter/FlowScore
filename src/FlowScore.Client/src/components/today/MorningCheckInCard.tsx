import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import SelectField from "../ui/SelectField";
import CardActionButton from "../ui/CardActionButton";

function MorningCheckInCard() {
    const [recoveryEntry, setRecoveryEntry] = useState({
        sleepDuration: "8 hours",
        sleepQuality: "Good",
        morningFeeling: "Rested",
    });

    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

    const [sleepDuration, setSleepDuration] = useState("8");
    const [sleepQuality, setSleepQuality] = useState("good");
    const [morningFeeling, setMorningFeeling] = useState("rested");

    const sleepDurationOptions = [
        { label: "5 hours", value: "5" },
        { label: "5.5 hours", value: "5.5" },
        { label: "6 hours", value: "6" },
        { label: "6.5 hours", value: "6.5" },
        { label: "7 hours", value: "7" },
        { label: "7.5 hours", value: "7.5" },
        { label: "8 hours", value: "8" },
        { label: "8.5 hours", value: "8.5" },
        { label: "9 hours", value: "9" },
        { label: "9.5 hours", value: "9.5" },
        { label: "10 hours", value: "10" },
    ];

    const sleepQualityOptions = [
        { label: "Poor", value: "poor" },
        { label: "Okay", value: "okay" },
        { label: "Good", value: "good" },
    ];

    const morningFeelingOptions = [
        { label: "Tired", value: "tired" },
        { label: "Neutral", value: "neutral" },
        { label: "Rested", value: "rested" },
    ];

    function handleSaveCheckIn() {
        const selectedSleepDuration = sleepDurationOptions.find(
            (option) => option.value === sleepDuration
        );

        const selectedSleepQuality = sleepQualityOptions.find(
            (option) => option.value === sleepQuality
        );

        const selectedMorningFeeling = morningFeelingOptions.find(
            (option) => option.value === morningFeeling
        );

        if (
            !selectedSleepDuration ||
            !selectedSleepQuality ||
            !selectedMorningFeeling
        ) {
            return;
        }

        setRecoveryEntry({
            sleepDuration: selectedSleepDuration.label,
            sleepQuality: selectedSleepQuality.label,
            morningFeeling: selectedMorningFeeling.label,
        });

        setIsCheckInModalOpen(false);
    }

    function handleEditCheckIn() {
        const matchingSleepDuration = sleepDurationOptions.find(
            (option) => option.label === recoveryEntry.sleepDuration
        );

        const matchingSleepQuality = sleepQualityOptions.find(
            (option) => option.label === recoveryEntry.sleepQuality
        );

        const matchingMorningFeeling = morningFeelingOptions.find(
            (option) => option.label === recoveryEntry.morningFeeling
        );

        setSleepDuration(matchingSleepDuration?.value ?? "8");
        setSleepQuality(matchingSleepQuality?.value ?? "good");
        setMorningFeeling(matchingMorningFeeling?.value ?? "rested");
        setIsCheckInModalOpen(true);
    }

    return(
        <Card>
            <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-text-main">
                            Morning Check-in
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Add your sleep and recovery data to start the day.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCheckInModalOpen(true)}
                    >
                        Complete Check-in
                    </Button>
                </div>

                <div className="rounded-xl bg-surface-light p-4">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-text-main">
                            Today's Recovery
                        </p>

                        <CardActionButton onClick={handleEditCheckIn}>
                            Edit
                        </CardActionButton>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-text-muted">
                                Sleep Duration
                            </p>

                            <p className="mt-1 font-medium text-text-main">
                                {recoveryEntry.sleepDuration}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-text-muted">
                                Sleep Quality
                            </p>

                            <p className="mt-1 font-medium text-text-main">
                                {recoveryEntry.sleepQuality}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-text-muted">
                                Wake-up Feeling
                            </p>

                            <p className="mt-1 font-medium text-text-main">
                                {recoveryEntry.morningFeeling}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isCheckInModalOpen}
                title="Morning Check-in"
                onClose={() => setIsCheckInModalOpen(false)}
            >
                <div className="space-y-5">
                    <SelectField
                        label="Sleep Duration"
                        value={sleepDuration}
                        options={sleepDurationOptions}
                        onChange={setSleepDuration}
                    />

                    <SelectField
                        label="Sleep Quality"
                        value={sleepQuality}
                        options={sleepQualityOptions}
                        onChange={setSleepQuality}
                    />

                    <SelectField
                        label="How do you feel?"
                        value={morningFeeling}
                        options={morningFeelingOptions}
                        onChange={setMorningFeeling}
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsCheckInModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button onClick={handleSaveCheckIn}>
                            Save Check-in
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
}

export default MorningCheckInCard;