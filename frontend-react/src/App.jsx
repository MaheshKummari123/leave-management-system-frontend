import { Route,Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import StudentPage from './pages/StudentPage'
import ApplyLeave from './pages/ApplyLeave'
import ViewLeaves from './pages/ViewLeaves'
import RegisterPage from './pages/RegisterPage'
import FacultyPage from './pages/FacultyPage'
import AdminPage from './pages/AdminPage'
import ProfilePage from './pages/ProfilePage'
import AdminUserManagement from './pages/AdminUserManagement'
import AdminLeaveManagement from './pages/AdminLeaveManagement'
import UpdateProfile from './pages/UpdateProfile'
import AdminDepartmentPage from './pages/AdminDepartmentPage'
import AddUserPage from './pages/AddUserPage'
import AdminFacultyAssignment from './pages/AdminFacultyAssignment'
import AdminLeaveReports from './pages/AdminLeaveReports'
import FacultyAssignedStudents from './pages/FacultyAssignedStudents'
import FacultyLeaveQueue from './pages/FacultyLeaveQueue'
import FacultyNotifications from './pages/FacultyNotifications'
import LandingPage from './pages/LandingPage'


function App() {
  

  return (
    <Routes>
      <Route path="/login-page" element={<LoginPage />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/student/apply-leave" element={ <ApplyLeave /> } />
      <Route path="/student/myleaves" element={ <ViewLeaves /> } />
      <Route path="/register" element={ <RegisterPage /> } />
      <Route path="/faculty" element={ <FacultyPage /> } />
      <Route path='/admin' element={ <AdminPage />} />
      <Route path='/profile' element={ <ProfilePage /> } />
      <Route path='/admin/user' element={ <AdminUserManagement /> } />
      <Route path='/admin/leave' element={ <AdminLeaveManagement /> } />
      <Route path='/update-profile' element={ <UpdateProfile />} />
      <Route path='/admin/department' element={ <AdminDepartmentPage />} />
      <Route path='/admin/user/add-user' element={ <AddUserPage /> } />
      <Route path='/admin/faculty' element={ <AdminFacultyAssignment /> } />
      <Route path='/admin/leave-reports' element={ <AdminLeaveReports /> } />
      <Route path='/faculty/assigned-students' element={ <FacultyAssignedStudents />} />  
      <Route path='/faculty/leave-queue' element={ <FacultyLeaveQueue /> } />
      <Route path='/faculty/notifications' element={ <FacultyNotifications /> } />
      <Route path='/' element={ <LandingPage /> } />

    </Routes>
  )
}

export default App
