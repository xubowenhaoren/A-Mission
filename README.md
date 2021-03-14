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

### Constraints and Limitations

### Preliminary, Anecdotal Experimental results

**Users can now change the predicted mode of transportation if it’s not accurate.**

- This can be done by clicking a button on the segment that you want to change, which will bring you to a new page where you can select from a list of modes
- Our needs expert recommended we either use a popup for this functionality or a totally new page altogether, so we opted for a new page because it works more smoothly with TalkBack

**Users can now learn about his/her daily trips with more details.** 

- Users can now review their past trips and learn about the details of these trips and their individual segments by using a screen reader or a braille reader exclusively. 

 **Our app accommodates diverse use**.

- Our improved E-mission app will likely be the most useful for people with motion-related disabilities, but it’s now usable by people with visual impairments as well. 
- Users with visual and auditory impairments, like our needs expert, can interact with the improved E-mission app by using a braille reader too

### Conclusion and Future Directions

### User Manual

### Developer Documentation

### Special Recognitions

- Special thanks to Prof. Anat Caspi and Motoya Ohnishi for project mentorship!
- Special thanks to K. Shankari for creating the original [E-mission app](https://github.com/e-mission/e-mission-phone/) and suggestions! 
- Special thanks to Bruce Visser for providing detailed insights regarding travel and mobile app accessibility!

