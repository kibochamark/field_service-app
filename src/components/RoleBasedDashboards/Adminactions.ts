// Adminactions.ts
import { auth } from "@/auth";
import { baseUrl } from "@/utils/constants";

export async function getAdminDashboardData() {
  try {
    const session = await auth();

    if (!session || !session.user?.access_token) {
      throw new Error("Unauthorized: No access token available.");
    }

    const res = await fetch(`${baseUrl}${session.user.companyId}/metrics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      next: { tags: ["getadmindashboard"] }
    });

    const data = await res.json();

    console.log(data, "ADMIN DASHBOARD")
    if (res.ok) {
      return data || [];
    } else {
      console.error(`Error fetching admin dashboard data: ${res.status} - ${res.statusText}`);
      return [];
    }
  } catch (e: any) {
    console.error("Failed to fetch admin dashboard data:", e);
    return [];
  }
}
