# Reverse Infinite Scroll with React & Virtualization

## 🚀 Overview

This repository demonstrates a **React** implementation of **reverse infinite scroll** with **virtualization**. It optimizes performance by rendering only the visible items in the list, improving scroll smoothness and reducing DOM size.

Perfect for applications like **chat apps**, **feeds**, and any **dynamic lists** that require infinite scrolling where older items are loaded as the user scrolls upward.

---

## 📦 Features

- **Reverse Infinite Scroll**: Loads older items as the user scrolls up.
- **Virtualization**: Renders only visible items, drastically reducing DOM nodes for optimal performance.
- **React**: Built with **React** hooks, making it easy to understand and implement.

---

## 📋 How It Works

In reverse infinite scroll, when the user scrolls up, new data is **prepended** to the list. Without **virtualization**, the browser must render all the elements in the list, which becomes inefficient as the list grows.

### Problem Without Virtualization:
- The app becomes slow as more items are added to the DOM.
- Memory usage increases, leading to potential crashes or slowdowns.
- Scrolling becomes janky, especially on mobile or low-performance devices.

### Solution with Virtualization:
- **Virtualization** renders only the items currently visible in the viewport.
- As the user scrolls, new items are loaded and added to the DOM dynamically, while old items are removed when they are no longer visible.

This keeps the list **lightweight**, **fast**, and responsive, no matter how large the dataset grows.

---

## 🛠 Setup & Usage

### Prerequisites

- Node.js (v14 or higher)

### Clone the repository:
   
  ```
   git clone https://github.com/your-username/reverse-infinite-scroll-react-virtualization.git
   cd reverse-infinite-scroll-react-virtualization
  ```

### Install Dependencies

```
npm install
```

### Run the App

```
npm start
```

# 🤝 Contributing
Contributions are welcome! Feel free to fork the repository, create an issue, or submit a pull request.

# 📄 License
This project is licensed under the MIT License
