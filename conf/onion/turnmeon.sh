#!/usr/bin/env bash
#    ______                                      ____
#   /_  __/_  ___________     ____ ___  ___     / __ \____
#    / / / / / / ___/ __ \   / __ `__ \/ _ \   / / / / __ \
#   / / / /_/ / /  / / / /  / / / / / /  __/  / /_/ / / / /
#  /_/  \__,_/_/  /_/ /_/  /_/ /_/ /_/\___/   \____/_/ /_/
# ---------------------TurnMeOn.sh --------------------
# Usage : launched by the Dockerfile $ENTRYPOINT for Onion docker service
set +e
export IP=$(ip -o -4 a s wlan0 | awk '{ print $4 }' | cut -d/ -f1)
echo "proxy_pass http://$IP:3000;" > /usr/src/app/coin_board/ipview
echo "proxy_pass http://$IP:3001;" > /usr/src/app/coin_board/ipsock
sudo chown -R fofo:fofo /var/lib/tor
sudo chmod -R 700 /var/lib/tor
sudo chown -R fofo:fofo /var/log/tor
sudo chown -R fofo:fofo log tmpdata
sudo chown -R fofo /var/log/nginx
tor
mkdir -p /usr/src/app/coin_board/DTAFOOD/{news,prices}
sudo nginx -t && sudo nginx && ./INIT_DEV.sh -rl production onion
screen -dmS applog ./usr/src/app/coin_board/node_modules/pm2/bin/pm2 logs
