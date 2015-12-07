var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MONGODBURL = 'mongodb://localhost/test';

var restaurantSchema = require('./models/restaurant');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/:restaurant_id/:id', function(req,res) {
	var criteria = {};
	criteria[req.params.restaurant_id]=req.params.id;
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});


app.post('/',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;

		rObj.grades=[];
 		var grade_temp = {};
		
		if(req.body.date!=null||req.body.grade!=null||req.body.score!=null){
			grade_temp.date = req.body.date;
			grade_temp.grade = req.body.grade
			
  			grade_temp.score = parseInt(req.body.score);
 			rObj.grades.push(grade_temp);
		}
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var tempObj = new Restaurant(rObj);
		//console.log(r);
		tempObj.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
       		db.close();
			res.status(200).json({message: 'insert done', id: tempObj._id});
    	});
    });
});


app.delete('/:restaurant_id/:id', function(req,res) {
	var criteria = {};
	criteria[req.params.restaurant_id]=req.params.id;
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
			
				Restaurant.remove(criteria,function(err,results){

				db.close();
				res.status(200).json({message: 'delete done', id: req.params.id});
				});
					
					
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});



app.put('/:restaurant_id/:id/grade', function(req,res) {

	var criteria = {};
	criteria[req.params.restaurant_id]=req.params.id;
	var grades = {};
	var temp_grade = {};
	temp_grade.grade = req.body.grade;
	temp_grade.date = req.body.date;
	temp_grade.score= parseInt(req.body.score);

	grades["grades"]=temp_grade;
	
	
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update(criteria,{$set:grades},function(err){

			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				
				console.log("update successful");
				res.status(200).json({message: 'updated'})
				db.close();
				res.end('Done',200);
			}
		});
	});
});


app.listen(process.env.PORT || 8099);
