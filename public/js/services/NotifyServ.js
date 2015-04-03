angular.module('NotifyServ', []).service('NotifyServ', [
    function () {
        return {
            notify: function (type, message) {
                $.notify({
                    message: message
                }, {
                    type: type,
                    animate: {
                        enter: 'animated bounceInDown',
                        exit: 'animated bounceOutUp'
                    }
                });
            },
            success: function (message) {
                this.notify('success', message);
            },
            info: function (message) {
                this.notify('info', message);
            },
            warn: function (message) {
                this.notify('warning', message);
            },
            error: function (context, error) {
                this.notify('danger', context);
                console.error(context, error);
            }
        };
    }
]);
