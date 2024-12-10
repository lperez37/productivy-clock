# Productivy Clock

A modern, minimalist productivity timer and task manager built with React, TypeScript, and Tailwind CSS, featuring the beautiful Catppuccin color scheme.

## Features

- 🕒 Customizable Pomodoro-style timer
- ✅ Task management with drag-and-drop reordering
- 🌓 Light/Dark mode with Catppuccin theme
- 🎯 Focus-driven interface
- 🎉 Celebration animations on task completion
- ⌨️ Keyboard-friendly
- 📱 Responsive design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- dnd-kit (drag and drop)
- Lucide React (icons)
- Headless UI (accessible components)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lperez37/productivy-clock.git
cd productivy-clock
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Timer
- Set your desired time using the input field
- Start/pause the timer using the play/pause button
- Reset the timer using the reset button
- Get an extra 5 minutes up to 3 times when the timer is up

### Tasks
- Add tasks using the input field
- Mark tasks as complete by clicking the checkbox
- Edit tasks by clicking the pencil icon
- Delete tasks using the trash icon
- Reorder tasks by dragging the grip handle
- Clear all tasks using the clear button

## Customization

The app uses the Catppuccin color scheme, which can be customized in `src/index.css`. The theme includes both light (Latte) and dark (Mocha) variants.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Catppuccin](https://github.com/catppuccin/catppuccin) for the beautiful color scheme
- [Lucide](https://lucide.dev/) for the icons
- [dnd kit](https://dndkit.com/) for drag and drop functionality 