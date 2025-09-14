# TO DO
## Front
 + UI
  + Global Layout
    + Chat history in center, overflow on top, scroll at the lowest
    + Send Zone at the bottom of the chat history
    + People List appears on the right upon pressing a button
  + Messages
    + Keep new lines and spaces.

## Back
 + Handle disconnection
  + Timeout
    + Move user to the disconnectedUsers list
  + Transport Close
    + Move user to the disconnectedUsers list
  + Disconnection button
    + Prompt confirmation before doing anything
    + Just delete user from users