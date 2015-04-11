angular.module('NotifyServ', [])
    .service('NotifyServ', function () {
        $.notifyDefaults({
            placement: {
                from: 'bottom',
                align: 'left'
            },
            animate: {
                enter: 'animated bounceInUp',
                exit: 'animated bounceOutDown'
            },
            newest_on_top: false,
            showProgressbar: false,
            delay: 3000
        });
        return {
            notify: $.notify,
            info: function (message) {
                this.notify({
                    message: message
                }, {
                    type: 'info'
                });
            },
            success: function (message) {
                this.notify({
                    message: message
                }, {
                    type: 'success'
                });
            },
            warn: function (message) {
                this.notify({
                    message: message
                }, {
                    type: 'warning'
                });
                console.warn(message);
            },
            error: function (context, error) {
                if (!error) {
                    error = '';
                }
                this.notify({
                    title: context,
                    message: error
                }, {
                    type: 'danger'
                });
                console.error(context, error);
            },
            promise: function (message) {
                if (!message) {
                    message = "Opération en cours...";
                }
                var not = this.notify({
                    message: message
                }, {
                    delay: 0
                });
                return {
                    update: function (commands) {
                        not.update(commands);
                        $('[data-notify=message]', not.$ele).addClass('animated flash');
                    },
                    finally: function (commands) {
                        this.update(commands);
                        _this = this;
                        setTimeout(function () {
                            not.close();
                        }, $.notifyDefaults().delay);
                    },
                    success: function (message) {
                        this.finally({
                            message: message,
                            type: 'success'
                        });
                    },
                    warn: function (message) {
                        this.finally({
                            message: message,
                            type: 'warning'
                        });
                    },
                    error: function (context, error) {
                        if (!error) {
                            error = '';
                        }
                        commands = {
                            title: context,
                            message: error,
                            type: 'danger'
                        };
                        console.error(context, error);
                        this.finally(commands);
                    }
                };
            }
        };
    });
