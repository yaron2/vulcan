app.controller("databasesCtrl", function ($scope, $location) {
    $scope.databases = [];
    
    $scope.open = function (db) {
        $location.path('/database/' + db._id);
    }
    
    $scope.remove = function (db) {
        $.ajax(apiUrl + '/databases/' + db._id, { method: 'DELETE', contentType: 'application/json' }).success(function (response) {
            if (response.status === 'ok') {
                getDatabases();
            }
        }).fail(function () {
            toastr.error('Failed deleting database');
        });
    }
    
    function getDatabases() {
        $.ajax(apiUrl + '/databases', { method: 'GET', contentType: 'application/json' }).success(function (response) {
            if (response.status === 'ok') {
                $scope.databases = response.databases;
                $scope.$apply();
            }
        }).fail(function () {
            toastr.error('Failed fetching databases');
        });
    }

    getDatabases();
});