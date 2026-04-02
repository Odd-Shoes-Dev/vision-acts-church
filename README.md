# Vision of Acts Pentecostal Church - Landing Page

A professional, responsive landing page for VISION OF ACTS PENTECOSTAL CHURCH built with HTML, CSS, and JavaScript.

## 📁 Project Structure

```
vision-acts-church/
├── index.html          # Main HTML file
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript for interactivity
├── images/             # Images folder (add your images here)
│   ├── image1.jpeg     # Bishop's photo
│   ├── image2.jpeg     # Bishop and partner
│   ├── image3.jpeg     # Congregation image
│   ├── image4.jpeg     # Church activity 1
│   ├── image5.jpeg     # Church activity 2
│   └── image6.jpeg     # Church activity 3
└── README.md           # This file
```

## 🎨 Color Scheme

- **Primary Blue**: #0044CC
- **White**: #FFFFFF
- **Dark Gray**: #333333 (main text)
- **Light Gray**: #F5F5F5 (backgrounds)
- **Medium Gray**: #888888 (secondary text)
- **Black**: #000000 (accents)

## 📱 Features

✅ **Responsive Design** - Works perfectly on:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (480px to 767px)
- Small Mobile (below 480px)

✅ **Sections Included**:
1. **Navigation Bar** - Sticky navigation with smooth scrolling
2. **Hero Section** - Eye-catching banner with CTA buttons
3. **Vision Statement** - Church's vision clearly displayed
4. **Mission Section** - 5 pillars: Worship, Ministry, Evangelism, Fellowship, Discipleship
5. **Leadership Section** - Team and congregation photos
6. **Gallery Section** - Additional church photos
7. **Contact Section** - Contact form and service times
8. **Footer** - Links and social media

✅ **Typography**:
- **Headings**: Lora (serif) - elegant and readable
- **Body**: Open Sans (sans-serif) - clean and modern
- Both fonts imported from Google Fonts

✅ **Interactive Features**:
- Smooth scrolling navigation
- Hover effects on cards and buttons
- Form validation
- Scroll animations for elements
- Mobile-friendly touch interactions

## 🚀 How to Use

### 1. Add Your Images
Place your images in the `images/` folder with these exact names:
- `image1.jpeg` - Bishop's photo
- `image2.jpeg` - Bishop and his partner
- `image3.jpeg` - Congregation image
- `image4.jpeg` - Church activity/photo 1
- `image5.jpeg` - Church activity/photo 2
- `image6.jpeg` - Church activity/photo 3

### 2. Customize Contact Information
Edit the contact section in `index.html` to add:
- Church address
- Phone number
- Email address
- Service times (already set as placeholder)

### 3. Update Social Media Links
In the footer section of `index.html`, replace the `#` with actual social media URLs:
```html
<a href="https://facebook.com/yourchurch">Facebook</a>
<a href="https://instagram.com/yourchurch">Instagram</a>
<a href="https://twitter.com/yourchurch">Twitter</a>
```

### 4. Deploy to Web
You can host this on:
- **Netlify** (free, drag & drop)
- **GitHub Pages** (free)
- **AWS S3** (low cost)
- Any standard web hosting with file upload capability

Simply upload all files to your web host and you're done!

## 📋 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Customization Tips

### Change Colors
Open `styles.css` and modify the CSS variables at the top:
```css
:root {
    --primary-blue: #0044CC;  /* Change to your color */
    --white: #FFFFFF;
    --dark-gray: #333333;
    /* etc... */
}
```

### Adjust Spacing/Padding
Look for `padding` and `margin` values in `styles.css` and adjust as needed.

### Change Font Sizes
Modify the `font-size` properties throughout `styles.css`.

### Add More Sections
Copy the structure of existing sections and adjust the HTML/CSS accordingly.

## 📞 Contact Form

The form currently validates inputs and shows a success message. To actually send emails, you'll need:
1. A backend service (Node.js, PHP, Python, etc.)
2. Or use a service like **Firebase**, **Formspree**, or **Netlify Forms**

For Netlify Forms, add `netlify` attribute to the form tag:
```html
<form netlify>
    <!-- form fields -->
</form>
```

## 🔧 Maintenance

- Update content periodically in `index.html`
- Keep images optimized (compress for faster loading)
- Test on different devices before major updates
- Monitor form submissions (if connected to a backend)

## � Deployment to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Vision of Acts church landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vision-acts-church.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Select your `vision-acts-church` repository
4. Click "Deploy" (no additional configuration needed)
5. Vercel will automatically deploy your site and provide a live URL

### Step 3: Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain (e.g., `visionofacts.com`)
3. Follow the DNS configuration instructions provided

### Environment
- **No build step required** - this is a static site
- **Images location**: `public/images/` (already configured)
- **Auto-deploys** on every push to main branch

### Performance Tips
- Images are cached for 1 hour via `vercel.json`
- Site serves from edge locations globally
- Automatic SSL/HTTPS certificate

## �📄 License

This landing page is created for VISION OF ACTS PENTECOSTAL CHURCH.

## 💡 Need Help?

- Check browser console for any errors (F12 in most browsers)
- Ensure all image files are in the `images/` folder
- Verify file paths are correct
- Test on mobile devices for responsive design

---

**Made with ❤️ for VISION OF ACTS PENTECOSTAL CHURCH**
