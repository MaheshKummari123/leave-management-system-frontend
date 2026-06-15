import axios from 'axios';
const api = 'learnflow.railway.internal';





export const getAllLeavesById = (id) => axios.get(`${api}/list/${id}`);
export const getLastThreeLeavesById = (id) => axios.get(`${api}/recent-lists/${id}`);

export const applyLeave = (leave) => axios.post(`${api}/leave`, leave);

export const studentStatusCounts = (id) => axios.get(`${api}/student/leave-counts/${id}`);

//Getting leaves of corresponding student based on dept
export const getStudentLeaves = (id) => axios.get(`${api}/faculty/leave-requests/${id}`);

//Getting count of leaves that are approved by faculty
export const getfacultyStatusRequestCounts = (id) => axios.get(`${api}/faculty/leave-counts/${id}`)

export const updateStatus = (leaveId, facultyId, status) => axios.put(`${api}/faculty/leave-status-change/${leaveId}`, {
    status: status,
    facultyId: facultyId
})

export const searchLeaves = (userId, status, start, end, keyword) => axios.get(`${api}/leave/search`,
    {
        params: {
            userId,
            status,
            start,
            end,
            keyword
        }
    }
)

//Admin API's
export const getAllLeaves = () => axios.get(`${api}/list`);
export const statusCounts = () => axios.get(`${api}/admin/leave-counts`);


//User api's
export const getAllUsers = () => axios.get(`${api}/user`);
export const searchUsers = (value) => axios.get(`${api}/user/search?name=${value}&email=${value}`);
export const deleteUser = (id) => axios.delete(`${api}/user/delete/${id}`);
//User update
export const updateUser = (id, updatedUser) => axios.put(`${api}/user/update/${id}`, updatedUser);

export const getUser = (user) => axios.post(`${api}/login`, user);
export const registerUser = (user) => axios.post(`${api}/user`, user);

//Delete Leave by id
export const deleteLeave = (id) => axios.delete(`${api}/leave/delete/${id}`);

//get top 5 leaves
export const recentLeaves = () => axios.get(`${api}/recent-leaves`);

//Department getting
export const getDepartments = () => axios.get(`${api}/user/departments`);
//DEPARTMENT | update user department by admin
export const updateUserDepartment = (id, dept) => axios.put(`${api}/user/${id}/department?dept=${dept}`)

//Student details with faculty assign || faculty Assign
export const studentsWithAssignedFaculty = () => axios.get(`${api}/assign-faculty`);
//Get All Faculty || faculty Assign
export const getAllFaculty = () => axios(`${api}/user/faculty`);
export const assignFaculty = (id, factId) => axios.put(`${api}/assign-faculty/${id}?facultyId=${factId}`);

//Filter leaves by date
export const searchLeavesBySelecteDate = (start, end) => axios.get(`${api}/search-leaves?startDate=${start}&endDate=${end}`);

//monthwise leave reports
export const leaveReports = () => axios.get(`${api}/month-wise-leaves`);

//faculty leave reports
export const facultyLeaveReports = () => axios.get(`${api}/faculty-report`);
//department wise leave counts
export const departmentLeaveCounts = () => axios.get(`${api}/department-leave-counts`);

//get all students assigned to faculty by faculty id
export const assignedStudents = (facultyId) => axios.get(`${api}/assigned-students/${facultyId}`);

//student leave counts 
export const getStudentLeaveCounts = () => axios.get(`${api}/students-leave-counts`);
export const getStudentLeaveCountsById = (id) => axios.get(`${api}/student-leave-counts/${id}`);

export const getStudentDetails = (studentId) =>
    axios.get(
        `${api}/faculty/student-details/${studentId}`
    );

//Profile image upload api
export const uploadProfileImage =
    (id, data) =>
        axios.post(
            `${api}/user/upload-image/${id}`,
            data
        );

export const searchFacultyLeaves = (
    facultyId,
    status,
    start,
    end,
    keyword
) =>
    axios.get(`${api}/faculty/search-leaves`, {
        params: {
            facultyId,
            status,
            start,
            end,
            keyword
        }
    });

    export const getTop5FacultyLeavesByStatus = (
    facultyId,
    status
) =>
    axios.get(`${api}/faculty/top5-leaves-by-status`, {
        params: {
            facultyId,
            status
        }
    });

export const getTop5StudentLeavesByFacultyId=(facultyId)=>axios.get(`${api}/faculty/top5-leaves/${facultyId}`);

//Student leaves by faculty id
export const getStudentLeavesByFacultyId=(factId)=>axios.get(`${api}/faculty/student-leaves/${factId}`);

//Update department name
export const updateDepartmentName = (
    oldDept,
    newDept
) =>
    axios.put(
        `${api}/department/update`,
        null,
        {
            params: {
                oldDept,
                newDept
            }
        }
    );