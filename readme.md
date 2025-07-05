<img src="/frontend/src/assets/noot.png" alt="Noot Logo" width="64" style="vertical-align: middle;" />

# Noot
**Noot** is a lightweight desktop application built using **Electron** and **React**, with **NeoDB** as the backend database.  
It’s designed to be fast, intuitive, and run natively across platforms using web technologies.

---

## 🚀 Getting Started

Follow these steps to install and run **Noot** locally on your machine.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd todo

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 2. Build the React Frontend
Move back to the root directory and run:
```bash
cd ..
npm run build-react
```

### 3. Build the Electron App
Open Windows Terminal as Administrator, then run:
```bash
npm run dist
```
### 4. Install the App
Navigate to the dist/ folder and run the installer to install Noot on your system.


## Tech stack
⚛️ React – For the dynamic frontend UI <br/>
⚡ Electron – For building the cross-platform desktop application <br/>
🗃️ NeoDB – A lightweight, local-first database <br/>
