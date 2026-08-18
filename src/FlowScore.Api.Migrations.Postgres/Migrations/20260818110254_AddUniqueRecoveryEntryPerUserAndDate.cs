using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlowScore.Api.Migrations.Postgres.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueRecoveryEntryPerUserAndDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RecoveryEntries_UserId",
                table: "RecoveryEntries");

            migrationBuilder.CreateIndex(
                name: "IX_RecoveryEntries_UserId_Date",
                table: "RecoveryEntries",
                columns: new[] { "UserId", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RecoveryEntries_UserId_Date",
                table: "RecoveryEntries");

            migrationBuilder.CreateIndex(
                name: "IX_RecoveryEntries_UserId",
                table: "RecoveryEntries",
                column: "UserId");
        }
    }
}
