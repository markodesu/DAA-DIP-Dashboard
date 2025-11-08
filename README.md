# DAA + DIP Dashboard

An interactive web application for visualizing and learning Design and Analysis of Algorithms (DAA) and Digital Image Processing (DIP) concepts.

## Features

### DAA (Design and Analysis of Algorithms)
- **0/1 Knapsack Problem** - Dynamic Programming and Greedy approaches with table visualization
- **Huffman Coding** - Lossless compression with step-by-step merging process
- **Arithmetic Encoding/Decoding** - Probability-based compression algorithm
- **Coin Changing Problem** - Dynamic Programming with 2D table visualization
- **TSP (Traveling Salesman Problem)** - Branch and Bound with matrix reduction visualization

### DIP (Digital Image Processing)
- **Grayscale Conversion** - Luminance-based conversion with formulas
- **Negative Transformation** - Image inversion
- **Histogram Equalization** - Contrast enhancement
- **Brightness & Contrast** - Interactive adjustment with sliders
- **Blur** - Gaussian blur with radius control
- **Edge Detection** - Sobel operator implementation
- **Threshold** - Binary thresholding
- **Sharpen** - Unsharp mask filtering
- **Convolution** - Custom kernel convolution (Emboss, Sharpen, Edge Detection, Blur)
- **Channel Separation** - RGB channel visualization

## Tech Stack

- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Canvas API** - Image processing and histogram visualization

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn

### Installation

```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with production-ready files.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
dashboard/
├── src/
│   ├── components/          # Reusable components (Sidebar)
│   ├── pages/
│   │   ├── daa/            # DAA algorithm pages
│   │   │   └── algorithms/ # Individual algorithm implementations
│   │   └── dip/            # DIP filter pages
│   │       └── filters/     # Image filter implementations
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Entry point
├── public/                 # Static assets
└── dist/                  # Production build (generated)
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options:

**Vercel (Recommended):**
```bash
npm i -g vercel
cd dashboard
vercel --prod
```

**Netlify:**
```bash
npm i -g netlify-cli
cd dashboard
netlify deploy --prod
```

## Features

- ✅ Interactive algorithm visualizations
- ✅ Step-by-step explanations with formulas
- ✅ Collapsible explanation sections
- ✅ Real-time image processing
- ✅ Histogram visualizations
- ✅ Responsive design
- ✅ Sidebar navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.
