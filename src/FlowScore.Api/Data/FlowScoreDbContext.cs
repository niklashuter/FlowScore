using FlowScore.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FlowScore.Api.Data;

public class FlowScoreDbContext : IdentityDbContext<ApplicationUser>
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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Meal>()
            .HasOne(meal => meal.User)
            .WithMany()
            .HasForeignKey(meal => meal.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<RecoveryEntry>()
            .HasOne(entry => entry.User)
            .WithMany()
            .HasForeignKey(entry => entry.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<TrainingDay>()
            .HasOne(day => day.User)
            .WithMany()
            .HasForeignKey(day => day.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<TrainingSession>()
            .HasOne(session => session.User)
            .WithMany()
            .HasForeignKey(session => session.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}