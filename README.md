# 📄 html-to-pdf-cli

**A professional, high-performance CLI to transform the web into pixel-perfect PDFs.** *Built with TypeScript and powered by Puppeteer for modern, headless rendering.*

[![npm version](https://img.shields.io/npm/v/html-to-pdf-cli.svg)](https://www.npmjs.com/package/html-to-pdf-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

---

## 🚀 Key Features

* ✅ **Modern Rendering:** Uses Headless Chrome to ensure JavaScript-heavy sites and modern CSS render perfectly.
* ✅ **Single & Bulk Support:** Convert a single URL or an entire list from a `.txt` file in one command.
* ✅ **Smart File Naming:** Automatically names PDFs based on the webpage's `<title>` tag.
* ✅ **Zero Configuration:** Missing output directories are created automatically on the fly.
* ✅ **TypeScript Powered:** Compiled from clean, robust TS for maximum reliability.

---

## 📥 Installation

### 1. Instant Run (No Install)
The fastest way to use the tool without cluttering your global modules:
```bash
npx html-to-pdf-cli -u [https://google.com](https://google.com)
```

### 2. Global Installation
For frequent use, install it globally:
```bash
npm install -g html-to-pdf-cli
```

---

## 📖 Usage Examples

### Single URL Conversion
Convert a webpage and save it to your current directory:
```bash
html-to-pdf-cli -u [https://github.com](https://github.com)
```

### Bulk Conversion
Create a file (e.g., `links.txt`) with one URL per line:
```text
[https://nodejs.org](https://nodejs.org)
[https://typescriptlang.org](https://typescriptlang.org)
[https://google.com](https://google.com)
```
Run the bulk command and specify an output folder:
```bash
html-to-pdf-cli -f links.txt -o ./my-pdfs/
```

### Display Help
```bash
html-to-pdf-cli --help
```

---

## 🛠 Command Options

| Flag | Description | Default |
| :--- | :--- | :--- |
| `-u, --url <url>` | Convert a single URL to a PDF | — |
| `-f, --file <path>` | Path to a `.txt` file containing a list of URLs | — |
| `-o, --output <dir>`| Output directory for the PDFs | Current Directory |
| `-V, --version` | Output the current version number | — |
| `-h, --help` | Display the standard help screen | — |

---

## 🏗 Development

If you want to contribute or customize the tool:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/html-to-pdf-cli.git](https://github.com/sakshambakshi/html-to-pdf-cli.git)
    cd html-to-pdf-cli
    ```
2.  **Install & Build:**
    This installs dependencies and compiles the TypeScript source from `src/` to `dist/`.
    ```bash
    npm install
    npm run build
    ```
3.  **Local Link:**
    Test your changes globally on your local machine:
    ```bash
    npm link
    ```

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.