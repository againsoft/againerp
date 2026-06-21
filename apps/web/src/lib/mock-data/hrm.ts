// ─── Types ────────────────────────────────────────────────────────────────────

export type EmployeeStatus = "active" | "on_leave" | "probation" | "resigned";
export type Department = "Engineering" | "Sales" | "Marketing" | "Finance" | "Operations" | "HR" | "Customer Support" | "Warehouse";
export type AttendanceStatus = "present" | "absent" | "late" | "half_day" | "on_leave";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type LeaveType = "annual" | "sick" | "casual" | "maternity" | "unpaid";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: Department;
  branch: string;
  status: EmployeeStatus;
  joinDate: string;
  salary: number;
  avatar: string;
  manager: string;
  annualLeaveBalance: number;
  sickLeaveBalance: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  hoursWorked: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  month: string;
  basicSalary: number;
  bonus: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: "pending" | "processed" | "paid";
}

// ─── Mock Employees ───────────────────────────────────────────────────────────

export const mockEmployees: Employee[] = [
  { id: "emp-001", name: "Rahim Uddin",    email: "rahim@againerp.com",   phone: "+880 1712-345678", designation: "Sales Manager",       department: "Sales",           branch: "Dhaka HQ",    status: "active",    joinDate: "2021-03-15", salary: 85000,  avatar: "RU", manager: "CEO",          annualLeaveBalance: 12, sickLeaveBalance: 6 },
  { id: "emp-002", name: "Fatima Khan",    email: "fatima@againerp.com",  phone: "+880 1812-998877", designation: "Senior Developer",    department: "Engineering",     branch: "Dhaka HQ",    status: "active",    joinDate: "2020-07-01", salary: 120000, avatar: "FK", manager: "Rahim Uddin",  annualLeaveBalance: 14, sickLeaveBalance: 8 },
  { id: "emp-003", name: "Karim Ahmed",    email: "karim@againerp.com",   phone: "+880 1912-456789", designation: "Finance Analyst",     department: "Finance",         branch: "Dhaka HQ",    status: "active",    joinDate: "2022-01-10", salary: 75000,  avatar: "KA", manager: "CEO",          annualLeaveBalance: 10, sickLeaveBalance: 5 },
  { id: "emp-004", name: "Sadia Rahman",   email: "sadia@againerp.com",   phone: "+880 1612-567890", designation: "Marketing Exec",      department: "Marketing",       branch: "Dhaka HQ",    status: "on_leave",  joinDate: "2021-09-20", salary: 65000,  avatar: "SR", manager: "Rahim Uddin",  annualLeaveBalance: 3,  sickLeaveBalance: 4 },
  { id: "emp-005", name: "Tanvir Islam",   email: "tanvir@againerp.com",  phone: "+880 1512-678901", designation: "Warehouse Supervisor",department: "Warehouse",       branch: "Chittagong",  status: "active",    joinDate: "2019-11-05", salary: 55000,  avatar: "TI", manager: "Karim Ahmed",  annualLeaveBalance: 16, sickLeaveBalance: 6 },
  { id: "emp-006", name: "Nadia Begum",    email: "nadia@againerp.com",   phone: "+880 1412-789012", designation: "HR Manager",          department: "HR",              branch: "Dhaka HQ",    status: "active",    joinDate: "2020-04-12", salary: 80000,  avatar: "NB", manager: "CEO",          annualLeaveBalance: 12, sickLeaveBalance: 7 },
  { id: "emp-007", name: "Zahir Hossain",  email: "zahir@againerp.com",   phone: "+880 1312-890123", designation: "Support Agent",       department: "Customer Support",branch: "Dhaka HQ",    status: "probation", joinDate: "2026-03-01", salary: 40000,  avatar: "ZH", manager: "Nadia Begum",  annualLeaveBalance: 5,  sickLeaveBalance: 3 },
  { id: "emp-008", name: "Rima Akter",     email: "rima@againerp.com",    phone: "+880 1212-901234", designation: "Operations Lead",     department: "Operations",      branch: "Dhaka HQ",    status: "active",    joinDate: "2021-06-18", salary: 70000,  avatar: "RA", manager: "CEO",          annualLeaveBalance: 11, sickLeaveBalance: 5 },
  { id: "emp-009", name: "Milon Chandra",  email: "milon@againerp.com",   phone: "+880 1112-012345", designation: "Full Stack Developer",department: "Engineering",     branch: "Dhaka HQ",    status: "active",    joinDate: "2023-02-14", salary: 90000,  avatar: "MC", manager: "Fatima Khan",  annualLeaveBalance: 9,  sickLeaveBalance: 6 },
  { id: "emp-010", name: "Priya Das",      email: "priya@againerp.com",   phone: "+880 1012-123456", designation: "Sales Executive",     department: "Sales",           branch: "Sylhet",      status: "active",    joinDate: "2022-08-25", salary: 50000,  avatar: "PD", manager: "Rahim Uddin",  annualLeaveBalance: 8,  sickLeaveBalance: 5 },
  { id: "emp-011", name: "Jalal Uddin",    email: "jalal@againerp.com",   phone: "+880 1812-234567", designation: "Accountant",          department: "Finance",         branch: "Dhaka HQ",    status: "active",    joinDate: "2020-10-30", salary: 65000,  avatar: "JU", manager: "Karim Ahmed",  annualLeaveBalance: 13, sickLeaveBalance: 7 },
  { id: "emp-012", name: "Tasmin Nahar",   email: "tasmin@againerp.com",  phone: "+880 1912-345678", designation: "UI/UX Designer",      department: "Engineering",     branch: "Dhaka HQ",    status: "active",    joinDate: "2021-12-07", salary: 85000,  avatar: "TN", manager: "Fatima Khan",  annualLeaveBalance: 10, sickLeaveBalance: 6 },
];

// ─── Mock Attendance (today / this week) ─────────────────────────────────────

export const mockAttendanceToday: AttendanceRecord[] = [
  { id: "att-001", employeeId: "emp-001", date: "2026-06-21", checkIn: "09:02", checkOut: "18:15", status: "present",  hoursWorked: 9.2 },
  { id: "att-002", employeeId: "emp-002", date: "2026-06-21", checkIn: "08:55", checkOut: "18:00", status: "present",  hoursWorked: 9.1 },
  { id: "att-003", employeeId: "emp-003", date: "2026-06-21", checkIn: "09:45", checkOut: "18:00", status: "late",     hoursWorked: 8.3 },
  { id: "att-004", employeeId: "emp-004", date: "2026-06-21", checkIn: "",      checkOut: "",      status: "on_leave", hoursWorked: 0   },
  { id: "att-005", employeeId: "emp-005", date: "2026-06-21", checkIn: "08:30", checkOut: "17:00", status: "present",  hoursWorked: 8.5 },
  { id: "att-006", employeeId: "emp-006", date: "2026-06-21", checkIn: "09:00", checkOut: "18:00", status: "present",  hoursWorked: 9.0 },
  { id: "att-007", employeeId: "emp-007", date: "2026-06-21", checkIn: "",      checkOut: "",      status: "absent",   hoursWorked: 0   },
  { id: "att-008", employeeId: "emp-008", date: "2026-06-21", checkIn: "09:10", checkOut: "14:00", status: "half_day", hoursWorked: 4.8 },
  { id: "att-009", employeeId: "emp-009", date: "2026-06-21", checkIn: "09:01", checkOut: "19:00", status: "present",  hoursWorked: 10.0 },
  { id: "att-010", employeeId: "emp-010", date: "2026-06-21", checkIn: "08:50", checkOut: "17:30", status: "present",  hoursWorked: 8.7 },
  { id: "att-011", employeeId: "emp-011", date: "2026-06-21", checkIn: "09:05", checkOut: "18:10", status: "present",  hoursWorked: 9.1 },
  { id: "att-012", employeeId: "emp-012", date: "2026-06-21", checkIn: "",      checkOut: "",      status: "absent",   hoursWorked: 0   },
];

// ─── Mock Leave Requests ──────────────────────────────────────────────────────

export const mockLeaveRequests: LeaveRequest[] = [
  { id: "lv-001", employeeId: "emp-004", employeeName: "Sadia Rahman",  department: "Marketing",  type: "annual",   from: "2026-06-18", to: "2026-06-25", days: 6, reason: "Family vacation",         status: "approved", appliedOn: "2026-06-10" },
  { id: "lv-002", employeeId: "emp-007", employeeName: "Zahir Hossain", department: "Customer Support", type: "sick", from: "2026-06-21", to: "2026-06-22", days: 2, reason: "Fever and cold",   status: "pending",  appliedOn: "2026-06-20" },
  { id: "lv-003", employeeId: "emp-003", employeeName: "Karim Ahmed",   department: "Finance",    type: "casual",   from: "2026-06-28", to: "2026-06-28", days: 1, reason: "Personal work",           status: "pending",  appliedOn: "2026-06-19" },
  { id: "lv-004", employeeId: "emp-010", employeeName: "Priya Das",     department: "Sales",      type: "annual",   from: "2026-07-01", to: "2026-07-05", days: 5, reason: "Eid vacation",            status: "pending",  appliedOn: "2026-06-18" },
  { id: "lv-005", employeeId: "emp-001", employeeName: "Rahim Uddin",   department: "Sales",      type: "sick",     from: "2026-05-12", to: "2026-05-13", days: 2, reason: "Medical appointment",     status: "approved", appliedOn: "2026-05-11" },
  { id: "lv-006", employeeId: "emp-009", employeeName: "Milon Chandra", department: "Engineering",type: "annual",   from: "2026-07-10", to: "2026-07-14", days: 3, reason: "Travel",                  status: "rejected", appliedOn: "2026-06-15" },
  { id: "lv-007", employeeId: "emp-012", employeeName: "Tasmin Nahar",  department: "Engineering",type: "sick",     from: "2026-06-21", to: "2026-06-21", days: 1, reason: "Not feeling well",        status: "pending",  appliedOn: "2026-06-21" },
];

// ─── Mock Payroll ─────────────────────────────────────────────────────────────

export const mockPayroll: PayrollRecord[] = mockEmployees.map((emp) => ({
  id:           `pay-${emp.id}`,
  employeeId:   emp.id,
  employeeName: emp.name,
  department:   emp.department,
  month:        "Jun 2026",
  basicSalary:  emp.salary,
  bonus:        emp.status === "active" ? Math.round(emp.salary * 0.1) : 0,
  deductions:   Math.round(emp.salary * 0.05),
  tax:          Math.round(emp.salary * 0.08),
  netPay:       Math.round(emp.salary + emp.salary * 0.1 - emp.salary * 0.05 - emp.salary * 0.08),
  status:       emp.status === "resigned" ? "pending" : "processed",
}));
