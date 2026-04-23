import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "@/data/types";
import AppSidebar from "@/components/AppSidebar";
import Topbar from "@/components/Topbar";
import TutorDashboard from "@/pages/TutorDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

const userNames: Record<Role, string> = {
  student: "Lucía Martínez",
  tutor: "María González",
  admin: "Admin TVU",
};

export default function Index() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("tutor");
  const [activeItem, setActiveItem] = useState("home");
  const [showStudentCalendar, setShowStudentCalendar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentUnenrolled, setStudentUnenrolled] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("studentUnenrolled") === "true"
  );

  const handleSidebarClick = (id: string) => {
    if (role === "student" && id === "baja") {
      navigate("/student/unenroll");
      return;
    }
    setActiveItem(id);
    if (role === "student" && id === "calendar") {
      setShowStudentCalendar(prev => !prev);
    }
    if (id === "redes") {
      window.open("https://www.unq.edu.ar", "_blank");
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setActiveItem("home");
    setShowStudentCalendar(false);
    // Re-read flag in case it changed in another tab/page
    setStudentUnenrolled(localStorage.getItem("studentUnenrolled") === "true");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar
        role={role}
        activeItem={activeItem}
        onItemClick={handleSidebarClick}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        hideStudentUnenroll={studentUnenrolled}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          userName={userNames[role]}
          role={role}
          onRoleChange={handleRoleChange}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-3 sm:p-6">
          {role === "tutor" && <TutorDashboard />}
          {role === "student" && (
            <StudentDashboard
              showCalendar={showStudentCalendar}
              onCloseCalendar={() => setShowStudentCalendar(false)}
              unenrolled={studentUnenrolled}
            />
          )}
          {role === "admin" && <AdminDashboard />}
        </main>
      </div>
    </div>
  );
}
