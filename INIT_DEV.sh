#!/usr/bin/env bash
#   ____  _  _  ____  ____    ____  ____  _  _
#  (_  _)( \( )(_  _)(_  _)  (  _ \( ___)( \/ )
#   _)(_  )  (  _)(_   )(     )(_) ))__)  \  /
#  (____)(_)\_)(____) (__)   (____/(____)  \/
#################InitDev.sh####################

## Variable Init
# Node Param :
export BOT_TOKEN="536901429:AAHoWwWtHY0TIxj3XtLG5HTLzr3-IgJwmpg";
# Jsdoc
export JSDOC="./node_modules/jsdoc/jsdoc.js"
export JSDOCCONF="conf/jsdoc_conf.json"
# Pm2
export PM2="./node_modules/pm2/bin/pm2"
export PM2DEV="./node_modules/pm2/bin/pm2-dev"
# Mocha test suite
export MOCHA="./node_modules/mocha/bin/mocha"
export TESTM="./test/methods/"
export TESTR="./test/routes/"
# Istanbul reporter
export NYC="./node_modules/nyc/bin/nyc.js"
# coin_board app
export APPCONF="./conf/webfront.pm2conf.json"
export WVSERV="webview.service"
export WSSERV="websocket.service"
export CBSERV="CoinBoardBot.service"

#External ressources
export TICKERURL="https://raw.githubusercontent.com/crypti/cryptocurrencies/master/"
export TICKER="cryptocurrencies.json"
#Color
BLD="\033[40m"
CL="\033[0m"
RD="\033[101m"

function usage ()
{
	echo -e "
	## $BLD COINBO4RD $CL devtool

	$BLD Usage :$CL INIT_DEV [-c] [-d] [-r] [-t] [-h/-u]

	-c:$BLD.Setup$CL your nodejs dev environnement$BLD**$CL
	-d:$BLD.Generate$CL html doc with jsdoc
	-o:$BLD.Launch docker$CL .onion service instance of app
	-p:$BLD.Init$CL params and Cook your Dockerfile for first time
	-rb:$BLD.Rebuild Dockerfile if alpine host
	-r:$BLD.reset$CL database tmpdata and restart app in test mode
	-s:$BLD.run$CL app with pm2 (production env)
	-t:$BLD.run$CL app in dev mode (watch for file change)
	-rl:$BLD.reload$CL app following changes (watch in pm2 is broken)
	-lt:$BLD.test$CL app with mocha (test files in test/ dir)
	-h:$BLD.show$CL this help text and exit

	Notes : Accept only$BLD one$CL arg.
		$BLD[-b]$CL options currently supported system are fedora / centos and
		ubuntu / debian.
	** : run only once
	";
}

function nodesetup ()
{
	echo "
	* Let's deploy a Nodejs dev environnement *

	Enter the install command for your favorite apt-get method :
	"
	read aptget && sudo $aptget nodejs npm  && sudo npm  install -g yarn && \
	yarn install && cd coin_board && yarn install &&
	echo "
	Et ...

	Voila!

	Tips : Please run this app with ./INIT_DEV.sh -t
	"
}

function app_initshop()
{
	sudo adduser --system \
	--shell /bin/bash \
	--group --gecos "docker onion usr" \
	fofo && \
	sudo chown -R fofo:$USER conf/onion/kingdom && \
	sudo chmod -R 700 conf/onion/kingdom && \
	#sudo chmod -R 600 conf/onion/kingdom/*/private_key && \
	docker build -t beefonion:latest .
}

function app_alpinecooking()
{
	sudo apk add paxctl && \
	sudo paxctl -cm $(which node) && \
	docker build -t beefonion:latest .
}

function app_startkitchen()
{
	NGLOG=$(pwd)/log/nginxlogs
	KINGDOM=$(pwd)/conf/onion/kingdom
	KVIEW="$KINGDOM/v"
	KSOCK="$KINGDOM/s"
	KALT="$KINGDOM/altsdom"
	docker run -it --net host \
	--name="beefDotonion" \
	-v "$NLOG:/var/log/nginx" \
	-v "$KVIEW:/var/lib/tor/hidnview" \
	-v "$KSOCK:/var/lib/tor/hidnws" \
	-v "$KALT:/var/lib/tor/altd" \
	beefonion bash
}

function app_cleankitchen()
{
	echo 'CleanKitchen : Removing all volumes'
	docker volume rm $(docker volume ls -qf dangling=true)
	echo 'CleanKitchen : Removing all orphaned images'
	docker rmi $(docker images | grep '^<none>' | awk '{print $3}')
}

function app_startDev ()
{
	export NODE_ENV="$1"
	export SERV_ENV="$2"
	#Init random key gen for uid
	echo 'RANDOM' > log.txt;
	# order matters !
	mongod -f conf/mongodb.conf &
	$PM2 start $APPCONF --only "$WSSERV"  --update-env;
	$PM2 start $APPCONF --only "$WVSERV"  --update-env;
	$PM2 start $APPCONF --only "$CBSERV"  --update-env;
}

function app_startProd ()
{
	export NODE_ENV="production"
	exec $PM2 $APPBIN
}

function reset_db ()
{
	rm -rf tmpdata && mkdir tmpdata
	wget "$TICKERURL/$TICKER" \
	-O "tmpdata/$TICKER" && app_startDev
}

function app_kill ()
{
	$PM2 kill
	killall -9 mongod;
}

function app_reload ()
{
	app_kill; app_startDev $1 $2
}

function app_tests ()
{
	NODE_ENV='production'
	killall -9 mongod;
	mongod -f conf/mongodb.conf &
	$NYC --reporter=lcov $MOCHA $TESTM $TESTR --exit
	$NYC report
}

function genddoc ()
{
	rm -rf ~/Downloads/doc
	$JSDOC -c $JSDOCCONF -d doc;
	echo -e "
	** Documentation generation ok !
	(logs on jsdoc.log)

	Please open your favorite web browser to$BLD doc/index.html$CL
	"
	mv doc ~/Downloads/
}

### Scrit init
# exit if failure
set +e
while [[ $# -gt 0 ]]
do
	case "n$1" in
		'n-h')
		usage
		exit 0
		;;

		'n-u')
		usage
		exit 0
		;;

		'n-b')
		dbsetup
		exit 0
		;;

		'n-c')
		set +e;
		nodesetup
		exit 0
		;;

		'n-d')
		genddoc
		exit 0
		;;

		'n-o')
		app_startkitchen
		exit 0
		;;

		'n-p')
		app_initshop
		exit 0
		;;

		'n-r')
		reset_db
		exit 0
		;;

		'n-s')
		app_startProd
		exit 0
		;;


		'n-t')
		app_startDev $2 $3
		exit 0
		;;

		'n-k')
		app_kill
		exit 0
		;;

		'n-ck')
		app_cleankitchen
		exit 0
		;;

		'n-rb')
		app_alpinecooking
		exit 0
		;;

		'n-rl')
		app_reload $2 $3
		exit 0
		;;

		'n-lt')
		app_tests
		exit 0
		;;

		*)
		echo "$0 : unkown [$1] arg given (see usage)"
		exit 1
		;;
	esac
	echo -e "\n\tDone !\n"
	shift
done
echo "
Missing args, see -h or -u for usage
"
exit 1
