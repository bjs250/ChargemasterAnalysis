/* This file's purpose is to load the cleaned data as a MongoDB table */
let mongoose = require('mongoose');
const Data = require("./data");
const dbRoute = "mongodb+srv://bjs250:DeltaV123@cluster0-rhktc.mongodb.net/DrugInfoDB?retryWrites=true";

mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
);

let connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', function () {
    console.log("Connection Successful!");

    let DrugInfoTest = new Data({
        name: "test",
        price: "test",
        hospital: "test",
        delivery: "test",
        dosage: "test",
        description: "test"
    });

    // Data.deleteOne({
    //     name: "test",
    //     price: "test",
    //     hospital: "test",
    //     delivery: "test",
    //     dosage: "test",
    //     description: "test"
    // }, function(err){
    //     if (err) return console.error(err);   
    // });

    let query = Data.find({
        name: "test",
        price: "test",
        hospital: "test",
        delivery: "test",
        dosage: "test",
        description: "test"
    });

    query.exec(function (err, docs) {
        if (err) return console.error(err);
        //console.log(docs)
    });


    // DrugInfoTest.save(function (err, datum) {
    //     if (err) return console.error(err);
    //     console.log(datum.name + " saved to collection.");
    // });

    connection.db.listCollections().toArray(function (err, collectionNames) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(collectionNames);
        connection.close();
    });

});
