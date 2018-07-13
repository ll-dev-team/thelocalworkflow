var Slate = require('../../models/slate');
var async = require('async');
var moment = require('moment');
var colors = require('colors/safe');

function tc2clock_get(req, res, next) {
  // Slate.find()
  //   .sort([['shootId', 'ascending']])
  //   .exec(function (err, list_slates) {
  //     if (err) { return next(err); }
  //     //Successful, so render
  //     res.render('database/slate/slate_list', { title: 'Slate List',  tabTitle: 'Slate List', slate_list: list_slates});
  //   })
  res.send("coming soon")
};

function tc2clock_post(req, res, next) {
  // Slate.find()
  //   .sort([['shootId', 'ascending']])
  //   .exec(function (err, list_slates) {
  //     if (err) { return next(err); }
  //     //Successful, so render
  //     res.render('database/slate/slate_list', { title: 'Slate List',  tabTitle: 'Slate List', slate_list: list_slates});
  //   })
  res.send("coming soon")
};

function clock2tc_get(req, res, next) {
  // Slate.find()
  //   .sort([['shootId', 'ascending']])
  //   .exec(function (err, list_slates) {
  //     if (err) { return next(err); }
  //     //Successful, so render
  //     res.render('database/slate/slate_list', { title: 'Slate List',  tabTitle: 'Slate List', slate_list: list_slates});
  //   })
  res.send("coming soon")
};

function clock2tc_post(req, res, next) {
  // Slate.find()
  //   .sort([['shootId', 'ascending']])
  //   .exec(function (err, list_slates) {
  //     if (err) { return next(err); }
  //     //Successful, so render
  //     res.render('database/slate/slate_list', { title: 'Slate List',  tabTitle: 'Slate List', slate_list: list_slates});
  //   })
  res.send("coming soon")
};


module.exports.tc2clock_get = tc2clock_get;
module.exports.tc2clock_post = tc2clock_post;
module.exports.clock2tc_get = clock2tc_get;
module.exports.clock2tc_post = clock2tc_post;
