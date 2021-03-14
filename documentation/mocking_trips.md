#### Mocking Trips

Bowen Xu

This doc is for mocking trips to test the UI trips without physically doing trips.

1. Build your copy of the E-mission app here, either on a phone or on an emulator: `documentation/building_and_running_a_mission_app.md` ([link](https://github.com/CSE482Winter2021/NameN0tF0und/blob/main/documentation/building_and_running_a_mission_app.md)). 

2. Install the Lockito location simulator app on your phone/emulator: https://play.google.com/store/apps/details?id=fr.dvilleneuve.lockito&hl=en_US&gl=US 
3. Open the Lockito app, agree to all the terms and conditions, and land on the main UI.
   ![img](9pMxs5jPUA7-CI_GC0cmOOJXquGqcHeh0C4iWdLa-LFn-gSgKNY-gG95Egr9BIMX1yjhc2WMBPJN7rfLig4iaymYSlPKHHi_j5moTnqTOeCr07JxxUceCoiV3dSOIG5CC84FCgEz.png)
4. Turn on Developer Options. If you have a phone, look up online for how to do that, because different Android versions have slightly different “Settings” apps. 
   - If you have the emulator as configured in the `documentation/building_and_running_a_mission_app.md`, go to “Settings” -> scroll to the bottom and find “About emulated device” -> Click on the “Build number” 7 times -> Check for a floating text saying “You are now a developer!”.
     ![img](0bjQCt6NKLYN67xKBqO5zy3OogqngxL_ZD8P-N_t6a9ybyegomSQ_q2YpX6VNlAk0_IB_YJLayoh43FS7irf-Vn7C3Wg-HQX3Jk_8ldwMrW9FmDPxfW6gjJvPsdb-925OAhczYmY.png)
5. Go to Developer Options. Use the search bar in “Settings”. Find the option “Select mock location app” and choose Lockito.
   ![img](c_Cgb8kg8gLNZ_jey0W0EKL19tILQzWVHv7IJDiUmWGEgHqsbs3zPxt-C90mKoPnxbmk2-w55DxACdQ4QtDcEffJuCERFlBN7Tqk1TAhH0tCRqaM6SwclNYcMmGhTbCW7CEcceyI.png)
   ![img](gkBT1nF3WEyZNbl_e3sOja7RrUwrLT2GU221kYKej8xWRh0Qlv0m_q7_J1bERW-QIoVpPkgv_XZOvC8UFfmNIunV0ecv332kotVUaYKf4ZkPuhntx6o5EeLnE9dTJnD-54u5qPMI.png)

6. Now you have the option to either draw a trip route in Lockito or just import my trip route file. 

   - Get my trip route file here: `documentation/test.gpx`

   - Move the test.gpx file to your phone/emulator. Follow the screenshots below to import the file.
     First, click the import button. 
     ![img](XDP1R4cYeVaXFGap0e1EEe7ox7cfXYOfWsGW11LeESWXIcisk7Hir_d9MlhPhnGUUCSFZppWa6NZ7ELq5z7qbXgtyppxMSKuLEhJwKstir1hML2SfyLrNDALZWLxeCyec9DBezB9-20210313200920568.png)

     Then, locate your file. 
     ![img](syBmvO_MbDtXVCOX35H5mnzWRIL_apAK0JING-6sWJYk6UKU69WiWc-oePEeDK13ys_gxlKEvU-WNPAlhUvlLrdrN8w3GgOIdF8U2HgeLMBByv9baNkCe5LQXFtzwHr1Jc5Z46OC.png)

     Finally, click import. 
     ![img](E2LLEg0km8Ncm8keU_0RHZuqAjSui7cN80E2G1S8E9ZesHOM6D7TlcnP-QJDZJYHnNkZzIdZqJdBxj2hhjR_4KX6RN9dRNKD6l8B0FtJTMzN_TzGHlArnf-kseYcPUt0LyABSM7K.png)

8. Force-trigger a trip in E-mission. Go to the E-mission profiles tab, then click “Developer zone”. 

   ![img](i1hSVySP8fpj5LvQYTGz0wsf1G0Qi6hPOGEZRq9CmWI2eCdFPpWJRaAbBlbR92JcqwFX90SS-hIoXrVUdZCkhUfGTZKFKNwII0mPZ1qbzhAk9sMdrc_5me5mA9o4Otz6dVIGuDFu.jpeg)
   Then find the waiting_for_trip_start option. Change it to “Start trip”. 
   ![img](K9fFYZPrp_Ic6VYXmGxykXc8iRmxceRQBGemB3zKut8nNHrvqpfZ2TIYm1ART7MJwhApN99x-9IoMt6dobB1oJS459SlxxULhe2EDlk0izLiW--PgPpjInEmiKX5iWFn-DmmzK77.jpeg)

9. Go back to Lockito and find your trip route (whether you imported or drew your own). Click it then click “Play”. 
   ![img](https://lh3.googleusercontent.com/ne6izyOJI2zjtMaqvsxmL3Lwyr5lPkgqhmIX0f2zihWaIGHkdqrNKm-BA6BmHDs7YHaXLt6NoOvoLRLcwAdGVdckp7ggHqAPX4haNytX97xVzJ32h2ICRNZneH3WzzTMYPrsw2IF)
   ![Screenshot_2021-03-13-20-14-49-722_fr.dvilleneuve.lockito](Screenshot_2021-03-13-20-14-49-722_fr.dvilleneuve.lockito.jpg)

10. Once the pointer stops moving, leave it untouched for roughly 10 seconds. Then click “stop”. 
    ![Screenshot_2021-03-13-20-17-19-775_fr.dvilleneuve.lockito](Screenshot_2021-03-13-20-17-19-775_fr.dvilleneuve.lockito.jpg)
11. Go back to E-mission and “end trip”. 
    ![img](V8WrxE1oDi8XjE7673BwDZTG8IKT2H-mwKsvELVbM157VjswRI6OKMuwuhMErCyMA-Bp_OGStBhkXkUZU-7WjQvlf3JzK59Ugu4SiYJcyiU7kE23kKA-6iyEQIwCjWsZ65H5gJ1C.jpeg)
12. Now go to E-mission “Dairy” tab and pull to refresh. You should see a trip diary. 
13. If you see something that looks terribly wrong and unrealistic - time to draw your own route in Lockito that begins & ends with your nearby places!
    - If you use the simulator, use the built-in Location tool to modify the default simulator GPS. This helps E-mission better understand your start location. 
      ![img](LjOy3YG8GdmxkFJVsnRGu-BRf27jyQ1HQFKQPMdxpPtSu-_sBUutjR49fJQC5J_IC9OS7lOF6y5UmU591TfpmC56WG3KJj_woqXBoLZ0rESUTw4hEKxepPi2cyWlVtGMt7VdJZQH.png)