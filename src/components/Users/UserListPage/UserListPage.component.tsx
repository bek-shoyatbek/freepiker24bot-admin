import { useCallback, useEffect, useState } from "react";
import { UserInterface } from "../types/user.interface";
import { API_BASE_URL } from "../../../constants";
import axios from "axios";
import { UserCard } from "../UserCard/UserCard.component";
import { MessageSelectionModal } from "../../Messages/MessageModel/MessageModel.component";
import "./UserListPage.styles.css";

export const UserListPage = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unusedFreeTrial" | "">("");
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        timeout: 10 * 1000,
      });
      setUsers(response.data?.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch users: ${(err as Error).message}`);
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages`, {
        timeout: 10 * 1000,
      });
      setMessages(response.data?.data);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch messages: ${(err as Error).message}`);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, [fetchUsers, fetchMessages]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telegramId.includes(searchTerm);

      return matchesSearch;
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm, filter]);

  useEffect(() => {
    if (filter == "all") {
      setSelectedUsers(users);
    }
    if (filter == "unusedFreeTrial") {
      setSelectedUsers(users?.filter((user) => !user.freeTrialUsed));
    }
  }, [filter, users, selectedUsers]);

  const handleUserSelect = (user: UserInterface) => {
    setSelectedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((oldUser) => user.telegramId != oldUser.telegramId)
        : [...prev, user],
    );
  };

  const handleSendNotification = () => {
    setIsModalOpen(true);
  };

  const handleSendMessage = async (messageId: string) => {
    try {
      await axios.post(`${API_BASE_URL}/messages/sendMessage`, {
        userIds: selectedUsers.map((user) => user.telegramId),
        messageId,
      });
      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification. Please try again.");
    }
    setIsModalOpen(false);
    setSelectedUsers([]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-container">
      <h1>User List</h1>
      <div className="user-list-header">
        <p>Total Users: {users.length}</p>
        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Users
          </button>
          <button
            className={`filter-button ${filter === "unusedFreeTrial" ? "active" : ""}`}
            onClick={() => setFilter("unusedFreeTrial")}
          >
            Unused Free Trial
          </button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {selectedUsers.length > 0 && (
        <div className="selected-users">
          {selectedUsers?.map((selectedUser) => (
            <p key={selectedUser.telegramId} className="selected-user">
              {selectedUser?.username ?? selectedUser?.name}
            </p>
          ))}
          <button
            className="send-notification-button"
            onClick={handleSendNotification}
          >
            Send Notification ({selectedUsers.length})
          </button>
        </div>
      )}
      <div className="user-grid">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.telegramId}
            user={user}
            isSelected={selectedUsers.includes(user)}
            onSelect={() => handleUserSelect(user)}
          />
        ))}
      </div>
      {filteredUsers.length === 0 && <p>No users found.</p>}
      <MessageSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={handleSendMessage}
        messages={messages}
      />
    </div>
  );
};
