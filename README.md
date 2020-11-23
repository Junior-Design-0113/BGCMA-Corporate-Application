# BGCMA-Corporate-Application
The Boys and Girls Club of Metro Atlanta Corporate Application connects the BGCMA board members to each other. Our corporate communication portal allows authorized members to securely share files, schedule calendar meetings, live chat with other users, upload announcements, and personalize their profile information. Our application nees to be hosted on a computer. A local server needs to be created so that people can connect to the application from their phones. The installation guide below covers the fine details. 

# Release Notes for 11/22/2020
 # New software features for this release:
-Chat is now fully functional. 
-The new chat feature adds a new chat page to the home screen. 
-The chat page allows users to create chat rooms with other app users. 
-The + button at the top right of the page allows users to see a list of available users to contact. 
-Pressing the chat button next to their name creates a chat room containing the user and selected contact. 
-Users can scroll through all of their chats on the chat page or use the search bar at the top to find a chat with a specific contact. 

  # Bug fixes made since the last release:
-Fixed bug in the previous version that prevented users from viewing announcements.
-There were major UI changes that have been implemented

  # Known bugs and defects
-After you create a meeting date on the calendar it sometimes gets stuck trying to reload the screen and won’t show any meetings. Go back to the previous screen and enter the Calendar page again to see the new meeting.
-On iPhone, many pages require you to click on a one line text entry and press return to close the keyboard.
-Sometimes the time and date pickers do not load properly when creating a meeting for the calendar for iPhone users.
-If you make any changes using the profile page, you must restart the app for that change to affect other aspects of the app besides the profile page. Reloading the profile page after changing your profile will display your previous profile information but in reality, the updated information is saved in the database and will be reflected if the app is restarted.
-Profile image cannot be edited anymore.


# Install Guide
  # •Pre-requisites
-Laptop or any sort of computer to build/run code. 
-A mobile device (iOS or Android) which allows you to download an application from Google play store or app store.
-Internet connection/wifi over which you can host the application

  # •Dependent Libraries that must be installed
-To download and install our software you will need Git and Node.js on your laptop/computer. 
-Git (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) is used to download the source code from github. Alternatively you can look into the Github Desktop app (https://docs.github.com/en/free-pro-team@latest/desktop/installing-and-configuring-github-desktop/installing-github-desktop) which may make the process easier.
-Node/npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is a tool that builds and packages different dependencies that helps our code run. It is used to launch our application on your computer.
-Expo (https://docs.expo.io/get-started/installation/) is the tool we use to make a server and host the application from your computer to your phone. This requires two parts. On your computer you need the Expo Cli tool which can easily be installed through an ‘npm’ command as seen in the documentation. On your phone you need to download the Expo Client app from the Android Play Store or Apple App Store. 

  # •Download instructions
The source code for our project is stored on Github at the following link: https://github.com/Junior-Design-0113/BGCMA-Corporate-Application. You need to clone/download the github repository to a computer from which the application will be hosted. There are some instructions on how to do this here: https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository.  

  # •Build instructions
Use a command line terminal to navigate to the folder where the application gets saved. You need to be in the main folder for our application (the one that has the file ‘App.js’, which should end in the filepath /BGCMA-Corporate-Application). Node should be installed so type in the command ‘npm install’. This will take some time but it will download all the extra code and dependencies needed for our application to run properly. 

  # •Installation of actual application
The application should now be ready to use on the computer. 

  # •Run instructions
From the command line terminal and the same location type in the command “npm run start”. This will set up and run the application on your computer. It will open an Expo server so that users can connect to the application on their phones over the local internet/wifi. The command line tool will display a QR code as well as a link/url to the project.
Then you need to connect to the application using the Expo app. Users will need to turn on their wifi and open the Expo app on their phone. You can scan the QR code or type in the link/url provided by the command line terminal. If this is not the first time you are launching the app, then Expo should save the link and you can access it on the Expo app main page. Connect to the application being run on the computer by tapping on the link inside the Expo app. This will download a copy of the BGCMA application to your phone and then open it. Now you should be free to login or register and start using the app. Multiple people should be able to connect to the same host computer. 

  # •Troubleshooting
-You cannot download the project from Github. Make sure you have Git installed. Alternatively, try installing the Github Desktop app which will make the downloading process easier. Try following the instructions on the github cloning info page here: https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository. 
-Npm is not a valid command. This means that node/version control is not properly installed or is not being recognized by your computer. You will need to check or reinstall node/version control to make it so that ‘npm’ commands can be read. This page on how to install node and npm version control may be helpful: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm. 
-The ‘npm’ commands aren’t doing anything. It is possible that you are in the wrong computer directory and nothing is being run. In this case you need to navigate to the directory where the project was downloaded from Github. You may need to reinstall the project from Github into a different folder. 
-You cannot run the project through Expo. It takes you to a blue screen with a message like “network timed out” or “can’t connect to project_path”. This can happen when you are not connected to the same internet/wifi source that is hosting the BGCMA application. Make sure your wifi is turned on. Switch to the internet source that is hosting the application (the computer where you ran the ‘npm run start’ command). Sometimes it can take a while to download the application through expo. Please be patient. 
