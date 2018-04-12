#!/usr/bin/env bash
#    ______                                      ____
#   /_  __/_  ___________     ____ ___  ___     / __ \____
#    / / / / / / ___/ __ \   / __ `__ \/ _ \   / / / / __ \
#   / / / /_/ / /  / / / /  / / / / / /  __/  / /_/ / / / /
#  /_/  \__,_/_/  /_/ /_/  /_/ /_/ /_/\___/   \____/_/ /_/
# ---------------------TurnMeOn.sh --------------------
# Usage : launched by the Dockerfile $ENTRYPOINT for Onion docker service
cd /usr/src/app && \
sudo chown -R fofo:fofo /var/lib/tor && \
sudo chmod -R 700 /var/lib/tor && \
sudo chown -R fofo:fofo /var/log/tor && \
sudo chown -R fofo:fofo log tmpdata && \
sudo chown -R fofo /var/log/nginx && \
tor && \
export IP=$(ip -o -4 a s wlan0 | awk '{ print $4 }' | cut -d/ -f1) \
&& echo "proxy_pass http://$(ip -o -4 a s wlan0 | awk '{ print $4 }' | cut -d/ -f1):3000;" \
> /usr/src/app/ipview && \
echo "proxy_pass http://$(ip -o -4 a s wlan0 | awk '{ print $4 }' | cut -d/ -f1):3001;" \
> /usr/src/app/ipsock && \
mkdir -p /usr/src/app/DTAFOOD/news && mkdir /usr/src/app/DTAFOOD/prices && \
sudo nginx && ./INIT_DEV.sh -rl production onion && \
screen -dmS applog ./node_modules/pm2/bin/pm2 logs
