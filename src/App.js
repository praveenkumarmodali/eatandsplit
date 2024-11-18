import { useState } from "react";

// re-usable button component
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState([]);
  const [showAddfriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleFormOpen() {
    setShowAddFriend((open) => !open);
  }
  function handleFormClose() {
    setShowAddFriend(false);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleDeleteFriend(id) {
    const alert = window.confirm(
      "This action won't be undo. Confirm to delete the Friend"
    );
    if (alert) {
      setFriends((friends) => friends.filter((friend) => friend.id !== id));
    }
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    const alert = window.confirm(`Confirm to Split the bill with your Friend `);
    if (alert) {
      setFriends((friends) =>
        friends.map((friend) =>
          friend.id === selectedFriend.id
            ? { ...friend, balance: friend.balance + value }
            : friend
        )
      );
    }
    setSelectedFriend(null);
  }

  return (
    <div>
      <Header />
      <div className="app">
        <div className="sidebar">
          <FriendsList
            friends={friends}
            handleDeleteFriend={handleDeleteFriend}
            handleSelection={handleSelection}
            selectedFriend={selectedFriend}
          />
          {showAddfriend ? <FormAddFriend onAddFriend={handleAddFriend} /> : ""}
          {showAddfriend ? (
            <Button onClick={handleFormClose}>Close</Button>
          ) : (
            <Button onClick={handleFormOpen}>Add Friend</Button>
          )}
        </div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            handleSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <h1 style={{ display: "flex", justifyContent: "center", fontSize: "80px" }}>
      Split the Bill
    </h1>
  );
}

function FriendsList({
  friends,
  handleDeleteFriend,
  handleSplitForm,
  handleSelection,
  selectedFriend,
}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleDeleteFriend={handleDeleteFriend}
          handleSplitForm={handleSplitForm}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({
  friend,
  handleDeleteFriend,
  handleSelection,
  selectedFriend,
}) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} ows you {friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => handleSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
      <Button onClick={() => handleDeleteFriend(friend.id)}>
        Delete Friend
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleFormSubmit(event) {
    event.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>😁 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>😁 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const [whoIsPaying, setwhoIsPaying] = useState("user");
  const friendExpense = bill ? bill - expense : "";

  function handleFormSubmit(event) {
    event.preventDefault();
    if (!bill || !expense) return;
    handleSplitBill(whoIsPaying === "user" ? friendExpense : -expense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleFormSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>🙂 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🙂 Your expense</label>
      <input
        type="text"
        value={expense}
        onChange={(e) =>
          setExpense(
            Number(e.target.value) > bill ? expense : Number(e.target.value)
          )
        }
      />

      <label>🙂 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>😄 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
