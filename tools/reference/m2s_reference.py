#!/mk_dev/anaconda/bin/python3
# m2s.py version 0.021


#import time
import subprocess
import json
import os
import mysql.connector
from mysql.connector import errorcode
import xml.etree.ElementTree as ET
#from xml.etree.ElementTree import Element

dev_folder='mk_dev'
path_for_stills='~/Desktop/Stills_Test/'

def tc_from_frames(frames):
    the_frames=int(frames) % 24
    seconds=(frames-the_frames)/24
    the_seconds=int(seconds%60)
    minutes=(seconds-the_seconds)/60
    the_minutes=int(minutes%60)
    hours=(minutes-the_minutes)/60
    str_hours="{0:0>2}".format(int(hours))
    str_minutes="{0:0>2}".format(int(the_minutes))
    str_seconds="{0:0>2}".format(int(the_seconds))
    str_frames="{0:0>2}".format(int(the_frames))
    str_filename_tc='{}{}{}{}'.format(str_hours, str_minutes, str_seconds, str_frames)
    return str_filename_tc

def still_mysql_insert(still_filename, tc_request, shoot_id, clocktime, notes):
    cnx = mysql.connector.connect(user='root', password='root', port='3306', host='127.0.0.1', database='learning_lab')
    cursor = cnx.cursor()
    mysql_command="""
    INSERT INTO test_stills (shoot_id, filename, tc_request, clocktime, notes) VALUES (%s, %s, %s, %s, %s)
    """
    values=(shoot_id, still_filename, tc_request, clocktime, notes)
    cursor.execute(mysql_command, values)
    #print('just tried to execute')
    cnx.commit()
    cnx.close()

def stills_from_fcpxml(fcpxml_path):
    tree = ET.parse(fcpxml_path)
    root = tree.getroot()
    projects = tree.findall(".//project")
    all_the_clips_xml = tree.findall(".//asset")
    for i in projects:
        if "tills" in i.attrib['name']:
            stills_project_xml=i
        else:
            pass
    for clip in stills_project_xml[0][0]:
        if clip.tag=="clip":
            #print ("{} is a regular clip.".format(clip))
            #print ("and {} is the clip's name".format(clip.attrib['name']))
            try:
                this_clip_start_str=clip.attrib['start']
                #print('this clip start string is {}'.format(this_clip_start_str))
                start_numerator=int(this_clip_start_str.split('/')[0])
                y=(this_clip_start_str.split('/')[1])
                start_denominator=int(y.split('s')[0])
                seconds_start=(start_numerator/start_denominator)
            except KeyError:
                print('no "start" for this clip')
                seconds_start=0
            for test_this_clip in all_the_clips_xml:
                #print('test_this_clip is for {} right now'.format(test_this_clip))
                #print(test_this_clip.attrib['src'])
                if test_this_clip.attrib['name']==clip.attrib['name']:
                    the_src_str=test_this_clip.attrib['src']
                    the_src=the_src_str.split('://')[1]
                    #print('we are LOCKING DOWN the src as {}.'.format(the_src))
                    break
                else:
                    pass

            for i in clip:
                if i.tag=="marker":
                    print('starting with {}, but . . .'.format(i.attrib['start']))
                    x=(i.attrib['start'])
                    numerator=int(x.split('/')[0])
                    y=(x.split('/')[1])
                    denominator=int(y.split('s')[0])
                    actual_frames=int(24000/denominator*numerator)/1001
                    print('the actual frames are {}.'.format(actual_frames))
                    suffix=tc_from_frames(actual_frames)
                    seconds_marker=(numerator/denominator)
                    #print('tc of marker in seconds is {}.'.format(seconds_marker))
                    seconds_request=(seconds_marker - seconds_start)
                    #print('the seconds request is {}'.format(seconds_request))
                    #print(str(suffix))
                    this_still_filename='{}_{}.png'.format(clip.attrib['name'], suffix)
                    this_still_filepath='{}{}'.format(path_for_stills, this_still_filename)
                    #print('the filename will be {}.'.format(this_still_filename))
                    the_command="/{}/ffmpeg -ss {} -i {} -vframes 1 {}".format(dev_folder, seconds_request, the_src, this_still_filepath)
                    #print('we are about to use the command \n\n{}\n\n'.format(the_command))
                    #print('and the full path to it is {}.'.format(this_still_filepath))
                    #subprocess.call('/mk_dev/tests/m2s.sh', [seconds_request, the_src, this_still_filepath])
                    subprocess.call("/{}/ffmpeg -ss {} -i {} -vframes 1 {}".format(dev_folder, seconds_request, the_src, this_still_filepath), shell=True)
                    shoot_id=this_still_filename.split('_')[0]
                    notes="any notes would go here"
                    #print(notes)
                    clocktime="2017-05-28 12:01:00"
                    still_mysql_insert(this_still_filename, seconds_request, shoot_id, clocktime, notes)
                    this_yyyymmdd=shoot_id[0:8]
                    this_hhmm=suffix[0:4]
                    creation_date_input=this_yyyymmdd+this_hhmm
                    subprocess.call("touch -t {} {}".format(creation_date_input, this_still_filepath), shell=True)
                    print("touch -t {} {}".format(creation_date_input, this_still_filepath))
                else:
                    pass
        else:
            print ("{} isn't a regular clip, so stills won't be extracted.".format(clip))

# def markers and angles from MC????

def loop_stills_fcpxml_folder(folder):
    #print(folder)
    for fcpxml_file in os.listdir(folder):
        #print(fcpxml_file)
        if fcpxml_file.endswith('.fcpxml'):
            fcpxml_path=os.path.join(folder,fcpxml_file)
            #print (fcpxml_path)
            stills_from_fcpxml(fcpxml_path)
        else:
            pass

def main():
    folder='/_dev/temp/shoots'
    #print (get_xml())
    loop_stills_fcpxml_folder('/mk_dev/temp/stills_fcpxml/')

if __name__ == "__main__":  main()
