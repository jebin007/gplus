
(function () {
    'use strict';

    angular
        .module('thinkster.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', '$http', 'Snackbar'];


    function Authentication($cookies, $http, Snackbar) {

        var Authentication = {
            login: login,
            logout: logout,
            register: register,

            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate
        };

        return Authentication;

        //////////////////////

        function register(email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email
            }).then(registerSuccessFn, registerErrorFn);


            function registerSuccessFn(data, status, headers, config) {
                Authentication.login(email, password)
            }

            function registerErrorFn(data, status, header, config) {
                console.error('Epic Failure!');
            }
        }

        function login(email,password) {
            return $http.post('/api/v1/auth/login/', {
                email: email, password: password
            }).then(loginSuccessFn, loginErrorFn);


            function loginSuccessFn(data, status, headers, config) {
            Authentication.setAuthenticatedAccount(data.data);

            window.location = '/';
            }

            function loginErrorFn(data, status, headers, config) {
                Snackbar.error('Invalid Credentials Provided!! Please Login Again!')
                console.error('Epic Failure!!!');

            }
        }

        function logout() {
            return $http.post('api/v1/auth/logout/')
                .then(logoutSuccessFn, logoutErrorFn);

            function logoutSuccessFn(data, status, headers, config){
                Authentication.unauthenticate();

                window.location = '/'
            }

            function logoutErrorFn(data, status, headers, config) {
                console.error('Epic Failure!!');
            }
        }

        function getAuthenticatedAccount() {
            if (!$cookies.authenticatedAccount) {
                return;
            }

            return JSON.parse($cookies.authenticatedAccount);
        }

        function isAuthenticated() {
            return !!$cookies.authenticatedAccount;
        }

        function setAuthenticatedAccount(account) {
            $cookies.authenticatedAccount = JSON.stringify(account);
        }

        function unauthenticate() {
            delete $cookies.authenticatedAccount;
        }
    }
})();