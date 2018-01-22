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
export APPBIN="coin_board/bin/www"
#Color
BLD="\033[1m"
CL="\033[0m"

function usage ()
{
  echo -e "
  ## $BLD COINBO4RD $CL devtool

  $BLD Usage :$CL INIT_DEV [-c] [-d] [-r] [-t] [-h/-u]

  -c:$BLD Setup$CL your nodejs dev environnement (run only once)
  -d:$BLD Generate$CL html doc with jsdoc
  -r:$BLD run$CL app with pm2 (production env)
  -t:$BLD run$CL app in dev mode (watch for file change)
  -h:$BLD show$CL this help text and exit

  Notes : without any option, runs with -t, accept only$BLD one$CL
          arg.
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

  Tips : Please run this app with ./INIT_DEV.sh -r
  "
}

function app_startDev ()
{
  exec $PM2DEV $APPBIN
}

function app_startProd ()
{
  exec $PM2 $APPBIN --name "coin_board"
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
