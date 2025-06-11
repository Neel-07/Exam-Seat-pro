# ExamSeat Pro 🎓

A modern, intelligent examination hall seating management system built with React, TypeScript, and Tailwind CSS. Streamline your examination seating arrangements with automated seat assignment, conflict prevention, and real-time management capabilities.

## 🌟 Features

### For Administrators
- **Hall Management**: Create and configure examination halls with customizable layouts
- **Exam Scheduling**: Schedule exams with date, time, duration, and hall assignment
- **Smart Seat Assignment**: Automatically assign seats to students with conflict prevention
- **Real-time Dashboard**: Monitor hall utilization, upcoming exams, and system statistics
- **Student Management**: View and manage registered students
- **Export & Print**: Generate seating layouts and student lists in CSV format

### For Students
- **Personal Dashboard**: View upcoming exams and seat assignments
- **Seat Lookup**: Easily find assigned seats for all exams
- **Exam Alerts**: Get notified about today's exams and important updates
- **Search Functionality**: Quickly search through exam schedules

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Role-based Authentication**: Secure login system with admin and student roles
- **Local Storage**: Data persistence without requiring a backend
- **Print-friendly Layouts**: Optimized printing for seating charts and student lists
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## 🚀 Live Demo

[View Live Demo](https://exam-seat-pro.vercel.app/)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **State Management**: React Context + Local Storage

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exam-seating-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Quick Start Guide

### Demo Accounts

The application comes with pre-configured demo accounts for testing:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Student Account:**
- Email: `student@example.com`
- Password: `student123`

### Basic Workflow

1. **Login** as an admin using the demo credentials
2. **Create a Hall** by going to Halls → Add Hall
3. **Schedule an Exam** by going to Exams → Schedule Exam
4. **Assign Seats** by clicking "Assign Seats" on any exam
5. **View Results** in the seat viewer or export as CSV

## 📱 Screenshots

### Admin Dashboard
- Real-time statistics and system overview
- Recent activity and hall utilization metrics

### Hall Management
- Visual hall layout editor
- Drag-and-drop seat configuration

### Seat Assignment
- Automated seat assignment with conflict prevention
- Visual seating layout with student assignments

### Student Dashboard
- Personal exam schedule and seat assignments
- Mobile-responsive design

## 🔧 Configuration

### Customizing Hall Layouts
- Halls support up to 30x30 seat configurations
- Individual seats can be marked as available or blocked
- Visual layout editor for easy configuration

### Exam Management
- Flexible scheduling with date, time, and duration
- Support for multiple exam statuses (scheduled, ongoing, completed)
- Automatic conflict detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information about the problem
3. Include screenshots and error messages when applicable

## 🔮 Future Enhancements

- [ ] Backend integration with REST API
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Email notifications for exam reminders
- [ ] Bulk student import via CSV
- [ ] Multi-language support
- [ ] Dark mode theme

---

**Built with ❤️ using React and TypeScript**
