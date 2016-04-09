var app = angular.module('vulcanapp', ['ngRoute', 'angularModalService']);
var apiUrl = "/api";
var loggedInUser;

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/home', {
            templateUrl: 'components/home/homeView.html',
            controller: 'homeCtrl'
        }).
            when('/', {
            templateUrl: 'components/home/homeView.html',
            controller: 'homeCtrl'
        }).
            when('/query', {
            templateUrl: 'components/query/queryView.html',
            controller: 'queryCtrl'
        }).
            when('/query', {
            templateUrl: 'components/query/queryView.html',
            controller: 'queryCtrl'
        }).
            when('/databases', {
            templateUrl: 'components/databases/databasesView.html',
            controller: 'databasesCtrl'
        }).
            when('/tables', {
            templateUrl: 'components/tables/tablesView.html',
            controller: 'tablesCtrl'
        }).
            when('/history', {
            templateUrl: 'components/history/historyView.html',
            controller: 'historyCtrl'
        }).
            when('/database/:id', {
            templateUrl: 'components/database/databaseView.html',
            controller: 'databaseCtrl'
        });
    }]).run(run);

run.$inject = ['$rootScope', '$location', '$http'];
function run($rootScope, $location, $http) {
    // keep user logged in after page refresh
    tryLogin();
    
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var loginPage = location.href.indexOf('login') > -1;
        var loggedIn = tryLogin();
        if (!loggedIn && !loginPage) {
            location.href = document.location.origin + '/login.html';
        }
    });
}

app.directive("modalShow", function ($parse) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            
            //Hide or show the modal
            scope.showModal = function (visible, elem) {
                if (!elem)
                    elem = element;
                
                if (visible)
                    $(elem).modal("show");
                else
                    $(elem).modal("hide");
            }
            
            //Watch for changes to the modal-visible attribute
            scope.$watch(attrs.modalShow, function (newValue, oldValue) {
                scope.showModal(newValue, attrs.$$element);
            });
            
            //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
            $(element).bind("hide.bs.modal", function () {
                $parse(attrs.modalShow).assign(scope, false);
                if (!scope.$$phase && !scope.$root.$$phase)
                    scope.$apply();
            });
        }
    };
});

function tryLogin() {
    var userUnparsed = localStorage.getItem("vulcanuser");
    if (!userUnparsed || userUnparsed === "undefined")
        return false;

    loggedInUser = JSON.parse(userUnparsed);
    if (loggedInUser) {
        $.ajaxSetup({
            headers: {
                'x-access-token': loggedInUser.token
            }
        });
    }

    return true;
}