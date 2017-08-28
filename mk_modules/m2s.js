const xml = require('xml');
const fs = require("fs");
const path = require("path");
const dateFormat = require('dateformat');
const xml2js = require('xml2js');
const parseXmlString = require('xml2js').parseString;


function Still(start, videoFilePath){
  this.fcpxmlStart = start;
  this.videoFilePath = videoFilePath;
  this.stillFileName = "";
  this.stillFilePath = "";
}

function markersToStills() {
  // TODO: path to ffmpeg (dev_folder replacement)
  // TODO: path for stills to export (path_for_stills replacement)
  // TODO: path for the fcpxml files ()
  // TODO: loop folder to get all stills fcpxmls (test if ends with fcpxml)
  var now = new Date();
  var stillArray = [];
  console.log("Starting markersToStills at " + (dateFormat(now, "yyyymmdd HH:MM:ss")));
  // console.log(tc_from_frames(442371));
  var xml2test = fs.readFileSync('/Users/mk/Development/test_materials/exports/Stills_2_projects.fcpxml', 'UTF-8');
  parseXmlString(xml2test, function (err, result) {
    var pathForJson = ("/Users/mk/Development/test_materials/exports/testing2stills.json");
    var xmlJson = JSON.stringify(result, null, 2);
    fs.writeFileSync(pathForJson, xmlJson);
    for (var i = 0; i < result.fcpxml.library[0].event[0].project.length; i++) {
      if (result.fcpxml.library[0].event[0].project[i].$.name=="Stills" || result.fcpxml.library[0].event[0].project[i].$.name=="stills" || result.fcpxml.library[0].event[0].project[i].$.name=="Still" || result.fcpxml.library[0].event[0].project[i].$.name=="still") {
        var theProject = result.fcpxml.library[0].event[0].project[i];
      }
    }
    for (var i = 0; i < theProject.sequence[0].spine[0]["asset-clip"].length; i++) {
      var videoFileName = theProject.sequence[0].spine[0]["asset-clip"][i].$.name;
      var theClip = result.fcpxml.resources[0].asset.filter(function(clip){
        return clip.$.id === theProject.sequence[0].spine[0]["asset-clip"][i].$.ref
      });
      var videoFilePath = theClip[0].$.src.replace('file:///','/');
      console.log("theClipPath is " + videoFilePath);
      console.log("\n\n");
      findMarkers(theProject.sequence[0].spine[0]["asset-clip"][i], videoFilePath, stillArray);
      // console.log(stillArray);
      stillArray.forEach(function(still){
        // console.log(JSON.stringify(still, null, 2));
      });
    }
  });
}

function tc_from_frames(frames){
  var the_frames=(frames % 24);
  // console.log("the_frames are "+ the_frames);
  var seconds = (frames-the_frames)/24;
  // console.log("seconds are "+ seconds);
  var the_seconds=(seconds%60);
  // console.log("the_seconds are "+ the_seconds);
  var minutes = (seconds-the_seconds)/60;
  var the_minutes = minutes%60;
  var the_hours = (minutes-the_minutes)/60;
  var tc_string = ((("00" + the_hours).slice(-2))+(("00" + the_minutes).slice(-2))+(("00" + the_seconds).slice(-2))+(("00" + the_frames).slice(-2)))
  // console.log("something like " + tc_string);
  return tc_string
};

function stills_from_fcpxml(fcpxml_path){

  };

function fcpxmlStartToSeconds(fcpxmlStart){
  console.log(fcpxmlStart);
  var numerator = fcpxmlStart.split('/')[0];
  var denominator = fcpxmlStart.split('/')[1].replace('s','');
  console.log(numerator);
  console.log(denominator);
  return (numerator/denominator);
}

function findMarkers(projectAssetClip, videoFilePath, stillArray){
  console.log("in findMarkers");
  // console.log("projectAssetClip is " + JSON.stringify(projectAssetClip, null, 2));
  projectAssetClip.marker.forEach(function(marker, index){
    console.log("logging marker.$.start"+JSON.stringify(marker.$.start, null, 2));
    var timestampSeconds = fcpxmlStartToSeconds(marker.$.start);
    console.log("timestampSeconds is " + timestampSeconds);
    var thisStill = new Still(timestampSeconds, videoFilePath);
    stillArray.push(thisStill);
  });
};


//
//             for i in clip:
//                 if i.tag=="marker":
//                     print('starting with {}, but . . .'.format(i.attrib['start']))
//                     x=(i.attrib['start'])
//                     numerator=int(x.split('/')[0])
//                     y=(x.split('/')[1])
//                     denominator=int(y.split('s')[0])
//                     actual_frames=int(24000/denominator*numerator)/1001
//                     print('the actual frames are {}.'.format(actual_frames))
//                     suffix=tc_from_frames(actual_frames)
//                     seconds_marker=(numerator/denominator)
//                     #print('tc of marker in seconds is {}.'.format(seconds_marker))
//                     seconds_request=(seconds_marker - seconds_start)
//                     #print('the seconds request is {}'.format(seconds_request))
//                     #print(str(suffix))
//                     this_still_filename='{}_{}.png'.format(clip.attrib['name'], suffix)
//                     this_still_filepath='{}{}'.format(path_for_stills, this_still_filename)
//                     #print('the filename will be {}.'.format(this_still_filename))
//                     the_command="/{}/ffmpeg -ss {} -i {} -vframes 1 {}".format(dev_folder, seconds_request, the_src, this_still_filepath)
//                     #print('we are about to use the command \n\n{}\n\n'.format(the_command))
//                     #print('and the full path to it is {}.'.format(this_still_filepath))
//                     #subprocess.call('/mk_dev/tests/m2s.sh', [seconds_request, the_src, this_still_filepath])
//                     subprocess.call("/{}/ffmpeg -ss {} -i {} -vframes 1 {}".format(dev_folder, seconds_request, the_src, this_still_filepath), shell=True)
//                     shoot_id=this_still_filename.split('_')[0]
//                     notes="any notes would go here"
//                     #print(notes)
//                     clocktime="2017-05-28 12:01:00"
//                     still_mysql_insert(this_still_filename, seconds_request, shoot_id, clocktime, notes)
//                     this_yyyymmdd=shoot_id[0:8]
//                     this_hhmm=suffix[0:4]
//                     creation_date_input=this_yyyymmdd+this_hhmm
//                     subprocess.call("touch -t {} {}".format(creation_date_input, this_still_filepath), shell=True)
//                     print("touch -t {} {}".format(creation_date_input, this_still_filepath))
//                 else:
//                     pass
//         else:
//             print ("{} isn't a regular clip, so stills won't be extracted.".format(clip))



module.exports.markersToStills = markersToStills;




// def still_mysql_insert(still_filename, tc_request, shoot_id, clocktime, notes):
//     cnx = mysql.connector.connect(user='root', password='root', port='3306', host='127.0.0.1', database='learning_lab')
//     cursor = cnx.cursor()
//     mysql_command="""
//     INSERT INTO test_stills (shoot_id, filename, tc_request, clocktime, notes) VALUES (%s, %s, %s, %s, %s)
//     """
//     values=(shoot_id, still_filename, tc_request, clocktime, notes)
//     cursor.execute(mysql_command, values)
//     #print('just tried to execute')
//     cnx.commit()
//     cnx.close()
