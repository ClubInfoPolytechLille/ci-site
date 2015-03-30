angular.module('SessionsServ', []).service('SessionService', ['$http', 'EncryptService',
  function ($http, EncryptService) {
    a = {
      cur: false,
      status: 0,
      changeHandlers: [],
      onChange: function (fun) {
        this.changeHandlers.push(fun);
      },
      triggerChange: function () {
        for (var fun in this.changeHandlers) {
          this.changeHandlers[fun]();
        }
      },
      updateSessionInfos: function (data) {
        console.log("Connection:", data);
        if (typeof data === 'object') {
          this.cur = data;
        } else {
          this.cur = false;
        }
        this.triggerChange();
      },
      get: function (cb) { // Fetch infos if needed
        if (status === 0) {
          this.status = 1; // Fetching
          _this = this;
            // TODO Verify if cookies to prevent uneeded request
          $http.get('/api/session').success(function (body) {
            _this.updateSessionInfos(body);
            if (cb) {
              if (this.logged) {
                cb(null);
              } else {
                cb(body);
              }
            }
          });
        } else {
          console.warn("Unnecessary get() call");
        }
      },
      connect: function (login, pass, cb) {
        _this = this;
        data = JSON.stringify({
          login: login,
          pass: pass
        });
        EncryptService.encrypt(data, function (dataCrypt) {
          $http.post('/api/session', [dataCrypt]).success(function (body) {
            _this.updateSessionInfos(body);
            if (cb) {
              if (this.logged) {
                cb(null);
              } else {
                cb(body);
              }
            }
          });
        });
      },
      disconnect: function () {
        this.updateSessionInfos(false);
        $http.delete('/api/session');
      }
    };
    a.get();
    return a;
  }
]);
