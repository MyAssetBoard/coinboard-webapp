#!/usr/bin/env bash
#    ______                                      ____
#   /_  __/_  ___________     ____ ___  ___     / __ \____
#    / / / / / / ___/ __ \   / __ `__ \/ _ \   / / / / __ \
#   / / / /_/ / /  / / / /  / / / / / /  __/  / /_/ / / / /
#  /_/  \__,_/_/  /_/ /_/  /_/ /_/ /_/\___/   \____/_/ /_/
# ---------------------TurnMeOn.sh --------------------
# Usage : launched by the Dockerfile $ENTRYPOINT for Onion docker service
chown -R root /var/lib/tor
chmod -R 700  /var/lib/tor
export NODE_ENV='production' && export SERV_ENV='onion'
tor && service nginx start && ./INIT_DEV.sh -rl
screen -dmS applog ./node_modules/pm2/bin/pm2 logs
screen -dmS servlog tail -f /var/log/nginx/*.log && exec "$@"
