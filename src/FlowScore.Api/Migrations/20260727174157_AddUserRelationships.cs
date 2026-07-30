using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlowScore.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TrainingSessions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TrainingDays",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "RecoveryEntries",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Meals",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_UserId",
                table: "TrainingSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingDays_UserId",
                table: "TrainingDays",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RecoveryEntries_UserId",
                table: "RecoveryEntries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Meals_UserId",
                table: "Meals",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meals_AspNetUsers_UserId",
                table: "Meals",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RecoveryEntries_AspNetUsers_UserId",
                table: "RecoveryEntries",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingDays_AspNetUsers_UserId",
                table: "TrainingDays",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingSessions_AspNetUsers_UserId",
                table: "TrainingSessions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meals_AspNetUsers_UserId",
                table: "Meals");

            migrationBuilder.DropForeignKey(
                name: "FK_RecoveryEntries_AspNetUsers_UserId",
                table: "RecoveryEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingDays_AspNetUsers_UserId",
                table: "TrainingDays");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingSessions_AspNetUsers_UserId",
                table: "TrainingSessions");

            migrationBuilder.DropIndex(
                name: "IX_TrainingSessions_UserId",
                table: "TrainingSessions");

            migrationBuilder.DropIndex(
                name: "IX_TrainingDays_UserId",
                table: "TrainingDays");

            migrationBuilder.DropIndex(
                name: "IX_RecoveryEntries_UserId",
                table: "RecoveryEntries");

            migrationBuilder.DropIndex(
                name: "IX_Meals_UserId",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TrainingSessions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TrainingDays");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "RecoveryEntries");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Meals");
        }
    }
}
