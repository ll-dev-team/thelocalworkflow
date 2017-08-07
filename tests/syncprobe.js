// var sync = require('child_process').spawnSync;
//
// console.log('start ls');
// var ls = sync('ls', ['-lh', '/usr']);
// console.log('end ls');

// console.log('start grep');
// var grep = sync('grep', ['local'], {
//     input: ls.stdout
// })
// console.log('end grep');
//
// process.on('exit', function() {
//     console.log(grep.stdout.toString());
// });



// var sync = require('child_process').spawnSync;
//
// console.log('start ls');
// var ls = sync('ls', ['-lh', '/usr']);
// console.log('end ls');
// console.log(ls);
//
// console.log('start grep');
// var grep = sync('grep', ['local'], {
//     input: ls.stdout
// })
// console.log('end grep');
//
// process.on('exit', function() {
//     console.log(grep.stdout.toString());
// });

var video_file = 
'/Users/mk/Development/test_materials/20170806_001_MK_Test/5Da/clip_7.mov'
var cp = require('child_process');
var ls = cp.spawnSync('ffprobe', ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', video_file], { encoding : 'utf8' });
console.log('\n\n\n\n\n');
console.log(ls.stdout);
console.log('\n\n\n\n\n');
var video_meta = JSON.parse(ls.stdout);
console.log(video_meta.streams[0].codec_long_name);
