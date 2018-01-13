

if (req.body.email &&
  req.body.username &&
  req.body.password &&
  req.body.passwordConf) {

  var newUser = new User {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConf: req.body.passwordConf
  }
  newUser.save((err)=>{
    if (err) {
      console.log(err);;
    }
    else {
      console.log("saved");
    }
  })
}
