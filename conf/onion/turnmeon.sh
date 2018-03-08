#!/usr/bin/env bash
#    ______                                      ____
#   /_  __/_  ___________     ____ ___  ___     / __ \____
#    / / / / / / ___/ __ \   / __ `__ \/ _ \   / / / / __ \
#   / / / /_/ / /  / / / /  / / / / / /  __/  / /_/ / / / /
#  /_/  \__,_/_/  /_/ /_/  /_/ /_/ /_/\___/   \____/_/ /_/
# ---------------------TurnMeOn.sh --------------------
# Usage : launched by the Dockerfile $ENTRYPOINT for Onion docker service
sudo chown -R fofo:fofo /var/lib/tor && \
sudo chown -R fofo:fofo /var/log/tor && \
sudo chown -R fofo:fofo log tmpdata && \
tor && sudo nginx && ./INIT_DEV.sh -rl production onion && \
screen -dmS applog ./node_modules/pm2/bin/pm2 logs
