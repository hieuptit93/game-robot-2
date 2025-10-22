# Assets Directory

## How to add the plane image:

1. Place your `Default.png` file in the `public/assets/plane/` directory
2. The image should be a side-view of a spaceship/plane facing right
3. Recommended dimensions: 80x40 pixels or similar aspect ratio
4. Transparent background (PNG format)
5. The game will automatically use your image, or fallback to the SVG ship if the image fails to load

## Current structure:
```
public/assets/
├── plane/
│   └── Default.png (your spaceship image)
└── README.md (this file)
```

The game is designed to work with or without the actual PNG file - it includes a beautiful SVG fallback ship with animated engine flames.