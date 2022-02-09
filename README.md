# Overview

This application is based on a simulation of collective dynamics of sheeps in a herd. The behaviour of the herd is used to generate music, the user is encouraged to affect both these aspects in various ways.

![alt text](https://user-images.githubusercontent.com/93775089/150184610-32237c7f-551c-4ae5-b6ee-ad807afafb73.png)

# Behavioral Modeling
Sheeps are represented by point-like agents able to perceive and respond to their local environment.

Stationary sheeps don’t change their position, while walking and running ones do.

![image](https://user-images.githubusercontent.com/93775089/153219875-6e38a6ed-57d0-424a-908d-d90725a1ad05.PNG)

Given the three states for each sheep as 0 for stationary, 1 for walking and 2 for running, a sheep decides whether to change its state according to the following probabilities.

![image](https://user-images.githubusercontent.com/93775089/153220502-38d74ed8-0e55-4fce-998c-881ae29bf7a5.PNG)

Here's a video showing some of the dynamics that result from the model.

https://user-images.githubusercontent.com/93775089/153226152-7b1c399c-bf97-4f19-b011-de88cbe9cf76.mp4

The user is encouraged to change some of the parameters that govern the behaviour using the sliders.

# Music Modeling

The user can select the scale in which the sheeps play, as well as the mode, the waveshape, the bpm, whether or not to have drums playing along and a delay effect with multiple time signatures of their choice.

![alt text](https://user-images.githubusercontent.com/93775089/150190908-49604bb8-99c6-45ce-b3f8-7b08ab60802c.png)
![alt text](https://user-images.githubusercontent.com/93775089/150185115-ac91c13d-3eb3-4ab4-a990-d035198ec0b2.png)

![alt text](https://user-images.githubusercontent.com/93775089/150185124-e2ad6875-cd35-4c90-8af2-f2d17ebf0135.png)

# User Interaction

The application features binaural audio effects, it is therefore recommended to use headphones. 

Sound is perceived as if the user were in the position of the sheperd (listener), in respect to the centroid of the herd (source). The user can control the sheperd using WASD and listen to the music moving around them. Drums are heard moving all around the listener.

![alt text](https://user-images.githubusercontent.com/93775089/150187931-3e6f71bb-5482-44ad-a384-7b746295687e.png) ![alt text](https://user-images.githubusercontent.com/93775089/150185127-a3649807-013a-42ca-afb4-66dfb1cd8558.png)

The user can also scare the sheeps using the microphone, the sound intensity threshold is a function of the distance between the sheperd and the centroid of the herd, meaning you need softer sounds if the sheperd is closer to the herd.
However, moving the sheeps towards the boundary of the field only results in them being shocked.

![alt text](https://user-images.githubusercontent.com/93775089/150188553-eae27a90-d122-4d61-9e84-2e813792fdbc.png) ![alt text](https://user-images.githubusercontent.com/93775089/150189208-05c1164f-3fab-4af7-932a-530ef912ebc1.png)

Here's a clip showing how sheeps react to external inputs.

https://user-images.githubusercontent.com/93775089/153227489-03732bc1-dbfe-4e6d-aca8-1e640630928a.mp4

# Challenge Mode
Furthermore, the user may try out Challenge Mode, in which a series of grass patches appears and the user must scare the sheep towards the patches in order to feed them and bring them back in the little house before the wolf comes after time runs out.
While in Challenge Mode, the control over the modal scales is suspended, as it depends on how happy the sheeps are (which is related to the amount of grass they ate).

Here's a video showing how this works.

https://user-images.githubusercontent.com/93775089/153228129-f591c0d2-d01f-4864-b530-887b572fe7bc.mp4


Have fun!



