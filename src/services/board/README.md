```sh
$ dotnet tool install --global dotnet-ef # only if not installed
$ cd src/Board.Api
$ dotnet ef migrations add InitialBoard -o Infrastructure/Migrations -c BoardContext
$ dotnet ef database update -c BoardContext
```
