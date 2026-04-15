📁 PATHSHARE PHASE 1 - FOLDER STRUCTURE
======================================

pathshare-app/
├── 📁 src/
│   ├── main.js                    # Entry point
│   ├── App.vue                    # App shell
│   │
│   ├── 📁 router/
│   │   └── index.js               # Route definition
│   │
│   ├── 📁 views/
│   │   ├── HomeView.vue           # Stories list
│   │   └── DetailView.vue         # Story detail
│   │
│   ├── 📁 components/
│   │   └── StoryCard.vue          # Reusable card
│   │
│   └── 📁 assets/
│       └── style.css              # Global styles
│
├── 📁 public/
│   ├── manifest.json              # PWA manifest
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── index.html                     # HTML entry
├── vite.config.js                 # Vite config (dengan PWA)
├── package.json
└── README.md

TOTAL: 12 files
LINES OF CODE: ~500 (sangat simple!)
TIME TO BUILD: ~1-2 jam