# TO DO
## Front
 + UI
  + Connection
    + Name input and button (ok)
    + Display offlineUsers and if user clicks on of the name, it copie it in the name input
  + Global Layout
    + Chat history in center, overflow on top, scroll at the lowest
    + Send Zone at the bottom of the chat history
    + People List appears on the right upon pressing a button

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