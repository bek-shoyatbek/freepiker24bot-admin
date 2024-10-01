import { useState, useEffect } from "react";
import { IMessage } from "./types/Message.interface";
import "./Message.styles.css";
import { Axios } from "../../Api/axios";

export const MessagesPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<IMessage>({
    title: "",
    text: "",
  });
  const [editingMessage, setEditingMessage] = useState<IMessage>();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await Axios.get("/messages");
      const data = response.data;
      setMessages(data?.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({ ...prev, [name]: value }));
  };

  const addMessage = async () => {
    try {
      const response = await Axios.post("messages", JSON.stringify(newMessage));
      if (response.status == 200) {
        fetchMessages();
        setNewMessage({ title: "", text: "" });
      }
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  const updateMessage = async (id: string) => {
    try {
      console.log("MessageID ", id);

      const response = await Axios.put(
        `/messages/${id}`,
        JSON.stringify(editingMessage),
      );

      if (response.status == 200) {
        fetchMessages();
        setEditingMessage({ text: "", title: "" });
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const response = await Axios.delete(`/messages/${id}`);

      if (response.status == 204) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="messages-container">
      <h1>Messages</h1>

      <div className="new-message-form">
        <h2>Add New Message</h2>
        <input
          type="text"
          name="title"
          value={newMessage.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
        <textarea
          name="text"
          value={newMessage.text}
          onChange={handleInputChange}
          placeholder="Enter your message here..."
          rows={4}
        />
        <button onClick={addMessage} className="add-button">
          Add Message
        </button>
      </div>

      {messages.map((message) => (
        <div key={message._id} className="message-card">
          {editingMessage && editingMessage._id === message._id ? (
            <>
              <input
                type="text"
                value={editingMessage.title}
                onChange={(e) =>
                  setEditingMessage({
                    ...editingMessage,
                    title: e.target.value,
                  })
                }
              />
              <textarea
                value={editingMessage.text}
                onChange={(e) =>
                  setEditingMessage({ ...editingMessage, text: e.target.value })
                }
                rows={4}
              />
              <div className="button-group">
                <button
                  onClick={() => updateMessage(message._id as string)}
                  className="save-button"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingMessage({ title: "", text: "" })}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>{message!.title}</h2>
              <p>{message!.text}</p>
              <div className="button-group">
                <button
                  onClick={() => setEditingMessage(message)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMessage(message._id as string)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
