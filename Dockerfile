FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY src/FlowScore.Api/FlowScore.Api.csproj src/FlowScore.Api/
COPY src/FlowScore.Api.Migrations.Postgres/FlowScore.Api.Migrations.Postgres.csproj src/FlowScore.Api.Migrations.Postgres/

RUN dotnet restore src/FlowScore.Api.Migrations.Postgres/FlowScore.Api.Migrations.Postgres.csproj

COPY src/FlowScore.Api/ src/FlowScore.Api/
COPY src/FlowScore.Api.Migrations.Postgres/ src/FlowScore.Api.Migrations.Postgres/

RUN dotnet build src/FlowScore.Api.Migrations.Postgres/FlowScore.Api.Migrations.Postgres.csproj \
    -c Release \
    --no-restore

RUN dotnet publish src/FlowScore.Api/FlowScore.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

RUN cp \
    src/FlowScore.Api/bin/Release/net8.0/FlowScore.Api.Migrations.Postgres.dll \
    /app/publish/

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 10000

ENTRYPOINT ["dotnet", "FlowScore.Api.dll"]