namespace FlowScore.Api.Contracts.TrainingDays;

public class TrainingDayResponse
{
    public int Id { get; set; }

    public DateOnly Date { get; set; }

    public bool IsRestDay { get; set; }
}