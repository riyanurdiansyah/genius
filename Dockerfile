#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
RUN apt update && apt install tzdata -y
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf
RUN sed -i "s|DEFAULT@SECLEVEL=2|DEFAULT@SECLEVEL=1|g" /etc/ssl/openssl.cnf
ENV TZ="Asia/Jakarta"
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["kuda/kuda.csproj", "kuda/"]
COPY ["KN2023_ProjectManagement_API.BussLogic/KN2023_ProjectManagement_API.BussLogic.csproj", "KN2023_ProjectManagement_API.BussLogic/"]
COPY ["KN2023_ProjectManagement_API.Common/KN2023_ProjectManagement_API.Common.csproj", "KN2023_ProjectManagement_API.Common/"]
COPY ["KN2023_ProjectManagement_API.DAL/KN2023_ProjectManagement_API.DAL.csproj", "KN2023_ProjectManagement_API.DAL/"]
RUN dotnet restore "kuda/kuda.csproj"
COPY . .
WORKDIR "/src/kuda"
RUN dotnet build "kuda.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "kuda.csproj" -c Release -o /app/publish /p:UseAppHost=false
COPY kuda/Fonts /app/publish/Fonts

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

RUN mkdir /usr/local/share/fonts
RUN cp Fonts/*.ttf /usr/local/share/fonts
ENTRYPOINT ["dotnet", "kuda.dll"]