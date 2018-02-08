#!/usr/bin/env bash
#   ____  _  _  ____  ____    ____  ____  _  _
#  (_  _)( \( )(_  _)(_  _)  (  _ \( ___)( \/ )
#   _)(_  )  (  _)(_   )(     )(_) ))__)  \  /
#  (____)(_)\_)(____) (__)   (____/(____)  \/
#################InitDev.sh####################

## Variable Init
# Jsdoc
export JSDOC="./node_modules/jsdoc/jsdoc.js"
export JSDOCCONF="conf/jsdoc_conf.json"
# Pm2
export PM2="./node_modules/pm2/bin/pm2"
export PM2DEV="./node_modules/pm2/bin/pm2-dev"
# coin_board app
export APPCONF="./conf/webfront.pm2conf.json"
export WVSERV="webview.service"
export DBSERV="mongodb.service"
export WSSERV="websocket.service"

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

	$BLD Usage :$CL INIT_DEV [-b] [-c] [-d] [-r] [-t] [-h/-u]

	-b:$BLD.Setup$CL your rethinkdb dev environnement$RD*$CL $BLD**$CL
	-c:$BLD.Setup$CL your nodejs dev environnement$BLD**$CL
	-d:$BLD.Generate$CL html doc with jsdoc
	-r:$BLD.reset$CL database tmpdata and restart app in test mode
	-s:$BLD.run$CL app with pm2 (production env)
	-t:$BLD.run$CL app in dev mode (watch for file change)
	-h:$BLD.show$CL this help text and exit

	Notes : Accept only$BLD one$CL arg.
		$BLD[-b]$CL options currently supported system are fedora / centos and
		ubuntu / debian.
	$RD*DEPRECATED$CL : The stack is now rolling with mongo
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

function dbsetup ()
{
	echo -e "
	Enter you distribution and press [ENTER]
	"
	read dist
	if [ "$dist" == "fedora" ] || [ "$dist" == "centos" ]; then
		url="https://download.rethinkdb.com/centos/6"

		sudo wget $url/$(uname -m)/rethinkdb.repo \
		-O /etc/yum.repos.d/rethinkdb.repo &&  \
		sudo yum install rethinkdb
	fi
}

function app_startDev ()
{
	#*DEPRECATED exec $PM2DEV start $APPCONF
	# order matters !
	mongod -f conf/mongodb.conf &
	#$PM2 start $APPCONF --only "$DBSERV";
	$PM2 start $APPCONF --only "$WSSERV" --env development --update-env;
	$PM2 start $APPCONF --only "$WVSERV" --env development --update-env;
}

function app_startProd ()
{
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
	app_kill
	app_startDev
}

function genddoc ()
{
	$JSDOC -r coin_board -c $JSDOCCONF -d doc &>jsdoc.log;
	echo -e "
	** Documentation generation ok !
	(logs on jsdoc.log)

	Please open your favorite web browser to$BLD doc/index.html$CL
	"
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

		'n-r')
		reset_db
		exit 0
		;;

		'n-s')
		app_startProd
		exit 0
		;;

		'n-t')
		app_startDev
		exit 0
		;;

		'n-k')
		app_kill
		exit 0
		;;

		'n-rl')
		app_reload
		exit 0
		;;

		*)
		echo "unkown arg given: $1 (see usage)"
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
