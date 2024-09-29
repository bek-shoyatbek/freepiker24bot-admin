import { useState } from "react";
import { IMessage } from "../types/Message.interface";
import "./MessageModel.styles.css";

export const MessageSelectionModal = ({
  isOpen,
  onClose,
  onSend,
  messages,
}: {
  isOpen: boolean;
  onClose: any;
  onSend: any;
  messages: IMessage[];
}) => {
  const [selectedMessage, setSelectedMessage] = useState<string>();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select a Message</h2>
        <select
          value={selectedMessage}
          onChange={(e) => setSelectedMessage(e.target.value)}
        >
          <option value="">Select a message</option>
          {messages.map((message) => (
            <option key={message._id} value={message._id}>
              {message.title}
            </option>
          ))}
        </select>
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onSend(selectedMessage)}
            disabled={!selectedMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
