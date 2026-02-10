# 📝 Real-Time Collaborative Document Editor

A high-performance, **Google Docs–style collaborative editor** built with the **MERN Stack** and **TypeScript**.  
This project supports real-time multi-user editing with live cursors, presence indicators, and conflict-free text synchronization.

🚀 **Live Demo:** https://documentlive.pages.dev 
📂 **Video Walkthrough:** https://www.linkedin.com/posts/muhmmad-ahtsham_mernstack-typescript-realtimeeditor-ugcPost-7426901710809448448-h-YY?utm_source=share&utm_medium=member_desktop&rcm=ACoAADeIG5sBt2znvhSnTqOLsD0TQz7JModbtH8

---

## 🌟 Key Features

### 🔄 Real-Time Collaboration
- Powered by **Liveblocks**
- Multi-user editing
- Automatic conflict resolution using **CRDTs**

### 👥 Presence Awareness
- Live cursor tracking
- Text selection highlights
- User presence bubbles in the navigation bar

### 🔐 Full-Stack Type Safety
- **100% TypeScript**
- Strongly typed real-time state and storage
- Safer and more predictable data flow

### 🖼 Media Management
- **Cloudinary** integration
- Optimized image uploads

### 📄 Document Management
- Create, save, and delete documents
- Persistent storage with **MongoDB**

### 📱 Responsive UI
- Modern, clean design
- Built with **Tailwind CSS** and **Next.js**

---

## 🛠 Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React, Tailwind CSS |
| Language     | TypeScript |
| Real-Time    | Liveblocks (CRDTs) |
| Backend      | Node.js, Express.js |
| Database     | MongoDB |
| Media Storage| Cloudinary |

---

## 🏗 Architecture & Technical Challenges

### 1️⃣ Conflict-Free Synchronization
Handling simultaneous edits from multiple users is challenging.  
Instead of basic WebSockets, this project uses **Liveblocks**, which relies on **CRDTs (Conflict-free Replicated Data Types)**. This ensures:
- No data loss
- No manual merging
- All users always see the same document state

### 2️⃣ Scalable Media Handling
Storing images directly in MongoDB can slow down performance.  
To solve this:
- Images are uploaded to **Cloudinary**
- Served via a **global CDN**
- Automatically optimized and resized

### 3️⃣ Type-Safe Real-Time State
Strict **TypeScript interfaces** define:
- Room storage structure
- User presence (cursor position, typing state)

This prevents runtime errors when multiple clients update shared state simultaneously.


npm install

