namespace FlowScore.Api.Models;

public class TrainingDay
{
    public int Id { get; set; }

    public DateOnly Date { get; set; }

    public bool IsRestDay { get; set; }
}