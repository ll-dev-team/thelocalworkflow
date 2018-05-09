# Guide for io2s

## Step 1: Install the Script
If you're working on one of our computers that's already running thelocalworkflow...
  1. Open Terminal and navigate to thelocalworkflow. (Usually the commands `cd development` then `cd thelocalworkflow` will get you there.)
  2. Now, you'll want to see what branch of thelocalworkflow you're running using `git status`. Odds are you'll see "On branch master". If this is the case or if you're on any branch other than **stable_io2s**, you'll need to checkout the stable_io2s branch:
  ```
  git checkout stable_io2s
  ```

    If you see, "Switched to branch 'stable_io2s'" you're good to go!

  If you're on a computer that isn't already running the localworkflow...
  
    1. Open Terminal and navigate to the folder where you keep your scripts. (Possibly also using `cd development`.)
    2. Now, use the following command to install the **stable_io2s** branch of thelocalworkflow on your computer:
```
git clone -b stable_io2s https://github.com/learninglab-dev/thelocalworkflow.git
```
    3. You'll also need to install dependencies: `npm install --save` if you didn't already have thelocalworkflow up and running.

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

## Step 5: Open your XML and Verify that it Relinks
This should be the easy part. :) Open the new XML
