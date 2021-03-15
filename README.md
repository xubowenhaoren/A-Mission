## A-Mission: Accessible Trip Diary App

### Project Participants

- Bruce Visser: Needs Expert, Adventurous traveller
- Bowen Xu: University of Washington Computer Science
- Maryam Saleh: University of Washington Computer Science

- Asila Maksumova: University of Washington Computer Science
- Josh Curtis: University of Washington Computer Science

### Project Abstract

We are working on improving E-mission, which is an existing open-source mobile app that provides a trip diary so users can see which trips they’ve taken and which modes of transportation those trips involve.

“Trip segmentation” refers to the way that E-mission splits up each trip into segments, where each segment involves one single mode of transportation, like walking or riding a bus. A new segment begins when the user switches to a different mode of transportation.

- A motion prediction model is used to detect when the mode switches and which mode the person has switched to. 

We hope that our improved E-mission app could be used by people with disabilities in order to identify inaccessible parts of the trips they take so they can have an easier time planning for their future trips. 

### Project Goals

#### Improve E-Mission accessibility

- The original E-mission app was not particularly accessible. A lot of the functionality relied on being able to look at the map, which excluded visually impaired users.
- We wanted to make the trip diary totally accessible to anybody and everybody.
- Much of our work on this goal involved streamlining the screen reader’s navigation of the trip diary screens. 
- To meet this goal, we ended up eliminating the need for a user to interact with the map in order to have access to the full functionality of the trip diary. 

#### Improve the motion prediction model and update it to be inclusive of people who use wheelchairs

- The original E-mission app uses a pre-trained motion classification model with little or no wheelchair data. 
- To evaluate the accuracy of the current E-mission model, we designed pre-defined trips that cover various modes of transportation, such as walk, car, train, etc. We also designed pre-defined trips that mix different transportation modes and have various time durations.
- During the data collection, we also collected additional data using an Integrated Motion Unit or IMU plugin. These additional data are directly collected from the phone accelerometer and gyroscope. These data should help correct inaccuracies in the current E-mission models.
- We wrote data analysis script that fetches E-mission data and matches with the IMU data for any trip segments. If the user used our UI to update the actual motion mode, this data will be matched as well. Due to the time limitations, we couldn’t train a new motion inference model. However, our data analysis script is a firm step toward the full integration of IMU data so that future researchers can build upon our work. 

### Project Development

#### Integrated Motion Unit (IMU) plugin modernization and integration

- The original IMU plugin was developed 3 years ago. When we first attempted to add the plugin to our project, Cordova no longer recognizes the plugin. Upon further research, we learned that all recent plugins require a `package.json` as the plugin describer. We consulted existing E-mission plugin repos and added the `package.json` to modernize the IMU plugin. 

### Constraints and Limitations

#### UI Accessibility

#### Data Analysis and Motion Prediction Model Improvement

### Preliminary, Anecdotal Experimental results

#### Positive Notes

1. Users can now change the predicted mode of transportation if it’s not accurate.
   - This can be done by clicking a button on the segment that you want to change, which will bring you to a new page where you can select from a list of modes.
   - Our needs expert recommended we either use a popup for this functionality or a totally new page altogether, so we opted for a new page because it works more smoothly with TalkBack.

2. Users can now learn about his/her daily trips with more details. 
   - Users can now review their past trips and learn about the details of these trips and their individual segments by using a screen reader or a braille reader exclusively. 

3. Our app accommodates diverse use.
   - Our improved E-mission app will likely be the most useful for people with motion-related disabilities, but it’s now usable by people with visual impairments as well. 
   - Users with visual and auditory impairments, like our needs expert, can interact with the improved E-mission app by using a braille reader too.

#### Constructive Feedback

1. The date picker button and calendar are not accessible.
2. The navigation tabs (at the bottom of the app screen) are not accessible.
3. Some of the default buttons like “refresh” and “fix map” buttons are confusing. 
4. Navigating between trip cards is laborious. There is not an easy way to jump from one to the next without navigating through all of the information displayed on the trip card. 

### Conclusion and Future Directions

#### Conclusion

Through the complete UI redesign, the A-mission project has enabled high accessibility for the E-mission trip diary UI and high usability for people with screen readers. Moreover, we believe that through reviewing the trip summaries and the segmentation details, our A-mission app can help people with both vision and motion disabilities to travel with more confidence. They can how easily know which part of their trip takes the most time and make informed decisions about future travel. 

Through the integration of the Integrated Motion Unit (IMU) plugin and the introduction of the accessible segmentation motion mode editing UI, we enabled the collection of "ground truth" user input. The "ground truth" refers to the actual motion mode compared to the E-mission predictions. 

Through the development of the data analysis script, we can match and merge the E-mission data and IMU data on a segment level.  This data analysis script sets a firm foundation toward the full integration of IMU data into an improved E-mission motion inference model. 

#### Future Directions

On the A-mission UI, one next step is to make the E-mission app fully accessible, including the user registration and other tabs in E-mission. Another area of improvement is advanced on-device data analysis. 

- This future A-mission app will analyze each user trip over time and decide what trips belong to this user's routine. 
  - This can be done by grouping trips by the same start/end locations. 
- After that, the A-mission app can compare a routine trip to previous routine trips and automatically deduce whether this trip took shorter or longer than usual. For instance, an example notification of this future A-mission app can be "This daily commute took 26% longer than usual." This helps the user evaluate the transportation accessibility more easily. 

On the data analysis, one next step is to train a new machine learning (ML) model that reads both E-mission and IMU data and provide better motion inference predictions. 

- E-mission's MobilityNet project introduced a method to qualitatively evaluate the current E-mission motion inference model. See my notes on the project [here](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/data_analysis.md#partial-notes-on-running-a-new-mobilitynet-data-collection-project). 

### User Manual

- Installing the App
  - Find the pre-built APK in `documentation/apk_release/app-debug.apk`. [Download link](https://github.com/CSE482Winter2021/NameN0tF0und/raw/main/documentation/apk_release/app-debug.apk)
  - If Android warns you about “installation from unknown source”, ignore that.
  - If you use the emulator, you can open the Files app, drag & drop the APK to install. 
  - If you use the phone, follow this guide to copy the APK to your phone: https://www.lifewire.com/install-apk-on-android-4177185 

- Registering the App: See `documentation/user_manual/register_app.md`  ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/user_manual/register_app.md))

- Logging Trips
  - Be sure you turn on your Wi-Fi or a mobile data plan. Also, make sure that your GPS is on. Do not force-kill the app. It will stay in the background but won’t consume much battery. 
  - You now have two choices to record a trip. The recommended way is to go out and take a walk in your neighborhood. The app will automatically start recording the trip. 
  - Another way is to manually trigger it and log a mocked trip.  See `documentation/mocking_trips.md`. ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/mocking_trips.md))

- Viewing trips, trip segments, and editing the segmentation motion mode: See `documentation/user_manual/viewing_trips.md` ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/user_manual/viewing_trips.md))

### Developer Documentation

- For building and running the A-mission app from source code, with or without a physical Android phone, see `documentation/building_and_running_a_mission_app.md` ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/building_and_running_a_mission_app.md)). 
- For mocking trips to test the trip diary UI without physically doing trips, see `documentation/mocking_trips.md`. ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/mocking_trips.md))
- For obtaining a full backup of the A-mission app from one phone and restoring the backup to a different phone, see `documentation/obtain_full_backup.md`. ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/obtain_full_backup.md)) This is extremely helpful when the developing team uses multiple phones and the data collection phone is different from the phone used for app development purposes. 
- For setting up breakpoints and debugging in the JavaScript UI, see `documentation/chrome_inspect.md`. ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/chrome_inspect.md))
- Data analysis: To match and merge the E-mission data and IMU data on a segment level, see  `documentation/data_analysis.md`. ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/data_analysis.md))

### Special Recognitions

- Special thanks to Prof. Anat Caspi and Motoya Ohnishi for project mentorship!
- Special thanks to K. Shankari for creating the original [E-mission app](https://github.com/e-mission/e-mission-phone/) and suggestions! 
- Special thanks to Bruce Visser for providing detailed insights regarding travel and mobile app accessibility!

