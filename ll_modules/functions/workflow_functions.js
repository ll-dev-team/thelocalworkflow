function toMongo(stillArray){
  MongoClient.connect(process.env.MONGODB_PATH, function(err, db) {
    assert.equal(null, err);
    stillArray.forEach(function(still){
      db.collection('stills').insertOne({still});
    });
    db.close();
});
}
