import CardActionButton from "../ui/CardActionButton";

type TrainingSessionCardProps = {
    type: string;
    duration: string;
    intensity: string;
    onEdit: () => void;
    onDelete: () => void;
};

function TrainingSessionCard({
    type,
    duration,
    intensity,
    onEdit,
    onDelete,
}: TrainingSessionCardProps) {
    return (
        <div className="rounded-xl bg-surface-light p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-medium text-text-main">
                        {type}
                    </p>

                    <p className="mt-2 text-sm text-text-muted">
                        {duration} · {intensity}
                    </p>
                </div>

                <div className="flex gap-2">
                    <CardActionButton onClick={onEdit}>
                        Edit
                    </CardActionButton>

                    <CardActionButton
                        variant="danger"
                        onClick={onDelete}
                    >
                        Delete
                    </CardActionButton>
                </div>
            </div>
        </div>
    );
}

export default TrainingSessionCard;