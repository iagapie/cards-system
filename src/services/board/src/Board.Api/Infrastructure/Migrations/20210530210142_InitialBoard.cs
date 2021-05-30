using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Board.Api.Infrastructure.Migrations
{
    public partial class InitialBoard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false, defaultValue: 10),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "visibilities",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false, defaultValue: 10),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_visibilities", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "boards",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", maxLength: 36, nullable: false),
                    visibility_id = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: true),
                    name = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    owner_id = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_boards", x => x.id);
                    table.ForeignKey(
                        name: "FK_boards_visibilities_visibility_id",
                        column: x => x.visibility_id,
                        principalTable: "visibilities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "members",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", maxLength: 36, nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: false),
                    board_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_members", x => x.id);
                    table.ForeignKey(
                        name: "FK_members_boards_board_id",
                        column: x => x.board_id,
                        principalTable: "boards",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_members_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_boards_owner_id",
                table: "boards",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "IX_boards_updated_at",
                table: "boards",
                column: "updated_at");

            migrationBuilder.CreateIndex(
                name: "IX_boards_visibility_id",
                table: "boards",
                column: "visibility_id");

            migrationBuilder.CreateIndex(
                name: "IX_members_board_id_user_id_role_id",
                table: "members",
                columns: new[] { "board_id", "user_id", "role_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_members_role_id",
                table: "members",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_members_updated_at",
                table: "members",
                column: "updated_at");

            migrationBuilder.CreateIndex(
                name: "IX_members_user_id",
                table: "members",
                column: "user_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "members");

            migrationBuilder.DropTable(
                name: "boards");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "visibilities");
        }
    }
}
