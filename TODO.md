# TO DO
## Front
 + UI
  + Global Layout
    + Chat history in center, overflow on top, scroll at the lowest
    + People List appears on the right upon pressing a button

  + Handle server disconnection
    + If connection is lost with the server : reset messages and users.

## Back
 + Handle disconnection
  + Timeout
    + Move user to the disconnectedUsers list
    + Delete users from disconnectedUsers list after 10 minutes
  + Transport Close
    + Move user to the disconnectedUsers list
    + Delete users from disconnectedUsers list after 10 minutes
  + Disconnection button
    + Prompt confirmation before doing anything
    + Just delete user from usersi

## Other
 + Documentation
   + docker
