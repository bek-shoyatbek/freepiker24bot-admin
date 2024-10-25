import { useCallback, useEffect, useState } from "react";
import { UserCard } from "../UserCard/UserCard.component";
import { MessageSelectionModal } from "../../Messages/MessageModel/MessageModel.component";
import "./UserListPage.styles.css";
import { UserInterface } from "../../../types/user.interface";
import { Axios } from "../../../Api/axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await Axios.get(`/users`);
      setUsers(response.data?.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch users: ${(err as Error).message}`);
      setLoading(false);
      if (err instanceof AxiosError && err.status == 400) {
        navigate("/login");
      }
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await Axios.get(`/messages`);
      setMessages(response.data?.data);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch messages: ${(err as Error).message}`);
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (filter == "all") {
      setSelectedUsers(users);
    }
    if (filter == "unusedFreeTrial") {
      setSelectedUsers(users?.filter((user) => !user.freeTrialUsed));
    }
  }, [filter, users, selectedUsers]);

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

  const handleUserSelect = (user: UserInterface) => {
    setSelectedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((oldUser) => user.telegramId != oldUser.telegramId)
        : [...prev, user],
    );
  };

  const handleUnselectAll = () => {
    setSelectedUsers([]);
    setFilter("");
  };

  const handleSendNotification = () => {
    setIsModalOpen(true);
  };

  const handleSendMessage = async (messageId: string) => {
    try {
      await Axios.post(`/messages/sendMessage`, {
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
        <div className="button-groups">
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Users
            </button>
            <button
              className={`filter-button ${
                filter === "unusedFreeTrial" ? "active" : ""
              }`}
              onClick={() => setFilter("unusedFreeTrial")}
            >
              Unused Free Trial
            </button>
          </div>
          {selectedUsers.length > 0 && (
            <button className="unselect-button" onClick={handleUnselectAll}>
              Unselect All ({selectedUsers.length})
            </button>
          )}
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
        <button
          className="send-notification-button"
          onClick={handleSendNotification}
        >
          Send Notification ({selectedUsers.length})
        </button>
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
