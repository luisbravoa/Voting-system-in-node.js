var _ = require('underscore');

// GET /issues
exports.find = function (req, res, next) {

    var id = req.params.id;
    var result;

    if(global.data.issues){
        result = _.pick(global.data.issues, id);
        if(!_.isEmpty(result)){
            res.status(200);
            res.send(result);
            res.end();
        }else{
            res.status(500);
            res.send({"error": "Not found"});
            res.end();
        }
    }
}


//{
//    "id": "id"
//    "option": "option"
//}
// post /issues/vote
exports.vote = function (req, res, next) {

    var body = req.body;
    var id = req.body.id;
    var option = req.body.option;

    var result;

    if(global.data.issues){
        result = _.pick(global.data.issues, id);
        if(!_.isEmpty(result)){
            if(_.has(global.data.issues[id].options, option)){

                var deadLine = global.data.issues[id].created.getTime() + parseInt(global.data.issues[id].duration);
                var now = new Date().getTime();

                console.log(String(deadLine) + ' >>>> ' + String(now));

                if(now > deadLine){
                    global.data.issues[id].options[option] = global.data.issues[id].options[option] +1;
                }else{
                    res.status(500);
                    res.send({"error": "time is up :("});
                    res.end();
                }

                res.status(200);
                res.send("success");
                res.end();

            }else{
                res.status(500);
                res.send({"error": "option not found"});
                res.end();
            }

        }else{
            res.status(500);
            res.send({"error": "Not found"});
            res.end();
        }

}
}

// GET /issues/list
exports.list = function (req, res, next) {

    if(global.data.issues){
            res.status(200);
            res.send(global.data.issues);
            res.end();
        }

}

// Post /issues
exports.add = function (req, res, next) {

//    {
//        "id": "newVote",
//        "name": "Some name",
//        "duration": 120,
//        "options":
//          [
//            "option1",
//            "option2",
//            "option3"
//          ]
//
//    }

    var response = {};
    var errors = {};

    var body = req.body;

    // start validation

    // let's say min 4 chars
    if(body.id == undefined || body.id.length <= 3){
        errors['id'] = "Invalid identifier";
    }else if(body.name == undefined || body.name.length <= 3){
        errors['name'] = "Invalid name";
    }else if(body.duration == undefined || isNaN(body.duration)){
        errors['duration'] = "Invalid duration";
    }else if(body.options == undefined  || !_.isArray(body.options)  || body.options.length < 2){
        errors['options'] = "Invalid options";
    }

    if(_.isEmpty(errors)){
        var newIssue = new global.models.Issue();

        newIssue.set('id', body.id);
        newIssue.set('name', body.name);
        newIssue.set('duration', body.duration);
        newIssue.set('options', body.options);
        newIssue.set('created', new Date());

        console.log(newIssue.get('created').getTime());

        // This is where we would want to save in the DB but..

        var newDataJSON = newIssue.toJSON();
        var options = newDataJSON.options;
        var newOptions = {};
        _.each(options, function(data, index){
            newOptions[data] = 0;
        });

        var newData =  {
        "id": newDataJSON.id,
        "name": newDataJSON.name,
        "duration": newDataJSON.duration,
        "created": newDataJSON.created,
        "options":
          newOptions
    };

        global.data.issues[body.id] = newData;

        response = newData;
        res.status(200);
        res.send(response);
        res.end();

    }else{

        response.error = errors;
        res.status(500);
        res.send(response);
        res.end();

    }



}