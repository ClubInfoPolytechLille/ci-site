angular.module('MessEditDrct', ['ngSanitize', 'btford.markdown'])
    .directive('messEdit', function () {
        return {
            templateUrl: 'views/messEdit.html'
        };
    })
    .directive('messViewsource', function () {
        return {
            templateUrl: 'views/messViewsource.html'
        };
    });
