C.O.S.O
---

Definition of environment
    - plane with a certain area -> game area

Main Player
    - can move through the game area via controller
        -> yes, but due async event if something is delayed there is a "jump" effect
    - can go in automode with a certain route

Solution
---
Record the movement of the player and then play them.
--> this requires to action:
    - record
    - stop
    - play