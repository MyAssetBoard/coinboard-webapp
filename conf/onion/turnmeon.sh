#!/usr/bin/env bash
#    ______                                      ____
#   /_  __/_  ___________     ____ ___  ___     / __ \____
#    / / / / / / ___/ __ \   / __ `__ \/ _ \   / / / / __ \
#   / / / /_/ / /  / / / /  / / / / / /  __/  / /_/ / / / /
#  /_/  \__,_/_/  /_/ /_/  /_/ /_/ /_/\___/   \____/_/ /_/
# ---------------------TurnMeOn.sh --------------------
# Usage : launched by the Dockerfile $ENTRYPOINT for Onion docker service
set -e
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
#Welcome message to keep container running
echo -e "Tor address : \033[1m[$(cat /var/lib/tor/hidnview/hostname)]\033[0m\n"
echo -e "=>[hit enter/nonoption key to exit] or run 'docker stop <container>'"
echo "\n\tOptions :"
echo -e "\n[m]\tPM2 monitor\n[l]\tPM2 logs"
read -r foo
case "$foo" in
	'm')
	echo "PM2 monitor =>"
	./node_modules/pm2/bin/pm2 monit
	;;

	'l')
	echo "PM2 logs =>"
	./node_modules/pm2/bin/pm2 logs
	;;

	*)
	echo "$foo unknow option exiting"
	exit 0
	;;
esac
echo "See U !"
