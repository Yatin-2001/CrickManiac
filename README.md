# CrickManiac - A Web Scrapping Project

# This project uses following npm libraries:
# 1) minimist (npm install minimist) - library used to read command line arguments
# 2) fs (preinstalled) - library to use file realted functions
# 3) axios (npm install axios) - library to download data from web
# 4) jsdom (npm install jsdom) - used to extract/parse the html file that is downloaded
# 5) ecxel4node (npm install excel4node) - used to write the excel file
# 6) pdf-lib (npm install pdf-lib) - used to write the pdf file
# 7) path (preinstalled) - used to make get path of folder

# The gist of project is scrapping the data of teams and matches from the html file downloaded from CrickInfo website.
# The data parsed from the file is then used to create the excel files and then finally the pdf's teamwise.

# First I downloaded the HTML file using the axios library and had written the contents in downHtml.html file.
# Then I parsed the data of the file using jsdom library. I organised the data into objects for easier handling.
# Then I made a json file out of the data to get the easier view of the objects created.
# Using the array of objects made, I created the excel file.
# I have created 2 excel files in two seperate programs:
# 1) The file worldCup2019.xlsx is created using the act-1-matchInfo.js file. This file contains the details match wise.
# 2) The second file, teams.xlsx is created using the act-1.js file. This file contains the details team-wise.
# The pdfs are stored in the Teams folder team wise. The Pdfs are created using act-1.js file.

# Also added a function to make seperate pdf files to resolve the problem of having details of only one match if same teams have more than one match.
# The problem is the fact that two files can not have same paths in the file system.
# This is resolved by appending the numbers at the end of teams name while making the name of pdf.

# The other features and functions can be seen in the code clearly.

# ** Note: To run the codes, we will need to install the required libraries. 
