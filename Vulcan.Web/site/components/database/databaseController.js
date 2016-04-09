app.controller("databaseCtrl", function ($scope, $routeParams, $location) {
    $scope.database = "";
    $scope.tables = [];

    function getDatabase() {
        $.ajax(apiUrl + '/databases/' + $routeParams.id, { method: 'GET', contentType: 'application/json' }).success(function (response) {
            if (response.status === 'ok') {
                $scope.database = response.database;
                $scope.$apply();
            }
        }).fail(function () {
            toastr.error('Failed fetching databases');
        });
    }
    
    function getDatabaseTables() {
        $.ajax(apiUrl + '/databases/' + $routeParams.id + '/tables', { method: 'GET', contentType: 'application/json' }).success(function (response) {
            if (response.status === 'ok') {
                sortTables(response.tables);
            }
        }).fail(function () {
            toastr.error('Failed fetching databases');
        });
    }
    
    function getTable(tablesCollection, tableName) {
        for (var t in tablesCollection) {
            var table = tablesCollection[t];
            if (table.name === tableName)
                return table;
        }
    }

    function sortTables(tables) {
        var tbls = [];
        
        for (var t in tables) {
            var table = tables[t];
            if (!getTable(tbls, table.TableName)) {
                var tbl = {
                    name: table.TableName,
                    columns: []
                }

                tbls.push(tbl);
            }
            else {
                var tbl = getTable(tbls, table.TableName);
                tbl.columns.push({
                    name: table.ColumnName,
                    type: table.DataType
                });

                tbls[tbls.indexOf(tbl)] = tbl;
            }
        }
        
        $scope.tables = tbls;
        $scope.$apply();
    }

    getDatabaseTables();
    getDatabase();
});