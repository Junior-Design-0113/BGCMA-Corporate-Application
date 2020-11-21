# BGCMA-Corporate-Application

Code Review To-Do:
	Need to check and move old style format to the style document in:
	PendingUsers.js, Login.js, Register.js, AnnouncementPage.js, Announcements.js, Home.js, Profile.js, App.js

	Dima went through full typo list and fixed spacing in all the files. I didn't modify /Components/User/Fire.js and /server/router.js. Changing the spacing here threw errors in the expo window with how the app is run. 

	The other major issues include a lack of documentation throughtout and our API key being public (not sure how we'd fix this). There was a minor issue about using console.error instead of .log somewhere in Profile.js. 

	Additionally: Find a way to delete ChatPage.js since it should be irrelevant now. It's referenced somewhere since deleting it throws an error. 



Delivery Documentation:
Bug: Calendar doesn't update after a new announcement made, stuck on loading screen.