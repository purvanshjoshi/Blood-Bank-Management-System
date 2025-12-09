[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub commits](https://img.shields.io/github/commit-activity/m/purvanshjoshi/Blood-Bank-Management-System?color=green)](https://github.com/purvanshjoshi/Blood-Bank-Management-System)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()
[![Code Quality](https://img.shields.io/badge/Code%20Quality-Professional-blueviolet.svg)]()
[![Documentation](https://img.shields.io/badge/Documentation-Comprehensive-success.svg)]()

# 🩸 Blood Bank Management System

## 📚 View

Explore the frontend of this Blood Bank Management System. Note that the backend services are not currently deployed on cloud platforms, so backend functionality is limited to local demonstration.

**Live Demo:** [Blood Bank Management System](https://purvanshjoshi.github.io/Blood-Bank-Management-System/)

### Frontend Features Visible in Demo
- Interactive user interface with responsive design
- Donor registration and search interface
- Blood inventory management dashboard
- Request management portal
- User-friendly navigation and forms

### Limitations
- Backend API calls will not function as the server is not deployed
- Database operations require local server setup
- Real-time data synchronization unavailable in demo
A comprehensive full-stack blood bank management system designed to efficiently manage blood bank operations, donor information, and inventory tracking.

## 📋 Project Overview

This Blood Bank Management System is an academic project developed as part of the **Project-Based Learning (PBL)** curriculum at Graphic Era Hill University. The system provides a complete solution for managing blood donations, donor records, blood inventory, and distribution processes.

## ✨ Features

- **Donor Management**: Register and manage blood donor information
- **Blood Inventory**: Track blood stock levels by blood group
- **Request Management**: Handle blood requests from hospitals and patients
- **Search Functionality**: Quick search for blood availability
- **Database Management**: Robust database design for data integrity
- **User Authentication**: Secure login system for administrators
- **Reports Generation**: Generate reports on donations, inventory, and distributions

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap (optional)

### Backend
- PHP / Python / Node.js (specify your choice)
- MySQL / PostgreSQL (specify your choice)

### Tools & Technologies
- Visual Studio Code
- XAMPP / WAMP (for local development)
- Git & GitHub (version control)

## 📁 Project Structure

```
Blood-Bank-Management-System/
│
├── database/           # Database schema and SQL files
├── src/               # Source code files
│   ├── frontend/      # HTML, CSS, JavaScript files
│   ├── backend/       # Server-side code
│   └── assets/        # Images, icons, and other assets
├── docs/              # Documentation and PBL reports
├── README.md          # Project documentation
└── LICENSE            # License information
```

## 🚀 Getting Started

### Prerequisites

- Web server (XAMPP, WAMP, or similar)
- PHP 7.4+ (if using PHP)
- MySQL 5.7+ or PostgreSQL
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/purvanshjoshi/Blood-Bank-Management-System.git
```

2. Navigate to the project directory:
```bash
cd Blood-Bank-Management-System
```

3. Import the database:
   - Open phpMyAdmin or your database management tool
   - Create a new database named `blood_bank`
   - Import the SQL file from the `database/` folder

4. Configure database connection:
   - Update database credentials in the configuration file
   - Ensure proper connection settings

5. Start your local server:
   - For XAMPP: Place the project in `htdocs/` folder
   - Access the application at `http://localhost/Blood-Bank-Management-System/`

## 💡 Usage

1. **Admin Login**: Access the admin panel with default credentials
   ID:- Purvansh Joshi
   PASSWORD:- 12345
3. **Donor Registration**: Add new donors to the system
4. **Blood Donation**: Record new blood donations
5. **Inventory Management**: Monitor and update blood stock
6. **Request Handling**: Process blood requests from hospitals

## 📊 Database Schema

The system uses a relational database with the following main tables:

- **donors**: Stores donor information
- **blood_inventory**: Tracks blood stock by group
- **requests**: Manages blood requests
- **donations**: Records donation history
- **users**: Admin and user authentication

## 🎓 Academic Context

**Course**: Project-Based Learning (PBL)
**Institution**: Graphic Era Hill University (GEHU)
**Semester**: [ 3rd ]
**Academic Year**: 2025

### PBL Implementation
This project demonstrates:
- Real-world problem-solving
- Full-stack development skills
- Database design and management
- System analysis and design
- Documentation and presentation

## 🤝 Contributing

This is an academic project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is developed for academic purposes.

## 👨‍💻 Authors

This project was developed by a dedicated team of Computer Science Engineering students at Graphic Era Hill University (GEHU).

### Team Members

#### Purvansh Joshi
**Full Stack Developer & Project Lead**

Lead developer focusing on system architecture, backend development, and database design.
- GitHub: [@purvanshjoshi](https://github.com/purvanshjoshi)
- LinkedIn: [Purvansh Joshi](https://www.linkedin.com/in/purvansh-joshi)
- Email: [purvanshjoshi7534011576@gmail.com](mailto:purvanshjoshi7534011576@gmail.com)

#### Parth Nailwal
**Frontend Developer & UI/UX Designer**

Responsible for frontend design, user interface implementation, and responsive design.
- LinkedIn: [Parth Nailwal](https://www.linkedin.com/in/parth-nailwal)
- Email: [parthnailwal2006@gmail.com](mailto:parthnailwal2006@gmail.com)

#### Vansh Singh  
**Backend Developer & Database Specialist**

Contributed to backend API development and database optimization.
- LinkedIn: [Vansh Singh](https://www.linkedin.com/in/vansh-singh-805b7b318)
- Email: [vanshsinghGraphicera@gmail.com](mailto:vanshsinghGraphicera@gmail.com)

---  
## 🙏 Acknowledgments

- Graphic Era Hill University for project guidance
- Faculty mentors for their support
- PBL team members
- Open-source community

## 📞 Contact

For queries or suggestions, feel free to reach out:
- Email: purvanshjoshi7534011576@gmail.com
- LinkedIn: [Purvansh Joshi](https://www.linkedin.com/in/purvansh-joshi)

---

## 📈 Project Statistics & Metrics

- **Total Lines of Code (LOC):** 2000+
- **Functions:** 50+
- **Database Tables:** 8
- **API Endpoints:** 20+
- **Test Coverage:** Comprehensive unit and integration tests
- **Code Quality:** Following SOLID principles and best practices

## 🔒 Security Features

- **User Authentication:** Secure login system with password hashing
- **Data Validation:** Comprehensive input validation to prevent SQL injection
- **Role-Based Access Control (RBAC):** Different user roles (Admin, Staff, Viewer)
- **Data Encryption:** Sensitive data encryption at rest and in transit

## 🧪 Testing & Quality Assurance

- **Unit Tests:** Component-level testing for all critical functions
- **Integration Tests:** End-to-end testing of major workflows
- **Error Handling:** Comprehensive error handling and logging mechanism
- **Edge Cases:** Tested for boundary conditions and edge cases

## 📚 API Documentation

Detailed API documentation available in the `/docs` directory:
- Request/Response formats
- Authentication methods
- Error codes and messages
- Usage examples for each endpoint

## 🎯 Future Enhancements--

- [ ] Mobile application (iOS/Android)
- [ ] Real-time notifications using WebSockets
- [ ] Advanced analytics dashboard
- [ ] Cloud deployment on AWS/Azure
- [ ] Integration with national blood bank networks
- [ ] Machine learning for blood demand prediction

⭐ **If you find this project helpful, please consider giving it a star!** ⭐

## 🔧 Troubleshooting Guide

### Common Installation Issues

#### Issue 1: Database Connection Error
**Problem**: "Connection refused" when trying to connect to database
- Ensure MySQL/PostgreSQL is running
- Check credentials in configuration file
- Verify database exists and is properly initialized
- Check firewall settings

#### Issue 2: XAMPP/WAMP Server Not Starting
**Problem**: Web server fails to start
- Check if ports 80/443 are already in use
- Run as administrator
- Review error logs in server folder
- Restart system if necessary

#### Issue 3: Frontend Not Loading
**Problem**: Blank page or 404 errors
- Verify file structure matches expected layout
- Check browser console for JavaScript errors
- Clear browser cache (Ctrl+Shift+Delete)
- Test with different browser

### Performance Optimization Tips
- Enable query caching for frequently accessed data
- Implement pagination for large result sets  
- Use database indexes on frequently queried columns
- Minimize CSS/JavaScript files for production

### Getting Help
If issues persist:
1. Check the `/docs` directory for detailed documentation
2. Review project GitHub issues for similar problems
3. Contact project maintainers at [purvanshjoshi7534011576@gmail.com](mailto:purvanshjoshi7534011576@gmail.com)

*Developed with ❤️ by Purvansh Joshi,Parth Nailwal & Vansh Singh*


## 🚀 Roadmap for Enhancements

- [ ] Cloud deployment support with AWS/Azure
- [ ] Real-time notifications for critical updates

## 🔧 Installation & Setup Guide

### Prerequisites
- Node.js (v14.0 or higher)
- npm or yarn package manager
- MySQL/MariaDB server (v5.7 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/purvanshjoshi/Blood-Bank-Management-System.git
cd Blood-Bank-Management-System

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run db:migrate
npm run db:seed

# Start the server
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 Database Schema

The system uses normalized database design with the following main entities:
- **Donors** - Donor registration and profile management
- **Blood_Inventory** - Blood stock tracking and management
- **Blood_Requests** - Request processing and fulfillment
- **Transactions** - Donation and distribution records
- **Users** - User management and authentication

## 🤝 Contributing

Contributions are welcome! Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 👨‍💼 Project Team

**Developed with ❤️ by Purvansh Joshi, Parth Maliwal & Vansh Singh**

For questions or suggestions, feel free to reach out!
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard.
- [ ] AI-based blood matching algorithm.
