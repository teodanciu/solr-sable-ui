var myAppModule = angular.module("myApp", []);
myAppModule.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
myAppModule.controller("SolrController",
    function($scope, $http) {

        $scope.queries = [
            "*.*"
        ];
        $scope.hosts = [
            "localhost"
        ];

        var parsedUrl = jQuery.url(window.location);
        var initialQuery = parsedUrl.param("query") || $scope.queries[0];
        var initialHost = parsedUrl.param("host") || $scope.hosts[0];

        clearState();

//        var userId = Math.floor(Math.random()*10 + 1);
//        $http.get("http://jsonplaceholder.typicode.com/posts?userId="+ userId).
        $scope.makeSolrRequest = function(query, host) {
            pushDistinct(query, $scope.queries);
            pushDistinct(host, $scope.hosts);

            $http.jsonp("http://localhost:8983/solr/collection1/select?q=id%3A%22IW-02%22&indent=true&wt=json&json.wrf=JSON_CALLBACK")
              .success(function (data, status, headers, config){
                    $scope.previous.data = $scope.current.data;
                    $scope.previous.title = $scope.current.title;
                    $scope.previous.query = $scope.current.query;
                    $scope.previous.host = $scope.current.host;
                    $scope.current.data = data.response;
                    $scope.current.title = $scope.current.query + " on " + $scope.current.host;

                    $.JSONView(data.response, 'jsonoutput');
                    $.JSONView($scope.previous.data, 'jsonoutput-previous');
            }).error(function (data, status, headers, config) {
                    alert("Error:" + status +" data:" + data);
              });
        };
        $scope.clear = function(){
            clearState();
            $("#jsonoutput").html("");
            $("#jsonoutput-previous").html("");
        };

        function clearState() {
            $scope.current = {
                query: initialQuery,
                data: "",
                host: initialHost,
                title: ""
            };
            $scope.previous = {
                query: "",
                data: "",
                host: "",
                title: ""
            };
        }
    });
