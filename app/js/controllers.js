var myAppModule = angular.module("myApp", []);
myAppModule.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
myAppModule.controller("SolrController",
    function($scope, $http) {

        $scope.queries = [
            "*:*",
            "inStock: true",
            "manu_id_s: maxtor",
        ];
        $scope.hosts = [
            "localhost"
        ];
        $scope.cores = [
            "uk_en",
            "us_en"
        ];

        var parsedUrl = jQuery.url(window.location);
        var initialQuery = parsedUrl.param("query") || $scope.queries[0];
        var initialHost = parsedUrl.param("host") || $scope.hosts[0];
        var initialCore = parsedUrl.param("core") || $scope.cores[0];

        clearState();

//        var userId = Math.floor(Math.random()*10 + 1);
//        $http.get("http://jsonplaceholder.typicode.com/posts?userId="+ userId).
        $scope.makeSolrRequest = function(query, host, core) {
            pushDistinct(query, $scope.queries);
            pushDistinct(host, $scope.hosts);
            pushDistinct(core, $scope.cores);

            var params = jQuery.param({
                q: query,
                rows: 50,
                wt: "json",
                'json.wrf': "JSON_CALLBACK",
                indent: true
            });

            $http.jsonp("http://" + host + ":8983/solr/" + core + "/select?" + params)
              .success(function (data, status, headers, config){
                    pushToHistory($scope.current, $scope.history);

                    $scope.current.data = data.response;
                    $scope.current.title = $scope.current.query + " on " + $scope.current.host + "/" + $scope.current.core;

                    $.JSONView(data.response, 'jsonoutput', false);
                    $.JSONView($scope.history[0].data, 'jsonoutput-previous', false);
            }).error(function (data, status, headers, config) {
                    alert("Error:" + status +" data:" + data);
              });
        };

        $scope.rerunHistoryHead = function() {
           $scope.history.shift();
           var historyHead = $scope.history.shift();
           alert(historyHead.query);
           $scope.makeSolrRequest(historyHead.query, historyHead.host, historyHead.core)
        };

        $scope.clear = function(){
            clearState();
            $("#jsonoutput").html("");
            $("#jsonoutput-previous").html("");
        };

        function clearState() {
            $scope.current = {
                host: initialHost,
                core: initialCore,
                query: initialQuery,
                data: "",
                title: ""
            };
            $scope.historyTitle = "';"
            $scope.history = [
                {
                    host:"",
                    core: "",
                    query: "",
                    data: "",
                    title: ""
                }
            ];
        }
    });
