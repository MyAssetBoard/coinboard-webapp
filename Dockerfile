FROM  debian:latest
#  ______            __   _____       _
#  | ___ \          / _| |  _  |     (_)
#  | |_/ / ___  ___| |_  | |/' |_ __  _  ___  _ __
#  | ___ \/ _ \/ _ \  _| |  /| | '_ \| |/ _ \| '_ \
#  | |_/ /  __/  __/ |   \ |_/ / | | | | (_) | | | |
#  \____/ \___|\___|_|    \___/|_| |_|_|\___/|_| |_|
#  - Onion service Dockerfile recipe - Coin_B
####################################################
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y pgp nano git sudo

RUN echo 'deb http://deb.torproject.org/torproject.org stretch main' \
	>> /etc/apt/sources.list
RUN echo 'deb-src http://deb.torproject.org/torproject.org stretch main' \
	>> /etc/apt/sources.list

RUN gpg --keyserver pgp.key-server.io --recv A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 && \
gpg --export A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 | apt-key add -

RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

RUN   apt-get update && apt-get install -y \
        tor \
	git \
	nginx \
	nodejs \
	screen \
	python3 \
	mongodb \
	build-essential \
        ca-certificates


ADD   conf/onion/front1.onion.nginx /etc/nginx/sites-enabled/default
ADD   conf/onion/torrc /etc/tor/torrc

RUN   chown -R root /var/lib/tor
RUN   chmod -R 700 /var/lib/tor

WORKDIR /usr/src/app
RUN mkdir /usr/src/app/coin_board
COPY package*.json ./
COPY */package*.json ./coin_board/
RUN npm install -g yarn
RUN yarn install && cd coin_board && yarn install && cd ..
COPY . .

RUN chmod +x conf/onion/turnmeon.sh
