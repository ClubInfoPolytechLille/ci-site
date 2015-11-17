angular.module('nl2br', [])
    .filter('nl2br', function ($sce) { // From http://stackoverflow.com/questions/15449325/how-can-i-preserve-new-lines-in-an-angular-partial#15449549
        return function(text) {
            text = text.replace(/\n/g, '<br />');
            return $sce.trustAsHtml(text);
        }
});
