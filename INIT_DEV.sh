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
#Color
BLD="\033[1m"
CL="\033[0m"

function usage ()
{
	echo -e "
	## $BLD COINBO4RD $CL devtool

	$BLD Usage :$CL INIT_DEV [-b] [-c] [-d] [-r] [-t] [-h/-u]

	-b:$BLD Setup$CL your rethinkdb dev environnement (run only once)
	-c:$BLD Setup$CL your nodejs dev environnement (run only once)
	-d:$BLD Generate$CL html doc with jsdoc
	-r:$BLD reset$CL database tmpdata and restart app in test mode
	-s:$BLD run$CL app with pm2 (production env)
	-t:$BLD run$CL app in dev mode (watch for file change)
	-h:$BLD show$CL this help text and exit

	Notes : Accept only$BLD one$CL arg.
		$BLD[-b]$CL options currently supported system are fedora / centos and
		ubuntu / debian.
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
	exec $PM2DEV start $APPCONF
}

function app_startProd ()
{
	exec $PM2 $APPBIN
}

function reset_db ()
{
	rm -rf tmpdata && mkdir tmpdata
	wget https://raw.githubusercontent.com/crypti/cryptocurrencies/master/cryptocurrencies.json \
	-O tmpdata/cryptocurrencies.json && app_startDev
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
