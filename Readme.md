# Offline-First Architecture – Implementation Strategy & Insights

This document outlines the strategic steps, challenges, and tools related to implementing offline-first capabilities in modern frontend/backend applications.


## 1. Outline the initial steps you would take to transition the frontend/backend to support an offline-first approach.

First, I’d add local storage to save the user's login state and task list so the app can still work without internet. Then, I’d use something like IndexedDB (or a simpler tool like localForage) to store data more reliably. I’d also set up a system that quietly saves changes in the background and syncs them once the user is back online. On the backend, I’d create APIs that can handle multiple updates at once. Finally, I’d make sure to deal with any data conflicts using timestamps or simple version checks.

## 2. Drawing from your own experience with offline functionalities, what challenges have you encountered when implementing or maintaining offline modes?

One of the main challenges that I might faced with offline mode was keeping the data in sync when the user comes back online. Sometimes users made changes while offline that clashed with newer updates from the server. Another issue that i might faced will be of making sure the app didn't break when storage limits were hit or when offline data became outdated. It was also tricky to handle login states securely while offline. These small things can easily pile up if not planned early.


## 3. How did you overcome these challenges, or what solutions did you implement?

The main challenge was to create and update the checklist of a task properly through the backend. I solved this by setting up dedicated API routes 
that is /:taskId/checklist for adding and /:taskId/checklist/:itemId for updating checklist items. I implemented logic on the frontend to instantly update the UI state using setTasks, which adds or updates checklist items locally by matching taskId and itemId. This gave users immediate feedback. On the backend, I created two separate APIs one for adding and one for updating checklist items with proper validation, user authorization, and MongoDB updates using task.checklist.push() and item mutation. Together, this setup ensured that both frontend and backend stayed in sync and handled errors properly.

## 4. Are there any particular tools, libraries, or practices you've found especially helpful or problematic in this context?

One thing that was helpful and new for me was using a custom axiosInstance with interceptors. It made handling success and error messages with toast notifications much easier and cleaner across the app.It helps to avoid unnecesary try catch block at every function

## 5. Are there any emerging technologies or trends that might influence how we think about offline experiences?

Yes, there are a few emerging trends that are changing how we think about offline experiences. Progressive Web Apps (PWAs) are getting more popular, making web apps feel like native apps even without internet.

## Getting Started
To run the app locally, follow these steps:

# Clone the repository

    git clone [<your-repo-url>](https://github.com/Proxmair/task-manager.git)
    cd <your-project-folder>
# 
# Install dependencies
    Run the following command inside both the frontend and backend folders:
    cd frontend
    npm install

    cd ../backend
    npm install

# In the frontend folder: 
    cd frontend
    npm run dev

# In the backend folder: 
    cd backend
    npm run dev
