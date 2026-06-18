import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  hrEmployeesSeed,
  type Employee,
  type EmployeeStatus,
} from "@/lib/mock-data/hr-employees";

type HrEmployeeState = {
  employees: Employee[];
  upsertEmployee: (employee: Employee) => void;
  updateStatus: (id: string, status: EmployeeStatus) => void;
};

export const useHrEmployeeStore = create<HrEmployeeState>()(
  persist(
    (set, get) => ({
      employees: hrEmployeesSeed,
      upsertEmployee: (employee) => {
        const list = get().employees;
        const idx = list.findIndex((e) => e.id === employee.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = employee;
          set({ employees: next });
        } else {
          set({ employees: [employee, ...list] });
        }
      },
      updateStatus: (id, status) => {
        set({
          employees: get().employees.map((e) => (e.id === id ? { ...e, status } : e)),
        });
      },
    }),
    { name: "againerp-hr-employees", version: 1 },
  ),
);
