#!/usr/bin/env bash
#    ______                                      ____
#   /_  __/_  ___________     ____ ___  ___     / __ \____
#    / / / / / / ___/ __ \   / __ `__ \/ _ \   / / / / __ \
#   / / / /_/ / /  / / / /  / / / / / /  __/  / /_/ / / / /
#  /_/  \__,_/_/  /_/ /_/  /_/ /_/ /_/\___/   \____/_/ /_/
# ---------------------TurnMeOn.sh --------------------
# Usage : launched by the Dockerfile $ENTRYPOINT for Onion docker service
export NODE_ENV='production' && export SERV_ENV='onion'
tor && sudo nginx && ./INIT_DEV.sh -rl production && \
screen -dmS applog ./node_modules/pm2/bin/pm2 logs && \
screen -dmS servlog tail -f /var/log/nginx/*.log
