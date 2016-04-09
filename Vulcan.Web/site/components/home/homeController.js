app.controller("homeCtrl", function ($scope, $rootScope) {
    $scope.databases = 0;
    $scope.tables = 0;
    $scope.queries = 0;
    
    $scope.addNew = function () {
        $scope.$emit('newDatabase');
    }
    
    $rootScope.$on('databaseAdded', function (event, args) {
        getDatabases();
    });
    
    function getDatabases() {
        $.ajax(apiUrl + '/databases', { method: 'GET', contentType: 'application/json' }).success(function (response) {
            if (response.status === 'ok') {
                $scope.databases = response.databases.length;
                
                for (var t in response.databases.length) {
                    var db = response.databases[t];
                    
                    if (db.tables)
                        $scope.tables = $scope.tables + db.tables.length;
                }
                
                $scope.$apply();
            }
        }).fail(function () {
            toastr.error('Failed fetching databases');
        });
    }
    
    function getQueries() {
        $.ajax(apiUrl + '/query/history', { method: 'GET', contentType: 'application/json' }).success(function (response) {
            if (response.status === 'ok') {
                $scope.queries = response.queries.length;
                $scope.$apply();
            }
        }).fail(function () {
            toastr.error('Failed fetching queries');
        });
    }
    
    getQueries();
    getDatabases();
});