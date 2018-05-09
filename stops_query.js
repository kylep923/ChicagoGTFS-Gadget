db.stops.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			"stop_name":{"$regex": "79th", "$options": "-i"}
			}
		},

		// Stage 2
		{
			$lookup: // Equality Match
			{
			    from: "stoptimes",
			    localField: "stop_id",
			    foreignField: "stop_id",
			    as: "stoptime_objects"
			}
			
			// Uncorrelated Subqueries
			// (supported as of MongoDB 3.6)
			// {
			//    from: "<collection to join>",
			//    let: { <var_1>: <expression>, …, <var_n>: <expression> },
			//    pipeline: [ <pipeline to execute on the collection to join> ],
			//    as: "<output array field>"
			// }
		},

		// Stage 3
		{
			$unwind: {
			    path : "$stoptime_objects",
			    includeArrayIndex : "arrayIndex", // optional
			    preserveNullAndEmptyArrays : false // optional
			}
		},

		// Stage 4
		{
			$lookup: // Equality Match
			{
			    from: "trips",
			    localField: "stoptime_objects.trip_id",
			    foreignField: "trip_id",
			    as: "trip_objects"
			}
			
			// Uncorrelated Subqueries
			// (supported as of MongoDB 3.6)
			// {
			//    from: "<collection to join>",
			//    let: { <var_1>: <expression>, …, <var_n>: <expression> },
			//    pipeline: [ <pipeline to execute on the collection to join> ],
			//    as: "<output array field>"
			// }
		},

		// Stage 5
		{
			$match: {
			    //"stoptime_objects.pickup_type" : NumberInt(0),
			    //"trip_objects.direction_id": NumberInt(0), 
			    "trip_objects.service_id": {"$in": [ "205501","105540","105539","105538","105537","105536","105535","105534","105533","105532","105531","105530","105527","105526","105523","105522","105519","105518","105515","105514","105513","105502","105501","48840","48839","48838","48837","48836","48835","48834","48833","48832","48831","48830","48827","48826","48823","48822","48819","48818","48815","48814","48813","48802","48801","13011" ]}
			    //"stoptime_objects.drop_off_type" : NumberInt(1)
			}
		},

		// Stage 6
		{
			$lookup: // Equality Match
			{
			    from: "routes",
			    localField: "trip_objects.route_id",
			    foreignField: "route_id",
			    as: "route_objects"
			}
			
			// Uncorrelated Subqueries
			// (supported as of MongoDB 3.6)
			// {
			//    from: "<collection to join>",
			//    let: { <var_1>: <expression>, …, <var_n>: <expression> },
			//    pipeline: [ <pipeline to execute on the collection to join> ],
			//    as: "<output array field>"
			// }
		},

		// Stage 7
		{
			$project: {
			    // specifications
			    //`stop_id: 1,
			    "route_objects.route_long_name":1,
			    "route_objects.route_short_name":1,
			    "trip_objects.trip_headsign": 1,
			    "trip_objects.direction_id": 1,
			    "stoptime_objects.departure_time": 1,
			    "stoptime_objects.pickup_type": 1,
			    "stoptime_objects.drop_off_type": 1,
			    "trip_objects.service_id": 1,
			    stop_name: 1
			    
			    
			    
			    
			}
		},

		// Stage 8
		{
			$sort: {
			    "stoptime_objects.departure_time": -1
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
