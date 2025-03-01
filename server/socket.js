import { socketIo } from "socket.io";

export default (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Listen for messages from client
    socket.on("message", (data) => {
      console.log("Message received:", data);

      // Send message back to all clients
      io.emit("message", data);
    });

    // Disconnect Event
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
