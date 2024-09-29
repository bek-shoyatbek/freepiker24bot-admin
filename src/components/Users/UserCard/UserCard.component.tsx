import { useNavigate } from "react-router-dom";
import { UserInterface } from "../types/user.interface";
import "./UserCard.styles.css";

export const UserCard = ({
  user,
  isSelected,
  onSelect,
}: {
  user: UserInterface;
  isSelected: boolean;
  onSelect: VoidFunction;
}) => {
  const navigate = useNavigate();

  return (
    <div className={`user-card ${isSelected ? "selected" : ""}`}>
      <div
        className={`toggle_btn ${isSelected ? "toggled" : ""}`}
        onClick={onSelect}
      ></div>
      <div
        className="user_info"
        onClick={() => {
          navigate(`user/${user._id}`);
        }}
      >
        <h3 className="name">{user.name}</h3>
        {user?.username ? <p className="username">@{user?.username}</p> : ""}
      </div>
    </div>
  );
};
