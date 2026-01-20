import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useSpaces } from "@/hooks/useSpaces";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useToast } from "@/hooks/use-toast";

// New Modular Components
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHome } from "@/pages/DashboardHome";
// import { AnalyticsView } from "@/components/dashboard/AnalyticsView"; // Removed
import { TestimonialsView } from "@/pages/TestimonialsView";
import { WidgetLabView } from "@/components/dashboard/WidgetLabView";
import { SettingsView } from "@/pages/SettingsView";
import { SpaceSettingsView } from "@/pages/SpaceSettingsView";
import { SpacesManagementView } from "@/pages/SpacesManagementView";
import { PlanUpgradeCard } from "@/components/dashboard/PlanUpgradeCard";

type View = "spaces" | "analytics" | "wall" | "settings" | "widget" | "space-settings" | "manage-spaces";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { workspace, widgetSettings, loading: workspaceLoading, updateWidgetSettings } = useWorkspace();
  const { spaces, loading: spacesLoading, createSpace, updateSpace, deleteSpace } = useSpaces();
  const { testimonials, loading: testimonialsLoading, updateStatus, deleteTestimonial } = useTestimonials(
    spaces.map((s) => s.id)
  );
  const { plan, features } = useUserPlan();
  const { toast } = useToast();

  const [activeView, setActiveView] = useState<View>("spaces");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creatingSpace, setCreatingSpace] = useState(false);

  // Redirect to onboarding if no workspace
  useEffect(() => {
    if (!workspaceLoading && !workspace && user) {
      navigate("/onboarding", { replace: true });
    }
  }, [workspace, workspaceLoading, user, navigate]);

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) return;

    setCreatingSpace(true);
    const { data, error } = await createSpace(newSpaceName.trim());
    setCreatingSpace(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to create space",
        description: "Please try again.",
      });
      return;
    }

    setNewSpaceName("");
    setCreateDialogOpen(false);
    toast({
      title: "Space created",
      description: "Your collection space is ready.",
    });
  };

  const handleManageSpace = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    setActiveView("space-settings");
  };

  const handleApprove = async (id: string) => {
    await updateStatus(id, "approved");
    toast({ title: "Testimonial approved" });
  };

  const handleReject = async (id: string) => {
    await updateStatus(id, "rejected");
    toast({ title: "Testimonial rejected" });
  };

  const copyCollectionLink = (slug: string) => {
    const url = `${window.location.origin}/collect/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied to clipboard" });
  };

  const handleShare = (testimonial: Testimonial) => {
    const shareText = testimonial.type === "video"
      ? `Check out this video testimonial from ${testimonial.name}!`
      : testimonial.content || "";
    navigator.clipboard.writeText(shareText);
    toast({ title: "Testimonial copied to clipboard" });
  };

  const embedCode = workspace?.id
    ? `<script src="${window.location.origin}/widget.js" data-id="${workspace.id}"></script>`
    : `<!-- Please create a workspace first -->`;

  if (workspaceLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout
      activeView={activeView}
      setActiveView={(view) => setActiveView(view as View)}
      user={user}
      testimonials={testimonials}
      spaces={spaces}
      workspace={workspace}
    >
      {/* Overview / Home View */}
      {activeView === "spaces" && (
        <DashboardHome
          user={user}
          spaces={spaces}
          testimonials={testimonials}
          setCreateDialogOpen={setCreateDialogOpen}
          copyCollectionLink={copyCollectionLink}
          setActiveView={setActiveView}
          onManageSpace={handleManageSpace}
          updateSpace={updateSpace}
          deleteSpace={deleteSpace}
        />
      )}

      {/* Wall of Love (Testimonials) View */}
      {activeView === "wall" && (
        <TestimonialsView
          testimonials={testimonials}
          spaces={spaces}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={deleteTestimonial}
          onShare={handleShare}
        />
      )}

      {/* Widget Lab View */}
      {activeView === "widget" && (
        <WidgetLabView
          widgetSettings={widgetSettings}
          updateWidgetSettings={updateWidgetSettings}
          testimonials={testimonials}
          embedCode={embedCode}
          spaces={spaces}
          workspaceId={workspace?.id}
        />
      )}

      {/* Settings View */}
      {activeView === "settings" && (
        <SettingsView
          user={user}
          workspace={workspace}
          plan={plan}
          features={features}
          signOut={signOut}
        />
      )}

      {/* Space Settings View */}
      {activeView === "space-settings" && (
        <SpaceSettingsView
          spaceId={selectedSpaceId}
          spaces={spaces}
          updateSpace={updateSpace}
          deleteSpace={deleteSpace}
          onBack={() => {
            setSelectedSpaceId(null);
            setActiveView("spaces");
          }}
        />
      )}

      {/* Spaces Management View */}
      {activeView === "manage-spaces" && (
        <SpacesManagementView
          spaces={spaces}
          testimonials={testimonials}
          createSpace={createSpace}
          updateSpace={updateSpace}
          deleteSpace={deleteSpace}
          updateTestimonial={updateStatus}
          deleteTestimonial={deleteTestimonial}
          onManageSpace={handleManageSpace}
        />
      )}

      {/* Create Dialog (Hidden Logic) */}
      {createDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-[24px] border border-gray-100 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-black">Create New Space</h2>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black/5 text-black placeholder:text-gray-400"
              placeholder="e.g. Product Reviews"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreateDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSpace}
                disabled={creatingSpace || !newSpaceName.trim()}
                className="px-6 py-2 text-sm font-bold bg-black text-white rounded-full hover:bg-gray-900 disabled:opacity-50 shadow-lg shadow-black/20 transition-all"
              >
                {creatingSpace ? "Creating..." : "Create Space"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
