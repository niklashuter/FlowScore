using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlowScore.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMealNutritionAnalysis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NutritionFeedback",
                table: "Meals",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NutritionScore",
                table: "Meals",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NutritionFeedback",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "NutritionScore",
                table: "Meals");
        }
    }
}
