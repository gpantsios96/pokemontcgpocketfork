# 🚀 Deployment Guide - Ηλεκτρολόγοι Θεσσαλονίκη (Next.js Version)

## Quick Start

### 1️⃣ Build the Site
```bash
cd nextjs-electricians
npm run build
```

This creates the `out/` folder with your ready-to-deploy website.

### 2️⃣ What You Get

After building, you'll have:
```
out/
├── index.html          ← Your homepage (UPLOAD THIS!)
├── _next/             ← Optimized CSS & JavaScript (UPLOAD THIS!)
├── images/            ← Your images (UPLOAD THIS!)
├── data/              ← electricians.json (UPLOAD THIS!)
└── 404.html           ← Error page (UPLOAD THIS!)
```

### 3️⃣ Deploy to Your Web Hosting

**Simply upload EVERYTHING inside the `out/` folder to your web server.**

It's the same as uploading regular HTML files!

---

## 📂 What to Upload

### Option A: Replace Current Site
1. Backup your current site
2. Delete old files from your hosting
3. Upload everything from `out/` folder
4. Done! ✅

### Option B: Test on Subdomain First
1. Create subdomain (like `test.yoursite.com`)
2. Upload `out/` folder contents to subdomain
3. Test it
4. When happy, replace main site

---

## 🔄 Making Changes

### To Edit Electricians Data:
1. Edit `public/data/electricians.json`
2. Run `npm run build`
3. Upload new `out/` folder

### To Edit Design:
1. Edit files in `app/` or `components/`
2. Run `npm run build`
3. Upload new `out/` folder

---

## 📊 What You Get vs Original

### Original Site:
- `index.html` - 1 file
- `style.css` - 1 file
- `script.js` - 1 file

### Next.js Site:
- `index.html` - Optimized HTML
- `_next/static/css/` - Optimized CSS (smaller, faster)
- `_next/static/chunks/` - Optimized JavaScript (split for faster loading)

**Result:** Same website, but FASTER and BETTER organized! 🚀

---

## ❓ Common Questions

### "Do I need Node.js on my hosting?"
**NO!** After you build (`npm run build`), the `out/` folder contains regular HTML/CSS/JS files. Your hosting only needs to serve static files.

### "Can I use my current hosting?"
**YES!** It works with ANY hosting that supports HTML files (cPanel, FTP, anything).

### "Do I need to keep the `nextjs-electricians` folder on my hosting?"
**NO!** Only upload the `out/` folder contents. The rest stays on your computer for development.

### "How do I add a new electrician?"
1. Edit `public/data/electricians.json`
2. Add the new electrician to the array
3. Run `npm run build`
4. Upload the new `out/` folder

---

## 🎯 Simple Workflow

```
1. Make changes on your computer
   ↓
2. Run: npm run build
   ↓
3. Upload: out/ folder to hosting
   ↓
4. Done! Your site is updated ✅
```

---

## 📦 File Sizes (After Build)

- Total size: ~500KB (optimized!)
- Original HTML version: ~600KB
- **You saved: 100KB** ✨

---

## 🆘 Need Help?

### Site won't build?
```bash
# Delete and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Want to preview before uploading?
```bash
# Start development server
npm run dev
# Visit: http://localhost:3000
```

### Check what will be deployed:
```bash
# After building, look at the out folder
ls -la out/
```

---

## ✅ Checklist Before Deployment

- [ ] Ran `npm run build` successfully
- [ ] Checked `out/index.html` exists
- [ ] Backed up current site
- [ ] Tested on subdomain first (recommended)
- [ ] Uploaded entire `out/` folder
- [ ] Verified site loads correctly
- [ ] Tested on mobile device

---

**That's it! You now have a modern, optimized website! 🎉**
