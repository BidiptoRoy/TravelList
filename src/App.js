import { useState } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Condoms", quantity: 12, packed: false },
//   { id: 4, description: "Water", quantity: 1, packed: true },
//   { id: 5, description: "Shoes", quantity: 2, packed: true },
// ];

function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(items) {
    setItems((currItems) => [...currItems, items]);
  }
  function handleDelete(id) {
    setItems((currItems) => currItems.filter((e) => e.id !== id));
  }
  function handleToggleItem(id) {
    setItems((currItems) =>
      currItems.map((el) => {
        if (el.id !== id) return el;
        else return { ...el, packed: !el.packed };
      })
    );
  }
  function deleteList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );

    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItems={handleDelete}
        onToggleItems={handleToggleItem}
        onDelete={deleteList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1> 🌴 Far away from home 💼</h1>;
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    // console.log(newItem);
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Add what you need for your trip</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((e) => (
          <option value={e}>{e}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onDeleteItems, onToggleItems, onDelete }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  // const handleDelete = function () {
  //   deleteList();
  // };

  if (sortBy === "input") sortedItems = items;

  // slice is used to create a new array as sort is a mutating method
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((e) => (
          <Item
            item={e}
            key={e.id}
            onDeleteItems={onDeleteItems}
            onToggleItems={onToggleItems}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={() => onDelete()}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItems, onToggleItems }) {
  const handleClick = function () {
    onDeleteItems(item.id);
  };
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItems(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={handleClick}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <div className="stats">
        <em> Start placing your items 🏸🏸</em>
      </div>
    );

  const numItems = items.length;
  const packed = items.filter((item) => item.packed).length;
  const percent = Math.round((packed / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {percent === 100
          ? "All packed! Enjoy your trip ✈️"
          : `You have ${numItems} items in your list and you have placed ${packed}
        items (${percent}%)`}
      </em>
    </footer>
  );
}

export default App;
