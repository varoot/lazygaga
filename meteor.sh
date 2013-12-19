#!/bin/bash
if [ ! -d /home/vagrant/meteorapp ]; then
	sudo apt-get update
	sudo apt-get install python-software-properties
	sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
	echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | sudo tee -a /etc/apt/sources.list.d/10gen.list
	sudo apt-get update
	sudo apt-get install -y git mongodb-10gen curl
	cd /usr/local
	wget http://nodejs.org/dist/v0.8.23/node-v0.8.23-linux-x86.tar.gz
	sudo tar -xvzf node-v0.8.23-linux-x86.tar.gz --strip=1
	rm -f node-v0.8.23-linux-x86.tar.gz
	curl https://install.meteor.com | sudo sh
	sudo npm install -g meteorite
	cd /vagrant
	mrt create /home/vagrant/meteorapp
	cd meteorapp
	rm -rf .meteor && mkdir .meteor/
	sudo mount --bind /home/vagrant/meteorapp/.meteor/ /vagrant/meteorapp/.meteor/
	echo "sudo mount --bind /home/vagrant/meteorapp/.meteor/ /vagrant/meteorapp/.meteor/" >> ~/.bashrc && source ~/.bashrc
fi

cd /vagrant/meteorapp
meteor add coffeescript less bootstrap
mrt run