import type { CrmContact } from "./types";

export const crmContactsSeed: CrmContact[] = [
  {
    id: "con-001",
    name: "Rahim Ahmed",
    email: "rahim@metroretail.bd",
    phone: "+880 1712 345678",
    company: "Metro Retail Ltd",
    title: "Procurement Head",
    ownerName: "Karim Hassan",
    lastActivityRelative: "2h ago",
    tags: ["decision-maker"],
  },
  {
    id: "con-002",
    name: "Sadia Khan",
    email: "sadia.k@greenmart.com",
    phone: "+880 1811 223344",
    company: "GreenMart Superstores",
    title: "Category Manager",
    ownerName: "Sadia Akter",
    lastActivityRelative: "1d ago",
    tags: ["retail"],
  },
  {
    id: "con-003",
    name: "Nusrat Jahan",
    email: "nusrat@urbanwear.bd",
    phone: "+880 1911 556677",
    company: "UrbanWear Retail",
    title: "CEO",
    ownerName: "Farhana Rahman",
    lastActivityRelative: "2d ago",
    tags: ["vip"],
  },
  {
    id: "con-004",
    name: "Imran Chowdhury",
    email: "imran@buildmart.bd",
    phone: "+880 1611 778899",
    company: "BuildMart Hardware",
    title: "Operations Director",
    ownerName: "Nadia Chowdhury",
    lastActivityRelative: "3d ago",
    tags: [],
  },
];

export function getCrmContactById(id: string) {
  return crmContactsSeed.find((c) => c.id === id);
}
