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

RUN gpg --keyserver keyserver.siccegge.de --recv A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 && \
gpg --export A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 | apt-key add -

RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

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

ADD   conf/onion/onion.nginx.conf /etc/nginx/nginx.conf
ADD   conf/onion/front1.onion.nginx /etc/nginx/sites-enabled/default
ADD   conf/onion/torrc /etc/tor/torrc


RUN useradd -m -p $(openssl passwd -1 'yoyyyoyocleartext') fofo
RUN usermod -u 4523 fofo
RUN echo 'fofo ALL = (root) NOPASSWD: /bin/chown' >> /etc/sudoers
RUN echo 'fofo ALL = (root) NOPASSWD: /bin/chmod' >> /etc/sudoers
RUN echo 'fofo ALL = (root) NOPASSWD: /usr/sbin/nginx' >> /etc/sudoers
#Tor prop
RUN usermod -aG debian-tor fofo
RUN chown -R fofo:fofo /var/lib/tor
RUN chmod -R 775 /var/lib/tor
RUN npm install -g yarn

USER fofo
WORKDIR /usr/src/app
	RUN sudo chown -R fofo:fofo .
	RUN mkdir /usr/src/app/coin_board
	COPY package*.json ./
	COPY */package*.json ./coin_board/
	RUN yarn install && cd coin_board && yarn install && cd ..
	COPY . .
	RUN ls -la .
	RUN sudo chmod +x conf/onion/turnmeon.sh
	RUN sudo chown -R fofo:fofo /var/log/tor

VOLUME ["/usr/src/app"]
