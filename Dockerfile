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

RUN gpg --keyserver pgp.mit.edu \
	--recv A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 && \
	gpg --export A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 | apt-key add -

RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -

RUN   apt-get update && apt-get install -y \
	tor \
	git \
	sudo \
	nginx \
	nodejs \
	screen \
	python3 \
	mongodb \
	build-essential \
	ca-certificates


RUN useradd -m -p $(openssl passwd -1 'yoyyyoyocleartext') fofo
RUN usermod -u 4523 fofo
RUN echo 'fofo ALL = (root) NOPASSWD: /bin/chown' >> /etc/sudoers
RUN echo 'fofo ALL = (root) NOPASSWD: /bin/chmod' >> /etc/sudoers
RUN echo 'fofo ALL = (root) NOPASSWD: /usr/sbin/nginx' >> /etc/sudoers
# Fix trouble when deploy on Alpine host
RUN apt-get install -y paxctl && paxctl -cm $(which node)
RUN npm install -g yarn
# Sources files deploiement
RUN mkdir -p /usr/src/app/coin_board/coin_board
COPY package*.json /usr/src/app/coin_board/
COPY */package.json /usr/src/app/coin_board/coin_board/
RUN cd /usr/src/app/coin_board &&  yarn install && cd coin_board && yarn install
COPY . ./usr/src/app/coin_board/
#Conf options for to and nginx
COPY   conf/onion/onion.nginx.conf /etc/nginx/nginx.conf/
COPY   conf/onion/*.onion.nginx /etc/nginx/sites-enabled/
COPY   conf/onion/torrc /etc/tor/torrc

#Tor properties settings for 'fofo' user
RUN usermod -aG debian-tor fofo && \
	chown -R fofo:fofo /var/lib/tor && \
	chown -R root:fofo /var/log/tor && \
	chmod -R 770 /var/log/tor && \
	groupadd foobar && usermod -aG foobar fofo && \
	usermod -aG foobar root && \
	chown root:fofo /usr/src/app/coin_board && \
	chmod 775 /usr/src/app/coin_board && \
	chmod +x /usr/src/app/coin_board/conf/onion/turnmeon.sh && \
	echo 'fooinitsecret' > /usr/src/app/coin_board/log.txt && \
	chown fofo:fofo /usr/src/app/coin_board/log.txt && \
	chmod u=rw /usr/src/app/coin_board/log.txt

RUN apt-get install -y tree

USER fofo
ENV SERV_ENV=onion NODE_ENV=production
WORKDIR /usr/src/app/coin_board
ENTRYPOINT /usr/src/app/coin_board/conf/onion/turnmeon.sh
