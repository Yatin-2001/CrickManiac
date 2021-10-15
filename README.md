# CrickManiac - A Web Scrapping Project

# This project uses following npm libraries:
# 1) minimist - library used to read command line arguments
# 2) fs - library to use file realted functions
# 3) axios - library to download data from web
# 4) jsdom - used to extract/parse the html file that is downloaded
# 5) ecxel4node - used to write the excel file
# 6) pdf-lib - used to write the pdf file
# 7) path - used to make get path of folder

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
