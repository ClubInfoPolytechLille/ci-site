config/ci_com_pub.pem: config/ci_com.pem
	openssl rsa -pubout -in $< -out $@
	chmod 777 $@

config/ci_com.pem:
	openssl genrsa -out $@ 1024
	chmod 700 $@
