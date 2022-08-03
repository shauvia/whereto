let users = {};



app.put('/users', function (req, res){
  let userAccName = req.body.userName;
  let accCheck = {
    isCreated : false
  };
  for(userAccName in users) {
    if (!userAccName){
      res.send(accCheck);
    } else {
      users[userAccName] = [];
      accCheck.isCreated = true;
      res.send(accCheck);
    }
  }
});

app.get('/users/:userId', function(req, res){
  let userAcc = req.params.id;
  let accCheck = {
    isCreated : false
  };
  for(userAcc in users) {
    if (!userAcc){
      res.send(accCheck);
    } else {
      accCheck.isCreated = true;
      res.send(accCheck);
    }
  }
});




