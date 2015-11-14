#Site internet du Club Info
Version 2015

[![Dependency Status](https://gemnasium.com/ClubInfoPolytechLille/ci-site.svg)](https://gemnasium.com/ClubInfoPolytechLille/ci-site)

##Configuration

```bash
mkdir config
cd config
openssl genrsa -out ci_com.pem 2048
openssl rsa -in ci_com.pem -pubout > ci_com_pub.pem
pwgen -1 -N 1 32 > session_secret
scp polytech:/etc/{passwd,group} .
```

Fichier par défaut : `config.js`
```javascript
module.exports = {
    port: 8173
};
```

Fichier par défaut : `db.js`
```javascript
module.exports = {
    url: 'mongodb://localhost/ci-site'
};
```

Fichier par défaut : `sshAuth.js`
```javascript
module.exports = {
	host: '', // Serveur de login. Consulter le TWiki pour plus de détails
	port: 22
};
```

##Mise en marche

```bash
npm install
npm install -g bower
bower install
node server.js
```
