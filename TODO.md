# TO DO
## Front
 + UI
  + Global Layout
    + Chat history in center, overflow on top, scroll at the lowest
    + Send Zone at the bottom of the chat history
    + People List appears on the right upon pressing a button

 + UX
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