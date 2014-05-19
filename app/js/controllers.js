var myAppModule = angular.module("myApp", []);
myAppModule.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
myAppModule.controller("HelloController",
    function($scope) {
        $scope.greeting = {text: 'Hello'};
})
.controller("CartController",
    function($scope) {
        $scope.bill = {};

        $scope.items = [
            {title: 'Paint pots', quantity: 8, price: 2},
            {title: 'Polka dots', quantity: 17, price: 10},
            {title: 'Pebbles', quantity: 5, price: 20}
        ];

        $scope.remove = function (index) {
            $scope.items.splice(index, 1);
        };

        $scope.totalCart = function() {
            var total = 0;
            for (var i = 0, len = $scope.items.length; i < len; i ++) {
                total = total + $scope.items[i].price * $scope.items[i].quantity;
            }
            return total;
        };

        $scope.subtotal = function(){
            return $scope.totalCart() - $scope.bill.discount;
        };

        function calculateDiscount(newValue, oldValue, $scope) {
            $scope.bill.discount  = newValue > 100 ? 10 : 0;
        }

        $scope.$watch($scope.totalCart, calculateDiscount);
})
.controller("SolrController",
    function($scope, $http) {

        $scope.queries = [
            "*.*",
            "type:event"
        ];
        $scope.current = {
            query: "*.*",
            data: "",
            host: "qa01.d"
        };
        $scope.previous = {
            query: "",
            data: "",
            host: ""
        };

        $scope.makeSolrRequest = function() {
            if ($scope.queries.indexOf($scope.current.query) == -1) {
                $scope.queries.push($scope.current.query);
            }
            //$http.get("http://localhost:8983/solr/collection1/select?q=id%3A%22IW-02%22&wt=json&indent=true").
            var userId = Math.floor(Math.random()*10 + 1);
            $http.get("http://jsonplaceholder.typicode.com/posts?userId="+ userId).
                success(function (data, status, headers, config){
                    $scope.previous.data = $scope.current.data;
                    $scope.current.data = data;
                    $.JSONView(data, 'jsonoutput');
                    $.JSONView($scope.previous.data, 'jsonoutput-previous');
            }).error(function (data, status, headers, config) {
                    alert("Error:" + status +" data:" + data);
              });
        };
        $scope.clear = function(){
            $scope.current.query = "";
            $scope.current.host = "";
            $scope.current.data = "";
            $("#jsonoutput").html("");

            $scope.previous.query = "";
            $scope.previous.host= ";";
            $scope.previous.data = "";
            $("#jsonoutput-previous").html("");
        }
});