var express = require('express');
var router = express.Router();
var sql = require('msnodesql');
var util = require('util');
var querystring = require('querystring');

var cache = require('../node_modules/Cache');
/* GET home page. */

function clone(myObj){
  if(typeof(myObj) != 'object') return myObj;
  if(myObj == null) return myObj;
  
  var myNewObj = new Object();
  for(var i in myObj)
    myNewObj[i] = clone(myObj[i]);
  
  return myNewObj;
}
router.get('/', function(req, res) {
	
	//---------------------1
	//res.send(util.inspect(sql));
	//res.render('index', { title: 'Express' ,datas:["aa","bb","ccc"],username:req.params.username});
	//var conn_str="Driver={SQL Server Native Client 11.0};Server={.};Database={nodetest};uid=sa;PWD=123456;";
	//---------------------2
	var conn_str="Driver=SQL Server Native Client 11.0;Server=192.168.1.221;Database=fanhuansqlserver;uid=sa;PWD=123456;"
	var model={};
	sql.open(conn_str, function (err, conn) {
	    if (err) {
	        console.log('发生错误');
	        res.send('发生错误');
	    }
	    sql.queryRaw(conn_str, "select top 10 * from dbo.SignIn", function (err, results) {
	    	console.log(util.inspect(results));
	    	for(var i=0;i<results.meta.length;i++){
	    		var item=results.meta[i];
	    		var defaultValue;
	    		if(item.type="number")defaultValue=0;
	    		if(item.type="text")defaultValue="";
	    		if(item.type="date")defaultValue=Date.now;
	    		model[item.name]=defaultValue;
	    	}
	        //console.log("aaaa="+util.inspect(model));
	    	var datas=[];
	   		for(var i=0;i<results.rows.length;i++){
	    		var m=clone(model);
	   			var item=results.rows[i];
	   			var index=0;
	   			for(var propItem in m){
	   				m[propItem]=item[index];
	   				index++;
	   			}
	   			datas.push(m);
	   		}
			//res.send(util.inspect(datas));

	        if (err) {
	            //console.log(err);
	            res.send("asdfsadf="+err);
	        }else {
	        	//res.send(util.inspect(results));
	        	console.log(util.inspect(datas));
	        	res.render('index', { "title": 'Express' ,"datas":datas,"username":req.params.username});
	            // for (var i = 0; i < results.rows.length; i++) {
	            //     console.log(results.rows[i][0] + results.rows[i][1]);
	            // }
	        }
	    })

	})
	//---------------------3

	/*	var countCache=cache.get("count");
		if(countCache){
			cache.set("count",countCache+1);
		}else{
			cache.set("count",1);
		}
		res.send("count="+cache.get("count"));*/
});
	
module.exports = router;
