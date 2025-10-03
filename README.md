# GestureAI 🤖✨

A cutting-edge web application that enables intuitive human-computer interaction through hand gestures, eye tracking, and voice commands. Experience the future of computing with this innovative gesture control interface.

![GestureAI Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Browser Support](https://img.shields.io/badge/Browser-Chrome%20%7C%20Firefox%20%7C%20Safari-lightgrey)

## 🌟 Features

### ✋ Hand Gesture Control

- **Peace Sign**: Activate/deactivate gesture recognition
- **Open Palm**: Scroll mode for natural page navigation
- **Fist**: Cancel current gesture and stop scrolling
- **Real-time tracking** with MediaPipe Hands API
- **Multi-hand support** for advanced interactions

### 👁️ Eye Tracking

- **Blink Detection**: Click actions through natural blinking
- **Eye Movement Tracking**: Navigate with eye movements
- **Face Mesh Integration**: Advanced facial landmark detection
- **Accessibility focused** for hands-free interaction

### 🎤 Voice Commands

- **Natural Language Processing**: Speak commands naturally
- **Scroll Controls**: "Scroll up" and "Scroll down" commands
- **Real-time Recognition**: Continuous voice input processing
- **Cross-browser Support**: Works on modern browsers

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam for gesture and eye tracking features
- Microphone for voice commands
- Stable internet connection for MediaPipe libraries

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/GestureAI.git
   cd GestureAI
   ```

2. **Open the application**

   ```bash
   # Using Python (if available)
   python -m http.server 8000

   # Using Node.js (if available)
   npx http-server

   # Or simply open index.html in your browser
   ```

3. **Access the application**
   - Navigate to `http://localhost:8000` (if using server)
   - Or open `index.html` directly in your browser

## 📖 Usage Guide

### Getting Started

1. **Home Page**: Visit the landing page to see all available features
2. **Feature Selection**: Choose between Hand Gestures, Eye Tracking, or Voice Commands
3. **Camera Permission**: Allow camera access when prompted
4. **Start Interacting**: Follow the on-screen guides for each feature

### Hand Gestures

- **Show Peace Sign** ✌️: Activates gesture recognition
- **Open Palm** 👋: Enables scroll mode - move your hand up/down to scroll
- **Make a Fist** ✊: Cancels current gesture and stops scrolling

### Eye Tracking

- **Blink Naturally** 👁️: Detects blinks for click actions
- **Look Around** 👀: Eye movements are tracked for navigation
- **Stay in Frame**: Keep your face visible for optimal tracking

### Voice Commands

- **Click "Start Voice Recognition"** 🎤
- **Say "Scroll Up"** ⬆️: Scrolls the page upward
- **Say "Scroll Down"** ⬇️: Scrolls the page downward
- **Click "Stop Voice Recognition"** to end

## 🛠️ Technology Stack

### Frontend

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Modern JavaScript with classes and async/await
- **Font Awesome**: Icon library for UI elements

### AI/ML Libraries

- **MediaPipe Hands**: Real-time hand landmark detection
- **MediaPipe Face Mesh**: Facial landmark tracking for eye detection
- **MediaPipe Camera Utils**: Camera integration and video processing
- **Web Speech API**: Voice recognition and synthesis

### Design & UX

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Modern dark interface with neon accents
- **Accessibility**: WCAG compliant with keyboard navigation
- **Progressive Enhancement**: Graceful degradation for older browsers

## 📁 Project Structure

```
GestureAI/
├── index.html              # Main landing page
├── app.js                  # Core application logic
├── styles.css              # Global styles and animations
├── hand-gestures.html      # Hand gesture feature page
├── hand-gestures.js        # Hand gesture controller
├── eye-tracking.html       # Eye tracking feature page
├── eye-tracking.js         # Eye tracking controller
├── voice-commands.html     # Voice commands feature page
├── voice-commands.js       # Voice command controller
└── README.md              # Project documentation
```

## 🔧 Configuration

### Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

### Performance Optimization

- **Camera Resolution**: 640x480 for optimal performance
- **Frame Rate**: 30 FPS for smooth tracking
- **Detection Confidence**: 0.5 threshold for reliable recognition

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly across different browsers
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines

- **Code Style**: Follow existing code formatting
- **Testing**: Test on multiple browsers and devices
- **Documentation**: Update README for new features
- **Accessibility**: Ensure new features are accessible
- **Performance**: Optimize for smooth user experience

### Areas for Improvement

- [ ] Add more gesture types
- [ ] Implement gesture customization
- [ ] Add machine learning for better recognition
- [ ] Create mobile app version
- [ ] Add support for sign language
- [ ] Implement gesture recording and playback

## 🐛 Troubleshooting

### Common Issues

**Camera not working:**

- Ensure camera permissions are granted
- Check if another application is using the camera
- Try refreshing the page

**Voice recognition not working:**

- Check microphone permissions
- Ensure you're using a supported browser
- Speak clearly and in a quiet environment

**Gestures not detected:**

- Ensure good lighting conditions
- Keep hands within camera view
- Check camera resolution and frame rate

**Performance issues:**

- Close other browser tabs
- Reduce camera resolution if needed
- Update to latest browser version

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe Team**: For the amazing hand and face tracking libraries
- **Google**: For the Web Speech API
- **Font Awesome**: For the beautiful icons
- **Open Source Community**: For inspiration and support

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/GestureAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/GestureAI/discussions)
- **Email**: your.email@example.com

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ by Pritesh Gupta**

_Experience the future of human-computer interaction today!_

