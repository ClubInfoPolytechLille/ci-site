all: config/ci_com_pub.pem config/session_secret public/img/logo.png

config/ci_com_pub.pem: config/ci_com.pem
	openssl rsa -pubout -in $< -out $@
	chmod 777 $@

config/ci_com.pem:
	openssl genrsa -out $@ 1024
	chmod 700 $@

config/session_secret:
	cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1 > $@

public/img/logo.png: public/img/logo.svg
	convert $< $@
