app.controller("historyCtrl", function ($scope) {
    $scope.queries = [];
    $scope.moment = window.moment;

    $.ajax(apiUrl + '/query/history', { method: 'GET', contentType: 'application/json' }).success(function (response) {
        if (response.status === 'ok') {
            $scope.queries = response.queries;
            $scope.$apply();
        }
    }).fail(function () {
        toastr.error('Failed fetching queries');
    });
});