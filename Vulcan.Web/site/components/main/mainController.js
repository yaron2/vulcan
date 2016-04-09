app.controller("mainCtrl", function ($scope, $rootScope, $location, ModalService) {
    $scope.user = loggedInUser;
    $scope.notifications = [];
    
    if ($scope.user)
        showBody();

    $scope.$on('newTable', function (event, args) {
        $scope.newTable();
    });
    
    $scope.$on('newDatabase', function (event, args) {
        $scope.newDatabase();
    });
    
    $scope.$on('uploadData', function (event, args) {
        $scope.uploadData();
    });
    
    $scope.logout = function () {
        localStorage.removeItem("vulcanuser");
        $location.path('/login');
    }
    
    $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'open active' : '';
    }
    
    $scope.newTable = function () {
        ModalService.showModal({
            templateUrl: "components/tables/newTableModalView.html",
            controller: "newTableModalCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

            });
        });
    }
    
    $scope.uploadData = function () {
        ModalService.showModal({
            templateUrl: "components/upload/uploadView.html",
            controller: "uploadCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

            });
        });
    }

    $scope.newDatabase = function () {
        ModalService.showModal({
            templateUrl: "components/databases/newDatabaseModalView.html",
            controller: "newDatabaseModalCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

            });
        });
    }

    function showBody() {
        $('#containerWrapper').removeClass("hidden");
    }
});