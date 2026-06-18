/**
 * HR Employee mock data — SCR-HR-EMP-001
 * @see docs/modules/hr-payroll/uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md
 */

export type EmployeeStatus = "active" | "probation" | "on_leave" | "terminated" | "archived";

export type Employee = {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  department: string;
  designationId: string;
  designation: string;
  branchId: string;
  branch: string;
  status: EmployeeStatus;
  joiningDate: string;
  managerId?: string;
  managerName?: string;
  employmentType?: string;
};

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "Active",
  probation: "Probation",
  on_leave: "On Leave",
  terminated: "Terminated",
  archived: "Archived",
};

export const HR_DEPARTMENTS = [
  { id: "ops", name: "Operations" },
  { id: "sales", name: "Sales & Marketing" },
  { id: "tech", name: "Technology" },
  { id: "finance", name: "Finance" },
  { id: "hr", name: "Human Resources" },
  { id: "logistics", name: "Logistics" },
] as const;

export const HR_BRANCHES = [
  { id: "dhk", name: "Dhaka HQ" },
  { id: "ctg", name: "Chittagong" },
  { id: "syl", name: "Sylhet" },
] as const;

export const HR_DESIGNATIONS = [
  "Managing Director",
  "General Manager",
  "Department Head",
  "Senior Executive",
  "Executive",
  "Assistant Manager",
  "Officer",
  "Associate",
  "Intern",
] as const;

function emp(
  partial: Omit<Employee, "name"> & { name?: string },
): Employee {
  const name = partial.name ?? `${partial.firstName} ${partial.lastName}`;
  return { ...partial, name };
}

export const hrEmployeesSeed: Employee[] = [
  emp({ id: "emp-001", employeeNumber: "EMP-0001", firstName: "Rafiq", lastName: "Ahmed", email: "rafiq.ahmed@urbanwear.bd", phone: "+880 1711-000001", departmentId: "ops", department: "Operations", designationId: "gm", designation: "General Manager", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2018-03-12", managerName: "Board" }),
  emp({ id: "emp-002", employeeNumber: "EMP-0002", firstName: "Fatima", lastName: "Rahman", email: "fatima.rahman@urbanwear.bd", phone: "+880 1711-000002", departmentId: "hr", department: "Human Resources", designationId: "dh", designation: "Department Head", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2019-06-01", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-003", employeeNumber: "EMP-0003", firstName: "Karim", lastName: "Hassan", email: "karim.hassan@urbanwear.bd", phone: "+880 1711-000003", departmentId: "tech", department: "Technology", designationId: "se", designation: "Senior Executive", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2020-01-15", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-004", employeeNumber: "EMP-0004", firstName: "Nusrat", lastName: "Jahan", email: "nusrat.jahan@urbanwear.bd", phone: "+880 1711-000004", departmentId: "sales", department: "Sales & Marketing", designationId: "am", designation: "Assistant Manager", branchId: "dhk", branch: "Dhaka HQ", status: "on_leave", joiningDate: "2020-08-20", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-005", employeeNumber: "EMP-0005", firstName: "Sadia", lastName: "Islam", email: "sadia.islam@urbanwear.bd", phone: "+880 1711-000005", departmentId: "ops", department: "Operations", designationId: "off", designation: "Officer", branchId: "ctg", branch: "Chittagong", status: "active", joiningDate: "2021-02-10", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-006", employeeNumber: "EMP-0006", firstName: "Arif", lastName: "Chowdhury", email: "arif.chowdhury@urbanwear.bd", phone: "+880 1711-000006", departmentId: "logistics", department: "Logistics", designationId: "exec", designation: "Executive", branchId: "dhk", branch: "Dhaka HQ", status: "probation", joiningDate: "2026-05-02", managerId: "emp-001", managerName: "Rafiq Ahmed", employmentType: "Permanent" }),
  emp({ id: "emp-007", employeeNumber: "EMP-0007", firstName: "Tasnim", lastName: "Karim", email: "tasnim.karim@urbanwear.bd", phone: "+880 1711-000007", departmentId: "finance", department: "Finance", designationId: "se", designation: "Senior Executive", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2019-11-05", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-008", employeeNumber: "EMP-0008", firstName: "Imran", lastName: "Hossain", email: "imran.hossain@urbanwear.bd", phone: "+880 1711-000008", departmentId: "tech", department: "Technology", designationId: "exec", designation: "Executive", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2022-04-18", managerId: "emp-003", managerName: "Karim Hassan" }),
  emp({ id: "emp-009", employeeNumber: "EMP-0009", firstName: "Mariam", lastName: "Akter", email: "mariam.akter@urbanwear.bd", phone: "+880 1711-000009", departmentId: "sales", department: "Sales & Marketing", designationId: "off", designation: "Officer", branchId: "ctg", branch: "Chittagong", status: "active", joiningDate: "2021-09-01", managerId: "emp-004", managerName: "Nusrat Jahan" }),
  emp({ id: "emp-010", employeeNumber: "EMP-0010", firstName: "Hasan", lastName: "Mahmud", email: "hasan.mahmud@urbanwear.bd", phone: "+880 1711-000010", departmentId: "ops", department: "Operations", designationId: "assoc", designation: "Associate", branchId: "syl", branch: "Sylhet", status: "active", joiningDate: "2023-01-09", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-011", employeeNumber: "EMP-0011", firstName: "Priya", lastName: "Das", email: "priya.das@urbanwear.bd", phone: "+880 1711-000011", departmentId: "hr", department: "Human Resources", designationId: "off", designation: "Officer", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2022-07-14", managerId: "emp-002", managerName: "Fatima Rahman" }),
  emp({ id: "emp-012", employeeNumber: "EMP-0012", firstName: "Omar", lastName: "Faruk", email: "omar.faruk@urbanwear.bd", phone: "+880 1711-000012", departmentId: "logistics", department: "Logistics", designationId: "off", designation: "Officer", branchId: "ctg", branch: "Chittagong", status: "probation", joiningDate: "2026-03-20", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-013", employeeNumber: "EMP-0013", firstName: "Laboni", lastName: "Sarker", email: "laboni.sarker@urbanwear.bd", phone: "+880 1711-000013", departmentId: "finance", department: "Finance", designationId: "off", designation: "Officer", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2021-12-01", managerId: "emp-007", managerName: "Tasnim Karim" }),
  emp({ id: "emp-014", employeeNumber: "EMP-0014", firstName: "Shahid", lastName: "Alam", email: "shahid.alam@urbanwear.bd", phone: "+880 1711-000014", departmentId: "tech", department: "Technology", designationId: "assoc", designation: "Associate", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2024-02-19", managerId: "emp-003", managerName: "Karim Hassan" }),
  emp({ id: "emp-015", employeeNumber: "EMP-0015", firstName: "Rina", lastName: "Begum", email: "rina.begum@urbanwear.bd", phone: "+880 1711-000015", departmentId: "sales", department: "Sales & Marketing", designationId: "exec", designation: "Executive", branchId: "syl", branch: "Sylhet", status: "on_leave", joiningDate: "2020-05-25", managerId: "emp-004", managerName: "Nusrat Jahan" }),
  emp({ id: "emp-016", employeeNumber: "EMP-0016", firstName: "Jamal", lastName: "Uddin", email: "jamal.uddin@urbanwear.bd", phone: "+880 1711-000016", departmentId: "ops", department: "Operations", designationId: "off", designation: "Officer", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2019-04-30", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-017", employeeNumber: "EMP-0017", firstName: "Anika", lastName: "Chowdhury", email: "anika.chowdhury@urbanwear.bd", phone: "+880 1711-000017", departmentId: "hr", department: "Human Resources", designationId: "assoc", designation: "Associate", branchId: "ctg", branch: "Chittagong", status: "active", joiningDate: "2023-08-07", managerId: "emp-002", managerName: "Fatima Rahman" }),
  emp({ id: "emp-018", employeeNumber: "EMP-0018", firstName: "Faisal", lastName: "Khan", email: "faisal.khan@urbanwear.bd", phone: "+880 1711-000018", departmentId: "finance", department: "Finance", designationId: "assoc", designation: "Associate", branchId: "ctg", branch: "Chittagong", status: "active", joiningDate: "2024-06-11", managerId: "emp-007", managerName: "Tasnim Karim" }),
  emp({ id: "emp-019", employeeNumber: "EMP-0019", firstName: "Mehjabin", lastName: "Hoque", email: "mehjabin.hoque@urbanwear.bd", phone: "+880 1711-000019", departmentId: "tech", department: "Technology", designationId: "intern", designation: "Intern", branchId: "dhk", branch: "Dhaka HQ", status: "probation", joiningDate: "2026-01-06", managerId: "emp-003", managerName: "Karim Hassan" }),
  emp({ id: "emp-020", employeeNumber: "EMP-0020", firstName: "Rubel", lastName: "Mia", email: "rubel.mia@urbanwear.bd", phone: "+880 1711-000020", departmentId: "logistics", department: "Logistics", designationId: "assoc", designation: "Associate", branchId: "syl", branch: "Sylhet", status: "active", joiningDate: "2022-11-22", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-021", employeeNumber: "EMP-0021", firstName: "Sumaiya", lastName: "Parvin", email: "sumaiya.parvin@urbanwear.bd", phone: "+880 1711-000021", departmentId: "sales", department: "Sales & Marketing", designationId: "assoc", designation: "Associate", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2023-03-15", managerId: "emp-004", managerName: "Nusrat Jahan" }),
  emp({ id: "emp-022", employeeNumber: "EMP-0022", firstName: "Kamal", lastName: "Hossain", email: "kamal.hossain@urbanwear.bd", phone: "+880 1711-000022", departmentId: "ops", department: "Operations", designationId: "exec", designation: "Executive", branchId: "ctg", branch: "Chittagong", status: "terminated", joiningDate: "2017-09-01", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-023", employeeNumber: "EMP-0023", firstName: "Nadia", lastName: "Sultana", email: "nadia.sultana@urbanwear.bd", phone: "+880 1711-000023", departmentId: "finance", department: "Finance", designationId: "am", designation: "Assistant Manager", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2018-10-10", managerId: "emp-007", managerName: "Tasnim Karim" }),
  emp({ id: "emp-024", employeeNumber: "EMP-0024", firstName: "Tanvir", lastName: "Islam", email: "tanvir.islam@urbanwear.bd", phone: "+880 1711-000024", departmentId: "tech", department: "Technology", designationId: "am", designation: "Assistant Manager", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2019-02-28", managerId: "emp-003", managerName: "Karim Hassan" }),
  emp({ id: "emp-025", employeeNumber: "EMP-0025", firstName: "Shamima", lastName: "Khatun", email: "shamima.khatun@urbanwear.bd", phone: "+880 1711-000025", departmentId: "hr", department: "Human Resources", designationId: "exec", designation: "Executive", branchId: "syl", branch: "Sylhet", status: "archived", joiningDate: "2016-07-18", managerId: "emp-002", managerName: "Fatima Rahman" }),
  emp({ id: "emp-026", employeeNumber: "EMP-0026", firstName: "Biplob", lastName: "Das", email: "biplob.das@urbanwear.bd", phone: "+880 1711-000026", departmentId: "logistics", department: "Logistics", designationId: "se", designation: "Senior Executive", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2017-12-05", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
  emp({ id: "emp-027", employeeNumber: "EMP-0027", firstName: "Farzana", lastName: "Yasmin", email: "farzana.yasmin@urbanwear.bd", phone: "+880 1711-000027", departmentId: "sales", department: "Sales & Marketing", designationId: "se", designation: "Senior Executive", branchId: "dhk", branch: "Dhaka HQ", status: "active", joiningDate: "2018-08-14", managerId: "emp-004", managerName: "Nusrat Jahan" }),
  emp({ id: "emp-028", employeeNumber: "EMP-0028", firstName: "Mahbub", lastName: "Alam", email: "mahbub.alam@urbanwear.bd", phone: "+880 1711-000028", departmentId: "ops", department: "Operations", designationId: "am", designation: "Assistant Manager", branchId: "syl", branch: "Sylhet", status: "active", joiningDate: "2020-10-30", managerId: "emp-001", managerName: "Rafiq Ahmed" }),
];

export function getEmployeeById(id: string): Employee | undefined {
  return hrEmployeesSeed.find((e) => e.id === id);
}

export function employeeInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatEmployeeDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function countEmployeesByStatus(employees: Employee[]) {
  const counts: Record<EmployeeStatus | "all", number> = {
    all: employees.length,
    active: 0,
    probation: 0,
    on_leave: 0,
    terminated: 0,
    archived: 0,
  };
  for (const e of employees) counts[e.status]++;
  return counts;
}

export function employeeStatusBadgeVariant(
  status: EmployeeStatus,
): "default" | "secondary" | "muted" | "outline" | "success" | "warning" {
  switch (status) {
    case "active":
      return "success";
    case "probation":
      return "warning";
    case "on_leave":
      return "outline";
    case "terminated":
      return "warning";
    case "archived":
      return "muted";
    default:
      return "muted";
  }
}
