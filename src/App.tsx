import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AddStudent from "./pages/AddStudent.tsx";
import AddTutor from "./pages/AddTutor.tsx";
import AddCommission from "./pages/AddCommission.tsx";
import UnenrollStudent from "./pages/UnenrollStudent.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/add-student" element={<AddStudent />} />
          <Route path="/admin/add-tutor" element={<AddTutor />} />
          <Route path="/admin/add-commission" element={<AddCommission />} />
          <Route path="/admin/edit-commission/:id" element={<AddCommission />} />
          <Route path="/student/unenroll" element={<UnenrollStudent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
