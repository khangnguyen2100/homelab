# bash ./start_docker.sh
docker compose -f proxy/compose.yml up -d
docker compose -f homebridge/compose.yml up -d
docker compose -f media/compose.yml up -d
docker compose -f media/jellyfin/compose.yml up -d
docker compose -f media/plex/compose.yml up -d
docker compose -f glance/compose.yml up -d