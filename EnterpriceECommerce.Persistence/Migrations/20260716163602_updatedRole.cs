using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnterpriceECommerce.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Admin");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Admin2");
        }
    }
}
