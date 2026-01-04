# TimeTable Pro - School Timetable Management System

A comprehensive, AI-powered timetable generation system for schools and colleges.

## Features

### Admin Dashboard
- **Class Management**: Create and manage class divisions with class strength and teacher assignments
- **Subject Configuration**: Define subjects, assign teachers, and set weekly class hours
- **Session Management**: Configure school timings, breaks, and lunch periods
- **Intelligent Timetable Generation**: Automated scheduling with constraint satisfaction
- **User Management**: Create and manage admin, teacher, and student accounts
- **Timetable Validation**: Automated checks to ensure schedule validity

### Teacher Dashboard
- **Class Schedule View**: See all assigned teaching schedules
- **Subject Assignments**: View subjects and class allocations
- **Period Management**: Quick access to next/current classes

### Student Dashboard
- **Personal Timetable**: View your class schedule
- **Subject Information**: See subject names and assigned teachers
- **Schedule Export**: Download or print your timetable

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Authentication**: Session-based with password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas or local MongoDB instance
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Admin Setup

1. **Register as Admin**: Create an admin account via `/register`
2. **Configure Sessions**: Go to Admin > Session Configuration
   - Add time periods (e.g., Period 1: 9:00-9:45)
   - Configure breaks and lunch times
3. **Add Subjects**: Admin > Manage Subjects
   - Create subjects with codes and assign teachers
   - Set weekly class hours for each subject
4. **Create Classes**: Admin > Manage Classes
   - Define class names and divisions
   - Assign class teachers
5. **Generate Timetable**: Admin > Generate Timetables
   - Select a class and generate optimized schedule
   - Review and publish when satisfied

### Algorithm Details

The timetable generation algorithm:
- **Constraint Satisfaction**: Respects max consecutive classes and break requirements
- **Load Balancing**: Distributes subject hours evenly across the week
- **Optimization**: Maximizes free periods and reduces fatigue
- **Validation**: Checks for conflicts and ensures all subjects are assigned

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user

#### Classes
- `GET /api/classes` - Fetch all classes
- `POST /api/classes` - Create new class

#### Subjects
- `GET /api/subjects` - Fetch all subjects
- `POST /api/subjects` - Create new subject

#### Sessions
- `GET /api/sessions` - Fetch all sessions
- `POST /api/sessions` - Create new session

#### Timetables
- `GET /api/timetables?classId=<id>` - Get timetables for a class
- `POST /api/timetables/generate` - Generate new timetable
- `PATCH /api/timetables` - Update timetable status

#### Users
- `GET /api/users?role=<role>` - Get users by role

## Project Structure

```
app/
├── admin/              # Admin pages
├── api/               # API routes
├── student/           # Student pages
├── teacher/           # Teacher pages
├── auth/              # Auth pages (login/register)
└── page.tsx           # Home page

components/
├── admin/             # Admin components
├── ui/                # shadcn/ui components
└── timetable-*.tsx    # Timetable related components

lib/
├── auth.ts            # Authentication utilities
├── db.ts              # Database connection
├── types.ts           # TypeScript types
├── timetable-generator.ts # Scheduling algorithm
└── constants.ts       # App constants
```

## Security Features

- Password hashing with SHA-256
- Role-based access control (RBAC)
- Session management with MongoDB
- Input validation on all endpoints
- Protected admin routes

## Future Enhancements

- [ ] Teacher preference constraints
- [ ] Room/resource allocation
- [ ] Conflict detection and resolution
- [ ] PDF export with styling
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Bulk import from CSV
- [ ] Multi-language support

## License

MIT License - feel free to use this project

## Support

For issues or questions, please open an issue on GitHub.
