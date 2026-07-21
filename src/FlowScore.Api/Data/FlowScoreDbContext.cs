using FlowScore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FlowScore.Api.Data;

public class FlowScoreDbContext : DbContext
{
    public FlowScoreDbContext(
        DbContextOptions<FlowScoreDbContext> options
    ) : base(options)
    {
    }

    public DbSet<Meal> Meals => Set<Meal>();

    public DbSet<TrainingSession> TrainingSessions =>
        Set<TrainingSession>();

    public DbSet<RecoveryEntry> RecoveryEntries =>
        Set<RecoveryEntry>();

    public DbSet<TrainingDay> TrainingDays => Set<TrainingDay>();
}