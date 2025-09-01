# TO DO
## Front
 + UI
  + Global Layout 
  + Send Zone
  + Messages History
  + People List
    + Keep people even when disconnecting
    + Grey out people who are not connected anymore
      + Compare lclUsers VS users from socket

 + UX
  + Play a sound when recieving a new message
    + Check if message is from a different user
  + Keyboard control for sending messages
    + Enter should not add a new line but send the message instead
    + Shift + Enter should add a new line

## Back
 + Handle disconnection
  + Timeout
    + Move user to the disconnectedUsers list
  + Transport Close
    + Move user to the disconnectedUsers list
  + Disconnection button
    + Prompt confirmation before doing anything
    + Just delete user from users
 + Handle reconnection
  + On connection, ask new user if their name is in the disconnectedUsers list.
    + Move user form disconnectedUsers to users if they reconnect