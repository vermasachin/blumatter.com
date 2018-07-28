/* * ************************************************************ 
 * Date: 4 Jan, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file controllers.js
 * *************************************************************** */

var app = angular.module('skyline',[ 'infinite-scroll']);

var formatDate = function(d){
    var d1 = new Date(d), y = d1.getFullYear(), m = d1.getMonth()+1, d = d1.getDate();
    return y+"-"+(m < 10 ? "0" : "")+m+"-"+(d<10 ? "0" : "")+d;
};

var formatTime = function(d){
    var s = (new Date().getTime() - new Date(d).getTime())/1000;
    var h = parseInt(s/3600), m = parseInt(s%3600/60), sec = parseInt(s%60);
    var r = (h ? h+"h " : "")+(m ? m+"m " : "");
    if(!r && sec) r = "Few moments";
    r += " ago";
    return r;
};

app.controller("messageCtrl",["$scope",'msgService',function($scope,msgService){
    $scope.message = "";
    
    $scope.hide = function(){
        msgService.unset();
    };
    $scope.$watch(function(){
        return msgService.get();
    },function(m){
        $scope.message = m;
    });
}]);

app.controller("error",["$scope",'$rootScope',function($scope,$rootScope){
    $scope.info = {};
    $scope.close = function(){
        $scope.info = {};
        $('#errorModal').modal('hide') ;
    };
    $rootScope.error = function(title,message){
        $('#errorModal').modal('show') ;
        $scope.info = {
            title : title, message : message
        };
    };
}]);

app.controller("sidebar",['$scope', 'sidebar',function($scope, sidebar){
    $scope.$watch(function(){
        return sidebar.get();
    }, function(val){
        $scope.items = val;
    }); 
}]);

app.controller("loader",['$scope', 'loader',function($scope, loader){
    $scope.show = false;
    
    $scope.$watch(function(){
        return loader.get();
    }, function(val){
        $scope.show = val;
    }); 
}]);

app.controller("designer",['$scope', 'loader','$http', 'cart',function($scope, loader,$http, cart){
    $scope.types = {
        offgrid : "Off-Grid", ongrid : "On-Grid", hybrid : "Hybrid"
    };
    $scope.sortkeys = {
        cost : 'Price', valueformoney : "Value for Money", relevance : 'Relevance'
    };
    $scope.sortkey = 'relevance';
    
    $scope.applications = {
        'home-no-grid' : { name : "Home - No-Grid", ophours : 24, backuphrs : 16 },
        'home-grid' : { name : "Home - With Grid", ophours : 24, backuphrs : 6 },
        'office-grid' : { name : "Office - With Grid", ophours : 12, backuphrs : 3 },
        "office-no-grid" : { name : "Office - No Grid", ophours : 12, backuphrs : 5 }
    };
    
    $scope.inputs = {
        "type" : "offgrid",
        "dailyunits" : 12,
        "backupkw" : 500,
        "backuphrs" : 6,
        "loadmax" : 3000,
        "filter" : true,
        "autobackupcalc" : true,
        "useinverterbattery" : false,
        "application" : 'home-grid'
    };
    $scope.autobackupcalc = true;
    
    
    $scope.results = [];
    
    $scope.updateBackup = function(){
        if($scope.inputs.autobackupcalc){
            var ophrs = $scope.applications[$scope.inputs.application].ophours;
            $scope.inputs.backupkw = Math.ceil($scope.inputs.dailyunits * 1000 / ophrs);
            $scope.inputs.backuphrs = $scope.applications[$scope.inputs.application].backuphrs;
        }
    };
    
    $scope.updateBackup();
    
    $scope.design = function(){
        loader.show();
        $http(api.design($scope.inputs)).then(function(res){
            $scope.results = res.data;
            $scope.sort();
            loader.hide();
        },function(){
            loader.hide();
        });
    };
    
    $scope.sort = function(){
        $scope.results.sort(function(a,b){
            return a.ranks[$scope.sortkey] - b.ranks[$scope.sortkey];
        });
    };
    
    $scope.addToCart = function(solution){
        var l = solution.cart.length, done = 0;
        loader.show();
        $http(api.appMulipleToCart(solution.cart)).then(function(res){
            loader.hide();
            window.location.href = "/cart";
        });
    };
}]);

app.controller("cart",['$scope', 'view','$http', 'cart','user',function($scope, view,$http, cart,user){
    $scope.items = [];
    $scope.user = null;
    $scope.total = 0;
    $scope.totalmargin = 0;
    $scope.payError = "";
    $scope.cities = [];
    $scope.visibleCities = [];
    $scope.showCitySuggest = false;
    $scope.freight = null;
    $scope.totalfreight = 0;
    $scope.checkoutWanted = false;
    $scope.page = 0;
    
    $("#cart .breadcrumb li[data-show]").click(function(){
        var id = $(this).attr("data-show"), idx = 0;
        var lis = $("#cart .breadcrumb li");
        lis.each(function(i){
            var idt = $(this).attr("data-show");
            if(idt && id === idt){
                idx = i;
            }
        });
        lis.each(function(i){
            if(i < idx){
                $(this).addClass("done").removeClass("active");
            }else if(i === idx){
                $(this).removeClass("done").addClass("active");
            }else{
                $(this).removeClass("done").removeClass("active");
            }
        });
        $(".cartsection").each(function(){
            if($(this).attr("id") === id){
                $(this).fadeIn(100);
            }else{
                $(this).fadeOut(100);
            }
        });
    });
    
    $scope.$watch(function(){
        return user.get();
    }, function(val){
        $scope.user = user;
        if(val && $scope.checkoutWanted){
            window.location.href = "/checkout";
        }
    });
    
    $scope.checkout = function(){
        $scope.checkoutWanted = true;
        if(!user.get()){
            user.requireLogin();
        }else{
            window.location.href = "/checkout";
        }
    };
    
    $http(api.cities("")).then(function(res){
        $scope.cities = res.data;
    });
    
    var getFreight = function(){
        if($scope.user && $scope.user.pincode && $scope.user.pincode.match(/\d{6}/)){
            $http(api.getFreight($scope.user.pincode)).then(function(res){
                $scope.freight = res.data;
                $scope.totalfreight = 0;
                if($scope.freight && $scope.freight.length){
                    $scope.freight.forEach(function(f){
                        $scope.totalfreight += f.freight;
                    });
                }
                refreshTotal();
            });
        }
    };
    
    var refreshTotal = function(){
        $scope.total = 0; $scope.totalmargin = 0;
        $scope.items.forEach(function(i){
            $scope.total += parseFloat(i.totalitemprice);
            $scope.totalmargin += parseFloat(i.margin) * i.qty;
        });
        $scope.total += $scope.totalfreight;
    };
    
    cart.load();
    
    $scope.showInfo = function(){
        $('#infoModal').modal();
    };
    
    $scope.showCities = function(){
        $scope.visibleCities = $scope.cities.filter(function(c){ return c.city.indexOf($scope.user.city) > -1 ? c : null; });
        $scope.visibleCities = $scope.visibleCities.slice(0,4);
        if($scope.visibleCities.length){
            $scope.showCitySuggest = true;
        }else{
            $scope.showCitySuggest = false;
        }
    };
    
    $scope.selectCity = function(city){
        $scope.user.city = city.city;
        $scope.user.pincode = city.pincode;
        $scope.showCitySuggest = false;
        getFreight();
    };
    
    $scope.$watch(function(){
        return cart.get();
    }, function(val){
        $scope.items = val;
        getFreight();
        refreshTotal();
    });
    
    $scope.removeItem = function(itemid){
        view.loader.show();
        $http(api.removeProduct(itemid)).then(function(data){
            view.loader.hide();
            cart.load();
        },function(){
            view.loader.hide();
        });
    };
    
    $scope.incrItem = function(itemid,qty){
        var q = parseInt(qty)+1;
        $scope.updateItem(itemid,q);
    };
    
    $scope.decrItem = function(itemid,qty){
        var q = parseInt(qty)-1;
        $scope.updateItem(itemid,q);
    };
    
    $scope.updateItem = function(itemid,q){
        var i = $scope.items.map(function(m){ return m.id; }).indexOf(itemid);
        $scope.items[i].qty = Math.max(1,q);
        view.loader.show();
        $http(api.changeCartQty(itemid,$scope.items[i].qty)).then(function(data){
            view.loader.hide();
            cart.load();
        },function(){
            view.loader.hide();
        });
    };
    
    $scope.incrDiscount = function(itemid,qty){
        var q = parseInt(qty)+1;
        $scope.updateDiscount(itemid,q);
    };
    
    $scope.decrDiscount = function(itemid,qty){
        var q = parseInt(qty)-1;
        $scope.updateDiscount(itemid,q);
    };
    
    $scope.updateDiscount = function(itemid,discount){
        var i = $scope.items.map(function(m){ return m.id; }).indexOf(itemid);
        $scope.items[i].discountgiven = Math.max(0,discount);
        view.loader.show();
        $http(api.setDiscount(itemid,$scope.items[i].discountgiven)).then(function(data){
            view.loader.hide();
            cart.load();
        },function(){
            view.loader.hide();
        });
    };
    
    $scope.emptyCart = function(){
        view.loader.show();
        $http(api.emptyCart()).then(function(){
            view.loader.hide();
            cart.load();
        },function(){
            view.loader.hide();
        });
    };
    
    $scope.addToCart = function(id){
        $http(api.addToCart(id)).then(function(){
            cart.load();
        });
    };
    
    var checkForm = function(){
        if(!$scope.user.name){
            return "Name field is empty";
        }
        if(!$scope.user.houseno){
            return "House No. field is empty";
        }
        if(!$scope.user.street){
            return "Street cannot be empty";
        }
        if(!$scope.user.locality){
            return "Locality cannot be empty";
        }
        if(!$scope.user.city){
            return "City cannot be empty";
        }
        var cities = $scope.cities.map(function(c){ return c.city;});
        if(cities.indexOf($scope.user.city) < 0){
            return "Your city is not supported for delivery, please call us for placing order.";
        }
        if(!$scope.user.pincode){
            return "Pincode cannot be empty";
        }
        if(!$scope.user.pincode.match(/^\d{6}$/)){
            return "Pincode value is invalid";
        }
        if(!$scope.user.email || !$scope.user.email.match(/[a-zA-Z0-9]{2,}@[a-zA-Z0-9\.]{5,}/)){
            return "Email is invalid";
        }
        if($scope.user.mobile.indexOf(" ") > 0){
            $scope.user.mobile = $scope.user.mobile.replace(/ /g,'');
        }
        if(!$scope.user.mobile || !$scope.user.mobile.match(/\d{10,}/)){
            return "Mobile number is invalid";
        }
        return false;
    };
    
    
    $scope.pay = function(){
        $scope.payError = null;
        var hasError = checkForm();
        if(hasError){
            $scope.payError = hasError;
            return false;
        }
        view.loader.show();
        var address = $scope.user.name + " \n" +
                      $scope.user.houseno + "," + $scope.user.street + "\n" +
                      $scope.user.locality + " \n" + $scope.user.landmark + "\n" +
                      $scope.user.city + ", " + $scope.user.pincode + "\n" +
                      "Phone : "+ $scope.user.mobile;
        $http(api.createOrder($scope.items,address,$scope.user.pincode,$scope.total)).then(function(res){
            if(res.data && res.data.ok && res.data.orderid){
                $http(api.emptyCart()).then(function(){
                    cart.load();
                    $("input#ORDER_ID").val(res.data.orderid);
                    $("input#TXN_AMOUNT").val($scope.total);
                    $("input#MOBILE_NO").val($scope.user.mobile);
                    $("input#EMAIL").val($scope.user.email);
//                    $("input#CHECKSUM").val($scope.user.email);
                    $("#payform").submit();
                });
            }else{
                $scope.payError = res.data.error || "Failed to create order";
            }
        },function(res){
            $scope.payError = res.data;
        });
    };
    
    var getUser = function(){
        $http(api.currentUser()).then(function(res){
            if(res.data && res.data.user){
                $scope.user = res.data.user;
                getFreight();
            }
        });
    };
    
    getUser();
}]);

app.controller("loginRegister",['$scope' ,'user',function( $scope,  user){
    $scope.loginError = "";
    $scope.user = null;
    $scope.login = {
        email : "", password : ""
    };
    $scope.show = 'login';
    
    $scope.$watch(function(){
        return user.get();
    }, function(val){
        $scope.user = val;
    });
    
    $scope.showModal = function(){
        $('#registerLogin').modal();
    };
    
    $scope.dologin = function(){
        $scope.loginError = "";
        user.doLogin($scope.login.email,$scope.login.password,function(err,user){
            if(err){
                $scope.loginError = err;
            }else{
                $scope.user = user;
                doRedirect();
            }
        });
    };
    
    /// Regsiter Section
    $scope.regError = "";
    $scope.registerSuccess = false;
    
    $scope.register = function(){
        user.register($scope.email,$scope.name,$scope.mobile,$scope.password,function(err,user){
            if(err){
                $scope.regError = err;
            }else{
                $scope.registerSuccess = true;
                $scope.show = 'login';
            }
        });
    };
    
    $scope.logout = function(){
        user.logout(function(){
            window.location.reload();
        });
    };
}]);

app.controller("emulateOrderPaid",function(){
    setTimeout(function(){
        $("form#confirm").submit();
    },500);
});

app.controller("orders", ["$scope", "view", "$http", function($scope,view,$http){
    $scope.orders = [];
    $scope.load = function(){
        view.loader.show();
        $http(api.listOrders()).then(function(res){
            $scope.orders = res.data.data;
        });
    };
    $scope.load();
}]);


app.controller("loadcalc", [ "$scope", function($scope){
    $scope.totalunits = 0;
    $scope.totalload = 0;
    
    $scope.items = [];
    
    $scope.products = [
        { name  : "Ceiling Fan", load : 70, hours : 16, image : "ceiling-fan.jpg", count : 2},
        { name  : "Gorilla Fan", load : 24, hours : 16, image : 'gorilla-fan.jpg', count : 2},
        { name  : "Small Cooler", load : 120, hours : 8, image : "smallcooler.jpg", count : 1},
        { name  : "Large Cooler", load : 300, hours : 8, image : "largecooler.jpg", count : 1},
        { name  : "Fridge", load : 400, hours : 12, image : "fridge.jpg", count : 1},
        { name  : "10W LED", load : 10 , hours : 5, image : 'led-light.jpg', count : 4},
        { name  : "5W LED", load : 5,  hours : 5,image : "led-light.jpg", count : 4},
        { name  : "15W LED", load : 15, hours : 5, image : "led-light.jpg", count : 4},
        { name  : "20W LED", load : 20,  hours : 5 ,image : "led-light.jpg", count : 4},
        { name  : "LED TubeLight", load : 16, hours : 5, image : "led-tubelight.jpg", count : 2},
        { name  : "TubeLight", load : 50, hours : 5, image : "old-tubelight.jpg", count : 2},
        { name  : "CRT TV", load : 70, hours : 2, image : "crttv.jpg", count : 1},
        { name  : "LED TV", load : 40, hours : 2, image : "ledtv.jpg", count : 1},
        { name  : "PC", load : 120, hours : 5, image : "pc.jpg", count : 1},
        { name  : "1hp Pump", load : 1500, hours : 1, image : "pump.jpg", count : 1},
        { name  : "2hp Pump", load : 3000, hours : 1, image : "pump.jpg", count : 1},
        { name  : "0.5 hp Pump", load : 700, hours : 1, image : "pump.jpg", count : 1},
        { name  : "Laptop", load : 25, hours : 5, image : "laptop.jpg", count : 1}
    ];
    
    var w = $("svg").parent().width();
    $('svg').attr("width",w-100).attr("height", Math.min(w-100,600)).css("margin-left", 50);
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        radius = ( Math.min(width, height) - 200 ) / 2,
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    color.domain($scope.products.map(function(d){ return d.name; }));

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {return d.units; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
	    .outerRadius(radius + 30)
	    .innerRadius(radius + 10);
    
    var renderPie = function( data) {
        g.selectAll(".arc").remove();
        var arc = g.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) { return color(d.data.name);});
        arc.append("text")
            .attr("transform", function(d) { 
                var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
	  	return "translate(" + label.centroid(d)[0] + "," + label.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
            .attr('text-anchor','middle')
            .text(function(d) { return d.data.name; });
    };
    
    $scope.updateTotals = function(item){
        if(item){
            if(item.hours > 24){
                item.hours = 24;
            }
            item.units =  Math.ceil(item.load * item.count * item.hours / 10 ) / 100 ;
            item.totalw = item.load * item.count;
        }
        $scope.totalload = 0;
        $scope.totalunits = 0;
        for(var i=0;i< $scope.items.length;i++){
            $scope.totalunits += $scope.items[i].units;
            $scope.totalload += $scope.items[i].totalw;
        }
        $scope.totalunits = Math.ceil( $scope.totalunits * 100 ) / 100;
        $scope.v = Math.ceil( $scope.totalload * 100 ) / 100;
        
        renderPie($scope.items);
    };
    
    $scope.addItem = function(p){
        var i = {
            load : p.load, count : p.count, hours : p.hours, name : p.name, image : p.image
        };
        $scope.items.push(i);
        $scope.updateTotals(i);
    };
    
    $scope.remove = function(idx){
        $scope.items.splice(idx,1);
        $scope.updateTotals();
    };
    
    var preadd = [0,4, 5,12];
    for(var i=0;i< preadd.length;i++){
        $scope.addItem($scope.products[preadd[i]]);
    }
        
}]);

app.controller("profitcalc",[ "$scope", function($scope){
    $scope.cost = 100000;
    $scope.pv = 1000;
    $scope.type = 'ongrid';
    $scope.unitprice = 8;
    $scope.emiinterest = 0;
    $scope.emiyears = 5;
    $scope.totalprofit = 0 ;
    $scope.profits = [];
    $scope.tableidx = [1,2,3,4,5,6,7,8,9,10,11,12];
    
    var pmt = function(rate, nperiod, pv, fv, type) {
        if (!fv) fv = 0;
        if (!type) type = 0;

        if (rate === 0) return -(pv + fv)/nperiod;

        var pvif = Math.pow(1 + rate, nperiod);
        var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

        if (type === 1) {
            pmt /= (1 + rate);
        };

        return pmt;
    };
    var unitperkw = 5;
    var years = 25;
    
    
    var w = $("svg").parent().width();
    var margin = 50;
    var width = w , height = Math.min(w ,450);
    $('svg').attr("width",w).attr("height", Math.min(w,600)).css("margin-top" , "30px");
    
    var createChart = function(data){
        var barwidth = width/years/2;
        var svg = d3.select("svg");
        svg.selectAll("g").remove();
        var xscale = d3.scaleLinear().range([barwidth ,width-margin*2]).domain([1,years]);
        var yscale = d3.scaleLinear().range([height-margin,margin]).domain([ Math.min(0,d3.min(data)),Math.max(0,d3.max(data))]);
        var xaxis = d3.axisBottom(xscale).ticks(years).tickFormat(function(d){ return "Year " + d;});
        var yaxis = d3.axisLeft(yscale).ticks(10).tickFormat(function(d){ return "Rs" + d;});
        
        svg.append("g").attr('transform', 'translate('+margin+', '+yscale(0)+')')
            .classed('x axis', true)
            .call(xaxis).selectAll("text").attr("y", 0).attr("x", function(d){ return data[d - 1] < 0 ? -25 : 25;})
            .attr("dy", ".35em").attr("transform", "rotate(90)");
    
        svg.append("g").attr("transform", "translate("+margin +",0)").classed("y axis", true).call(yaxis);
        
        var bars = svg.selectAll(".bar").data(data).enter().append("g");
    
        bars.attr('class',function(d){ return d > 0 ? "bar positive" : "bar negative"; } );
        bars.attr("transform", function(d,i){ 
            return "translate ("+ (margin + xscale(i+1)) +", "+ yscale(0) +")"; 
        });
    
        bars.append("rect").attr("width", barwidth)
            .attr("y", function(d){ return d > 0 ? -(yscale(0) - yscale(d)) : 0 ;} )
            .attr("x", - barwidth / 2)
            .attr("height", function(d){ return d > 0 ? yscale(0) - yscale(d) : yscale(d) - yscale(0); });
    
    };
    
    $scope.update = function(){
        $scope.profits = [];
        $scope.totalprofit = 0;
        $scope.emiinterest = parseInt($scope.emiinterest);
        $scope.cost = parseInt($scope.cost);
        $scope.pv = parseInt($scope.pv);
        $scope.emiyears = parseInt($scope.emiyears);
        $scope.unitprice = parseInt($scope.unitprice);
        console.log($scope.profits, $scope.totalprofit, $scope.emiinterest, $scope.cost, $scope.pv, $scope.emiyears, $scope.unitprice);
        var emi = Math.round(pmt($scope.emiinterest/1200,$scope.emiyears*12, $scope.cost,0,0),1);
        for(var i=1;i <= years;i++){
            var unitsperyear = unitperkw * $scope.pv / 1000 * 365 / (Math.pow(1.008, i - 1));
            var emicost = i <= $scope.emiyears ? emi * 12 : 0;
            var energyvalue = unitsperyear * $scope.unitprice;
            var profitloss = emicost + energyvalue;
            $scope.profits.push( Math.ceil(profitloss));
            $scope.totalprofit += Math.ceil(profitloss);
        }
        createChart($scope.profits);
    };
    
    $scope.update();
    
}]);

app.controller("orderTracking",["$scope", "view", "$http", function($scope,view,$http){
    var m = window.location.pathname.match(/orders\/(.*)\/tracking/);
    $scope.orderid = m[1];
    $scope.trackers = [];
    $scope.logistics = [];
    $scope.load = function(){
        view.loader.show();
        $http(api.getTrackers($scope.orderid)).then(function(res){
            $scope.trackers = res.data;
        });
        $http(api.logistics()).then(function(res){
            $scope.logistics = res.data;
        });
    };
    $scope.load();
    
    $scope.add = function(){
        $http(api.addTracker($scope.orderid,$scope.logisticid,$scope.trackingid)).then(function(){
            $scope.load();
        });
    };
    $scope.remove = function(trackerid){
        $http(api.remoteTracker($scope.orderid,trackerid),function(res){
            $scope.load();
        });
    };
}]);