# FleetPro — Simple Fleet Management System

A lightweight, browser-based fleet management web app built with **plain HTML, CSS and JavaScript**. It helps manage vehicles, drivers and bookings from a single dashboard — no server, no database, no installation.

![Made with HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Made with CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Made with JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📌 About

Small transport businesses usually track their fleet in notebooks or Excel sheets — records get lost, entries get duplicated, and nobody knows the real status of a trip.

**FleetPro** solves this with one clean dashboard where every vehicle, driver and trip booking is stored, searchable and editable in seconds.

It runs entirely in the browser and saves data using `localStorage`, so it works offline and needs no backend.

---

## ✨ Features

| Module | What it does |
|---|---|
| **Authentication** | Register and log in with email + password |
| **Roles** | Admin, Manager and Driver — with enforced permissions |
| **Dashboard** | Live counters for vehicles, drivers, total bookings and pending bookings |
| **Vehicles** | Add, search, edit and delete vehicles with status — Available / In Use / Maintenance |
| **Drivers** | Manage driver name, phone and duty status — Available / On Duty / Off Duty |
| **Bookings** | Create trips with pickup, destination, date and status — Pending / Approved / Completed / Cancelled |
| **Search** | Instant live search across vehicles, drivers and bookings |
| **Filter** | Filter bookings by status |
| **Reports** | One-click fleet summary |
| **Responsive** | Works on desktop, tablet and mobile |

---

## 🔐 Roles & Permissions

| Action | Admin | Manager | Driver |
|---|:---:|:---:|:---:|
| View all records | ✅ | ✅ | ✅ |
| Add / edit / delete records | ✅ | ✅ | ❌ |
| Update booking status | ✅ | ✅ | ✅ |

Permissions are enforced in **two layers**: the entry forms are hidden from drivers, and every write function checks the role in code before running.

---

## 🚀 Getting Started

No installation, no build step, no dependencies.

```bash
git clone https://github.com/your-username/fleetpro.git
cd fleetpro
```

Then simply **open `index.html`** in any modern browser.

Or serve it locally:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

### Demo login

```
Email:    admin@fleetpro.com
Password: admin123
```

Or register a new account and pick **Manager** or **Driver** as the role.

---

## 📁 Project Structure

```
fleetpro/
├── index.html      # Structure — all pages, forms and lists
├── style.css       # Design — layout, colours, responsive rules
├── script.js       # Behaviour — events, CRUD, storage, permissions
└── README.md
```

Three files, three responsibilities:

- **`index.html`** — the skeleton. Every element carries an `id` so the other layers can find it.
- **`style.css`** — the skin. Flexbox and grid layout, a limited colour palette, and a `@media` query at 700px for mobile.
- **`script.js`** — the brain. Listens for events, changes the data, saves it, then rebuilds the screen.

---

## ⚙️ How It Works

```
User action  →  Event listener  →  Permission check  →  Update array
             →  saveData()  →  localStorage (JSON)  →  renderAll()
```

**Data model** — four arrays of objects persisted in `localStorage`:

| Key | Shape |
|---|---|
| `fleetUsers` | `[{ name, email, password, role }]` |
| `fleetVehicles` | `[{ id, name, number, status }]` |
| `fleetDrivers` | `[{ id, name, phone, status }]` |
| `fleetBookings` | `[{ id, pickup, destination, date, status }]` |

**Key functions**

| Function | Purpose |
|---|---|
| `saveData()` | Serialise all four arrays with `JSON.stringify` into `localStorage` |
| `renderAll()` | Rebuild every list, counter and report from the data |
| `canManage()` | Return `true` only for Admin and Manager |
| `safeText()` | Sanitise user input before displaying it (blocks HTML injection) |
| `openApp()` / `logout()` | Switch between the auth screen and the app |

After every change, `renderAll()` is called — the screen is always rebuilt from the data, so the UI can never fall out of sync.

---

## ⚠️ Known Limitations

- Data is stored **per browser** — it is not shared between devices or users
- Passwords are stored in plain text (fine for a demo, **not** for production)
- No automatic backup or export
- Single-user session only

---

## 🗺️ Roadmap

- [ ] Backend with Node.js / Express + MongoDB (or PHP + MySQL)
- [ ] Password hashing with bcrypt
- [ ] JWT-based sessions with proper auth
- [ ] GPS / live vehicle tracking
- [ ] Trip assignment: link a booking to a specific vehicle and driver
- [ ] CSV / PDF export for reports
- [ ] Email notifications for bookings
- [ ] Dark mode

---

## 🛠️ Built With

- **HTML5** — semantic markup
- **CSS3** — flexbox, grid, media queries
- **Vanilla JavaScript (ES5)** — DOM manipulation, events, `localStorage`
- **Zero dependencies** — no frameworks, no libraries, no CDN

---

## 🤝 Contributing

Contributions are welcome. Fork the repo, create a branch, and open a pull request.

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify and share.

---

## 👤 Author

**[Your Name]**
[Your College / Class]
[Your Email] · [Your LinkedIn] · [Your GitHub]

---

⭐ If you found this project useful, please consider giving it a star.
