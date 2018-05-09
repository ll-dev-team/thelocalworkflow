# Guide for io2s

## Step 1: Install the Script
If you're working on one of our computers that's already running thelocalworkflow...
1. Open Terminal and navigate to thelocalworkflow. (Usually the commands `cd development` then `cd thelocalworkflow` will get you there.)
2. Now, you'll want to see what branch of thelocalworkflow you're running using `git status`. Odds are you'll see "On branch master". If this is the case or if you're on any branch other than **stable_io2s**, you'll need to checkout the stable_io2s branch:
  ```
  git checkout stable_io2s
  ```

If you're on a computer that isn't already running the localworkflow...  
1. Open Terminal and navigate to the folder where you keep your scripts. (Possibly also using `cd development`.)
2. Now, use the following command to install the **stable_io2s** branch of thelocalworkflow on your computer:
```
git clone -b stable_io2s https://github.com/learninglab-dev/thelocalworkflow.git
```
3. You'll also need to install dependencies: `npm install --save` if you didn't already have thelocalworkflow up and running.


## Step 2: Make the JSON
The io2s script requires two inputs. First, is the json file with the timecode and camera angle information for the segment. You'll have received a spreadsheet of some sort from the students with this information. In order to create properly formatted json from it, start a new sheet with a header row that looks like this:

![io2s Headers](https://github.com/learninglab-dev/thelocalworkflow/blob/stable_io2s/images/io2s_sheet.png)

**Note:** Capitalization matters; column headers must be exactly this for the script to work.

Next, populate your new sheet with the timecode and angle info and the correct, complete Shoot ID. Even if all segments are from the same shoot, each row must include the shoot ID.

Download your spreadsheet data as a csv file. In google sheets, File>Download As>csv. Open your csv file in a text editor and select all and copy and paste into this converter: [CSV to JSON](https://www.csvjson.com/csv2json)

Run the converter; then copy and paste the resulting JSON into a new file in Atom. Save this file using the extension **.json**

**Note:** io2s will write the files it generates into the same directory where you save this .json file, so make sure you can find this again!

## Step 3: Grab the XML
This is an easy one! Find the relevant shoot XML and save a local copy of it (in the same folder where you saved the json makes it easy to find).

## Step 4: Run the script
Alright, now that you have the inputs, let's run this thing! Open Terminal and navigate to the directory containing thelocalworkflow. Then run this command:
```
node thelocalworkflow --io2s --xml [path to your xml] --json [path to your json] --title [your title]
```
For the paths, you can drag the files in from a Finder window. For the title, what you input here will appear as the project name in FCPX. Avoid spaces or special characters. You can always change this later in FCPX.

## Step 5: Open your XML and Relink Files
Open the io2s generated XML and relink files as usual. [For now the file name is yourNewIo2sXml.fcpxml, but we'll come up with something better.] Export and enjoy your handiwork!
