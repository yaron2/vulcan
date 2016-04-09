app.controller("queryCtrl", function ($scope) {
    $scope.databases = [];
    $scope.selectedDb = "";
    
    $scope.recordset = "";
    $scope.error = "";

    var editor;

    $.ajax(apiUrl + '/databases', { method: 'GET', contentType: 'application/json' }).success(function (response) {
        if (response.status === 'ok') {
            $scope.databases = response.databases;
            $scope.$apply();
        }
    }).fail(function () {
        toastr.error('Failed fetching databases');
    });
    
    $scope.export = function () {
        JSONToCSVConvertor($scope.recordset.rows, 'Export', true);
    }

    $scope.search = function () {
        if (editor.getValue() && $scope.selectedDb) {
            $scope.error = "";

            var model = {
                query: editor.getValue(),
                databaseId: $scope.selectedDb._id
            }

            $.ajax(apiUrl + '/query', { method: 'POST', contentType: 'application/json', data: JSON.stringify(model) }).success(function (response) {
                if (response.status === 'error') {
                    $scope.recordset = "";
                    $scope.error = response.errorMessage;
                    $scope.$apply();
                }
                else {
                    processResults(response.recordset, response.timeInMS);
                }
            }).fail(function () {
                toastr.error('Failed sendin query');
            });
        }
    }
    
    function processResults(recordset, timeInMS) {
        $scope.recordset = {
            columns: Object.keys(recordset.columns),
            rows: recordset.rows,
            elapsed: timeInMS
        }
        
        $scope.$apply();
    }
    
    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        
        var CSV = '';
        //Set Report title in first row or line
        
        CSV += ReportTitle + '\r\n\n';
        
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";
            
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                if (index === "$$hashKey") {
                    continue;
                }
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }
            
            row = row.slice(0, -1);
            
            //append Label row with line break
            CSV += row + '\r\n';
        }
        
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                if (index === "$$hashKey") {
                    continue;
                }

                row += '"' + arrData[i][index] + '",';
            }
            
            row.slice(0, row.length - 1);
            
            //add a line break after each row
            CSV += row + '\r\n';
        }
        
        if (CSV == '') {
            alert("Invalid data");
            return;
        }
        
        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");
        
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    
        
        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;
        
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    setTimeout(function () {
        editor = ace.edit("sqleditor");
        editor.setTheme("ace/theme/sqlserver");
        editor.getSession().setMode("ace/mode/sqlserver");
        document.getElementById('sqleditor').style.fontSize = '20px';
    }, 20);
});