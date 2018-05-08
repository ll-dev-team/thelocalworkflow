# Guide for io2s

## Step 1: Install the Script
If thelaurenworkflow is already installed on your machine, skip to Step 2.
If not, start by cloning this repo -- specifically thelaurenworkflow branch -- into the directory where you keep your scripts. Run the following command in Terminal:
```
git clone -b thelaurenworkflow https://github.com/learninglab-dev/thelocalworkflow.git
```
Next, in terminal, navigate to the folder where you just put that repo by

Then install your dependencies: `npm install --save`

## Step 2: Make the JSON
The io2s script requires two inputs. First, is the json file with the timecode and camera angle information for the segments. You'll have received a spreadsheet of some sort from the students with this information. In order to create properly formatted json from it, start a new sheet with a header row that looks like this:

![image][io2s sheet]
[io2s sheet]:

Note: Capitalization matters; column headers must be exactly this for the script to work.

Next, populate your new sheet with the timecode and angle info and the correct, complete Shoot ID. Even if all segments are from the same shoot, each row must include the shoot ID.

Now download your spreadsheet data as a .csv file. In google sheets, File>Download As. Open your .csv file in a text editor and copy the all the text and paste it into this converter: [link](www.)

## Step 3: Export the XML

## Step 4: Run the script
Alright, now that you have the inputs, let's run this thing! Open Terminal and navigate to whatever folder you have script saved in. Then enter this:
```
node thelocalworkflow --io2s --xml [path to your xml] --json [path to your json] --title [your title]
```
For the paths, you can drag the files in from a Finder window. For the title, what you input here will appear as the project name in FCPX. Avoid spaces or special characters. You can always change this later in FCPX.

## Step 5: Insert io2s Event in XML

[I'm hoping this step will soon not be required... working on a script that constructs the xml for you.]

Finally, in Atom open both the xml you exported in Step 3 and the new xml created by io2s. Copy the entire contents of the new xml -- It should begin with an **<event>** tag and end with a **</event>** tag. Paste this event into the xml export. It goes in toward the bottom, between the last **</event>** and the **</library>**. Save this xml, and then open with FCPX to verify that it relinks and export the video.
