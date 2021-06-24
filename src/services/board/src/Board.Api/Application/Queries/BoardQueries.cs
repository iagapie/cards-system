using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Npgsql;

namespace Board.Api.Application.Queries
{
    public class BoardQueries : IBoardQueries
    {
        private readonly string _connectionString;

        public BoardQueries(string connectionString)
        {
            _connectionString = !string.IsNullOrWhiteSpace(connectionString)
                ? connectionString
                : throw new ArgumentNullException(nameof(connectionString));

            DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        public async Task<Board> GetBoard(Guid id)
        {
            const string sql = "SELECT * FROM boards WHERE id = @id; SELECT * FROM members WHERE board_id = @id";

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            using var multi = await connection.QueryMultipleAsync(sql, new {id});

            var board = await multi.ReadSingleOrDefaultAsync<Board>();

            if (board == null) throw new KeyNotFoundException();

            var data = await multi.ReadAsync();
            var members = data
                .GroupBy(x => x.user_id, x => (int) x.role_id)
                .Select(x => new Member {UserId = x.Key, Roles = x});

            return board with {Members = members};
        }

        public async Task<CountBoards> Count(Criteria criteria)
        {
            var (sql, @params) = GetSql(criteria);
            sql = "SELECT COUNT(b.*)" + sql;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            var count = await connection.ExecuteScalarAsync<long>(sql, @params);

            return new CountBoards {Total = count};
        }

        public async Task<BoardList> GetBoards(Criteria criteria, Range range, Sort sort)
        {
            var (sql, @params) = GetSql(criteria);

            sql = $"SELECT b.* {sql} ORDER BY b.{sort.Column} {sort.Direction} LIMIT @limit OFFSET @skip";

            @params["limit"] = range.Limit;
            @params["skip"] = range.Skip;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            var boards = await connection.QueryAsync<Board>(sql, @params);

            return new BoardList {Boards = boards};
        }

        private static (string, IDictionary<string, dynamic>) GetSql(Criteria criteria)
        {
            var @params = new Dictionary<string, dynamic>();
            var sql = new StringBuilder("FROM boards b");
            var where = new List<string>();
            var group = new List<string>();
            var m = string.Empty;

            if (criteria.BoardIds?.Length > 0)
            {
                where.Add("b.id = ANY(@ids)");
                @params["ids"] = criteria.BoardIds;
            }

            if (!string.IsNullOrWhiteSpace(criteria.UserId))
            {
                m = $"{m} AND m.user_id = @user";
                @params["user"] = criteria.UserId;
            }

            if (criteria.RoleId.HasValue)
            {
                m = $"{m} AND m.role_id = @role";
                @params["role"] = criteria.RoleId.Value;
            }

            if (m != string.Empty)
            {
                sql.Append($" LEFT JOIN members m ON m.board_id = b.id {m}");
                where.Add("m.id IS NOT NULL");
                group.Add("b.id");
            }

            if (where.Any())
            {
                sql.Append(" WHERE ");
                sql.Append(string.Join(" AND ", where));
            }

            if (group.Any())
            {
                sql.Append(" GROUP BY ");
                sql.Append(string.Join(", ", group));
            }

            return (sql.ToString(), @params);
        }
    }
}