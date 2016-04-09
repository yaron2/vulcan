app.controller("newDatabaseModalCtrl", function ($scope, $rootScope) {
    $scope.name = "";
    $scope.server = "";
    $scope.admin = "";
    $scope.password = "";

    $scope.done = function (configFrm) {
        if (configFrm.$valid) {
            var db = {
                name: $scope.name,
                server: $scope.server,
                admin: $scope.admin,
                password: $scope.password
            }

            $.ajax(apiUrl + '/databases', { method: 'POST', contentType: 'application/json', data: JSON.stringify(db) }).success(function (response) {
                if (response.status === 'ok') {
                    toastr.success('Database created');
                    $rootScope.$emit('databaseAdded');
                }                   
                else
                    toastr.error(response.errorMessage);
            }).fail(function () {
                toastr.error('Failed creating database');
            });
        }
    }
});