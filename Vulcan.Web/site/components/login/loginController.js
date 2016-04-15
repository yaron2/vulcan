app.controller("loginCtrl", function ($scope, $location) {
    $scope.email = "";
    $scope.password = "";
    $scope.loginVisible = true;
    $scope.registerVisible = false;
    $scope.forgotPasswordVisible = false;
    
    $scope.regFirstname = "";
    $scope.regLastname = "";
    $scope.regEmail = "";
    $scope.regPassword = "";
    $scope.regRePassword = "";
    $scope.agreeTerms = false;
    
    $scope.register = function (form) {
        if (form.$valid) {
            var model = {
                firstname: $scope.regFirstname,
                lastname: $scope.regLastname,
                email: $scope.regEmail,
                password: $scope.regPassword
            }
            
            $.ajax('/auth/register', { method: 'POST', contentType: 'application/json', data: JSON.stringify(model) }).success(function (response) {
                if (response.status === 'ok') {
                    location.href = document.location.origin + '#/home';
                }
                else
                    toastr.error(response.errorMessage);
            });
        }
    }
    
    $scope.myFunc = function () {
        alert('lala');
    }

    $scope.login = function (form) {
        if (form.$valid) {
            var model = {
                email: $scope.email,
                password: $scope.password
            }
            
            $.ajax('/auth/login', { method: 'POST', contentType: 'application/json', data: JSON.stringify(model) }).success(function (response) {
                if (response.status === 'ok') {
                    $.ajaxSetup({
                        headers: {
                            'x-access-token': response.token
                        }
                    });
                    
                    $.ajax('/users', { method: 'GET', contentType: 'application/json' }).success(function (response) {
                        localStorage.setItem("vulcanuser", JSON.stringify(response.user));
                        location.href = document.location.origin + '#/home';
                    });
                }
                else
                    toastr.error(response.errorMessage);
            }).fail(function () {
                toastr.error('Wrong email or password');
            });
        }
    }
    
    $scope.showLogin = function () {
        $scope.forgotPasswordVisible = false;
        $scope.registerVisible = false;
        $scope.loginVisible = true;
    }
    
    $scope.showRegister = function () {
        $scope.forgotPasswordVisible = false;
        $scope.loginVisible = false;
        $scope.registerVisible = true;
    }
    
    $scope.showForgotPassword = function () {
        $scope.loginVisible = false;
        $scope.registerVisible = false;
        $scope.forgotPasswordVisible = true;
    }
});