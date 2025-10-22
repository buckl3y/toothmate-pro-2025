# ToothMate Professional

## Table of Contents

- [Introduction](#introduction)
  - [Description](#description)
  - [Project Summary and Purpose](#project-summary-and-purpose)
- [Previous GitHub Folders](#previous-github-folders)
- [Requirements](#requirements)
- [Technical Stack](#technical-stack)
- [Live Hosting](#live-hosting)
- [Installation](#installation)
  - [Installing the Frontend](#installing-the-frontend)
  - [Installing the Backend](#installing-the-backend)
- [Website Hosting](#website-hosting)
- [Workflow](#workflow)
- [Usage](#usage)
  - [Homepage](#homepage)
  - [Tooth View Component](#tooth-view-component)
  - [Patient History Component](#patient-history-component)
  - [Patient Information Component](#patient-information-component)
  - [Notes Component](#notes-component)
  - [X-ray History Component](#x-ray-history-component)
- [Migrating to Other Hosting Services](#migrating-to-other-hosting-services)
  - [Migrating to Vercel](#migrating-to-vercel)
  - [Migrating to Netlify](#migrating-to-netlify)

---

## Introduction

### Description

ToothMate is dedicated to enhancing oral healthcare and making it more accessible for everyone. Driven by a vision to educate people about oral health and ensure that care is available for future generations, our current focus is on ToothMate Professional—a tool designed to assist dental professionals in their daily work. This project builds on the efforts of previous teams and aims to refine existing features for better performance.

### Project Summary and Purpose

The goal of ToothMate Professional is to streamline the workflow of dental professionals by improving the dental charting interface and adding features like deciduous dental charting. We're committed to creating a user-friendly interface that aligns with modern standards, making the software both practical and functional.

This project serves as a demonstration of ToothMate Professional's capabilities to attract interest from potential investors. By focusing on key areas such as dental charting, user interface improvements, and voice transcription, we aim to reduce the time dentists spend on paperwork, allowing them to focus more on patient care. Ultimately, we aim to deliver a working prototype that meets current needs and supports better care for future generations.

**Live Website Link:** [https://two024-toothmate-client.onrender.com/](https://two024-toothmate-client.onrender.com/)

---

## Previous GitHub Folders

- [2023-toothmate](https://github.com/huneybadger101/Tooth-Mate/tree/main)
- [SuiteCRM](https://github.com/huneybadger101/SuiteCRM-7.13.2)

---

## Requirements

- [Node v20.14.0](https://nodejs.org/en/blog/release/v20.14.0)
- [Git](https://git-scm.com/downloads)
- Text Editor or IDE ([VSCode](https://code.visualstudio.com/download) is recommended)

---

## Technical Stack

- HTML
- CSS
- JavaScript
- React
- ExpressJS

---

## Live Hosting

- [Render.com](https://render.com/) (Two servers for the client-side and server-side running from the main branch)

---

## Installation

Before starting, ensure you have the requirements installed as stated above. To get started, clone the repository:

```
git clone https://github.com/Minsukim2827/2024-toothmate.git
```

### Installing the Frontend

1. **Navigate to the frontend directory:**
```
cd 2024-toothmate/2024-client
```

2. **Install dependencies:**
```
npm install
```

3. **Create a `.env` file in your `2024-client` directory and add the following:**
```
VITE_SERVER_URL=http://localhost:5000
```

4. **Run the client:**
```
npm run dev
```

### Installing the Backend

1. **Navigate to the backend directory in another terminal:**
```
cd 2024-toothmate/2024-server
```

2. **Install dependencies:**
```
npm install
```

3. **Create a `.env` file in your `2024-server` directory and add the following:**
```
PORT=5000
```

4. **Run the server:**
```
node server.js
```

The local website should be viewable at [http://localhost:3000/](http://localhost:3000/)

---

## Website Hosting

On Render, create a **Web Service** and a **Static Site** service. The Static Site will serve as hosting for the frontend (client), and the Web Service will serve as hosting for the backend (server).

![Render Services](https://github.com/user-attachments/assets/180d357a-e472-4df7-aa87-1d34f3768e65)

In your Web Service, navigate to the **Environment** tab, and add a new environment variable:

- **Key:** `PORT`
- **Value:** `5000`

![Web Service Environment Variable](https://github.com/user-attachments/assets/d106e596-269b-4f02-a3ee-53955d6b8a61)

In your Static Site, navigate to the **Environment** tab, and add a new environment variable:

- **Key:** `VITE_SERVER_URL`
- **Value:** (The URL of your Web Service)

![Static Site Environment Variable](https://github.com/user-attachments/assets/c2121a5b-963f-4a44-8f3d-709dfdbd657a)

---

## Workflow

1. **After cloning the repo, create a new branch:**
```
git checkout -b <your-branch-name>
```


2. **To stage and commit changes:**
```
git add .
git commit -m "Your commit message here"
git push
```

3. **If you come back after some time, update your repo to the latest version from GitHub before working on development:**
```
git pull
```


---

## Usage

### Homepage

After running the server, this will be your homepage:

![Homepage](https://github.com/user-attachments/assets/2502498e-78c6-4e6e-bb05-45363ef4b274)

You can toggle between the Dentist view and Administration view by clicking the image on the navbar:

![Toggle Views](https://github.com/user-attachments/assets/1376eee2-f27e-451c-b8df-c87a6364a397)

You can search for the NHI number in the search bar. This is case-insensitive (e.g., `nH123`), and can be either the digits of the NHI number (e.g., `123`), or the full NHI number itself (e.g., `NH123`). This will give you the patient information.

![Search NHI](https://github.com/user-attachments/assets/4b30caa6-898c-4fe4-b6f6-9fb0b74df7db)

In the Dentist view, in the search bar, search for the patient's name or NHI number:

![Dentist View Search](https://github.com/user-attachments/assets/d16a09a3-13e0-44db-a14f-25233b65c53c)

Alternatively, you can create a new patient by clicking the **Add New Patient** button:

![Add New Patient](https://github.com/user-attachments/assets/043ffe5c-b06a-4fba-872e-2f97f760e1ba)

When selecting a patient, this will bring up the **Patient Dashboard**:

![Patient Dashboard](https://github.com/user-attachments/assets/406ed5b2-de67-42d0-920d-ff2689543908)

---

### Tooth View Component

In the **Tooth View** component, you can add or remove teeth. You can also reset the view by clicking the **Reset View** button:

![Tooth View Component](https://github.com/user-attachments/assets/9dcb08e4-163f-4e50-b248-7b649d28f038)

If you hover over a tooth and select it, it will pop up with the periodontal view. In this view, you can view the current tooth selected, treatment options, tooth surface, and treatment summary.

![Periodontal View](https://github.com/user-attachments/assets/1cff80a5-ae3b-4ff4-a7d7-78d5e314dcd2)

---

### Patient History Component

In the **Patient History** component, you can navigate between different records:

![Patient History](https://github.com/user-attachments/assets/ab60bdaf-40bf-4041-9a41-87d8bd6e0c29)

You can also add a new entry into Patient History for all the current changes made:

![Add New Entry](https://github.com/user-attachments/assets/e771e01f-a5c7-4173-8a1e-a1f53881b18d)

The red notification icon will bring up the **Caution Information**:

![Caution Information](https://github.com/user-attachments/assets/7215e385-64a0-4e92-aa65-4b5adccd6360)

---

### Patient Information Component

In the **Patient Information** component, the patient's details are displayed:

![Patient Information](https://github.com/user-attachments/assets/63470f7c-84ce-42e6-8be9-2b40f09f4755)

---

### Notes Component

In the **Notes** component, you can see the notes written for that particular Patient History record:

![Notes Component](https://github.com/user-attachments/assets/17da1963-bf3d-4309-a781-bd1895301828)

---

### X-ray History Component

In the **X-ray History** component, the X-ray images are displayed with their dates:

![X-ray History](https://github.com/user-attachments/assets/e5bd5f92-669b-462a-b176-f735b93b0a49)

Clicking the **View All** button will show a popup window. You can toggle between the different views:

![X-ray Popup View 1](https://github.com/user-attachments/assets/2aa9c402-f76e-4f8c-acaf-f33a21084203)
![X-ray Popup View 2](https://github.com/user-attachments/assets/ff9d0771-f679-4fef-b87f-126c333858f4)
![X-ray Popup View 3](https://github.com/user-attachments/assets/3806da35-9529-4aca-950c-2a177e3da31f)

There is also a feature to upload an image by clicking on the **Upload X-ray** button:

![Upload X-ray](https://github.com/user-attachments/assets/48133450-0853-4f1a-af17-1c33595a13ac)

---

## Migration to Other Hosting Services

While the project is currently hosted on Render, it can be easily migrated to other popular hosting services like Vercel or Netlify. Here's a brief guide on how to do this:

---

### Migrating to Vercel

1. Sign up for a Vercel account: Go to Vercel's website and create an account if you don't have one.
  
2. Install Vercel CLI: Install the Vercel Command Line Interface by running:
```
npm i -g vercel
```
3. Deploy the frontend
  - Navigate to the `2024-client` directory
  - Run `vercel` and follow the prompts
  - Set the build command to `npm run build`
  - Set the output directory to `dist`

4. Deploy the backend:
  - Navigate to the `2024-server` directory
  - Create a `vercel.json` file with the following content:
```
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```
  - Run vercel and follow the prompts
  - 
5. Set environment variables: In the Vercel dashboard, set the necessary environment variables for both the frontend and backend projects.

---

### Migrating to Netlify
1. Sign up for a Netlify account: Go to Netlify's website and create an account if you don't have one.
  
2. Deploy the frontend:
  - In the Netlify dashboard, click "New site from Git"
  - Connect to your GitHub repository
  - Set the build command to `npm run build`
  - Set the publish directory to `dist`

3. Deploy the backend:
  - Create a `netlify.toml` file in the root of your project with the following content:
```
[build]
  command = "cd 2024-server && npm install"
  functions = "2024-server/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```
- Create a `functions` directory in the `2024-server` folder
  - Move your `server.js` file to the `functions` directory and rename it to `api.js`
  - Modify `api.js` to export your Express app as a Netlify function
 
4. Set environment variables: In the Netlify dashboard, set the necessary environment variables for both the frontend and backend projects.

Remember to update your frontend code to use the new backend URL after migration. Also, ensure that all dependencies are properly listed in your `package.json` files for both frontend and backend.
