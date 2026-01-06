import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Link2,
  Heart,
  Play,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useSpaces } from "@/hooks/useSpaces";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useToast } from "@/hooks/use-toast";
import { TestimonialGrid } from "@/components/dashboard/TestimonialGrid";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { SpaceSettings } from "@/components/dashboard/SpaceSettings";
import { Sidebar, View } from "@/components/dashboard/Sidebar";
import { WidgetLabView } from "@/components/dashboard/WidgetLabView";
import { PlanUpgradeCard } from "@/components/dashboard/PlanUpgradeCard";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { workspace, widgetSettings, loading: workspaceLoading, updateWidgetSettings } = useWorkspace();
  const { spaces, loading: spacesLoading, createSpace } = useSpaces();
  const { testimonials, loading: testimonialsLoading, updateStatus, deleteTestimonial } = useTestimonials(
    spaces.map((s) => s.id)
  );
  const { plan, features, loading: planLoading } = useUserPlan();
  const { toast } = useToast();

  const [activeView, setActiveView] = useState<View>("spaces");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
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

  const handleApprove = async (id: string) => {
    await updateStatus(id, "approved");
    toast({ title: "Testimonial approved" });
  };

  const handleReject = async (id: string) => {
    await updateStatus(id, "rejected");
    toast({ title: "Testimonial rejected" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const copyCollectionLink = (slug: string) => {
    const url = `${window.location.origin}/collect/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied to clipboard" });
  };

  const handleShare = (testimonial: Testimonial) => {
    // Simple share functionality - copy testimonial text
    const shareText = testimonial.type === "video"
      ? `Check out this video testimonial from ${testimonial.author_name}!`
      : testimonial.content || "";
    navigator.clipboard.writeText(shareText);
    toast({ title: "Testimonial copied to clipboard" });
  };

  const embedCode = workspace?.id
    ? `<script src="${window.location.origin}/widget.js" data-id="${workspace.id}"></script>`
    : `<!-- Please create a workspace first -->`;

  const hasTestimonials = testimonials.length > 0;

  if (workspaceLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        workspace={workspace}
        plan={plan}
        activeView={activeView}
        setActiveView={setActiveView}
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        newSpaceName={newSpaceName}
        setNewSpaceName={setNewSpaceName}
        handleCreateSpace={handleCreateSpace}
        creatingSpace={creatingSpace}
        handleSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          {/* Spaces / Feed View */}
          {activeView === "spaces" && (
            <motion.div
              key="spaces"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-black text-primary">Testimonials</h1>
                  <p className="text-subtext">Manage and curate your social proof</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="hero"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  {spaces.length > 0 && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => copyCollectionLink(spaces[0].slug)}
                    >
                      <Link2 className="w-4 h-4" />
                      <span className="hidden md:inline">Copy Link</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Spaces list */}
              <SpaceSettings spaces={spaces} onCopyLink={copyCollectionLink} />

              {!hasTestimonials && spaces.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-24 h-24 mb-6 rounded-full bg-slate flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary/40" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    You haven't collected trust yet.
                  </h2>
                  <p className="text-subtext mb-8 text-center max-w-md">
                    Create a collection space and share the link with your customers to start
                    gathering powerful testimonials.
                  </p>
                  <Button
                    variant="hero"
                    size="lg"
                    className="gap-2"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="w-5 h-5" />
                    Create Collection Space
                  </Button>
                </div>
              ) : (
                /* Testimonial Grid */
                <TestimonialGrid
                  testimonials={testimonials}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={deleteTestimonial}
                  onShare={handleShare}
                />
              )}
            </motion.div>
          )}

          {/* Analytics View */}
          {activeView === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-black text-primary">Analytics</h1>
                <p className="text-subtext">Track your testimonial performance</p>
              </div>

              <AnalyticsCards
                totalTestimonials={testimonials.length}
                approvedCount={testimonials.filter(t => t.status === "approved").length}
                pendingCount={testimonials.filter(t => t.status === "pending").length}
              />

              {/* Usage Limits */}
              <div className="p-6 bg-card border border-border/[0.08] rounded-[12px]">
                <h3 className="font-semibold text-primary mb-4">Usage & Limits</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-foreground">Testimonials</p>
                      <p className="text-sm text-subtext">
                        {testimonials.length} / {features.testimonialLimit}
                      </p>
                    </div>
                    <div className="h-2 bg-slate rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min((testimonials.length / features.testimonialLimit) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-foreground">Active Spaces</p>
                      <p className="text-sm text-subtext">
                        {spaces.length} / {features.activeSpacesLimit}
                      </p>
                    </div>
                    <div className="h-2 bg-slate rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min((spaces.length / features.activeSpacesLimit) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/[0.08]">
                    <p className="text-xs text-subtext mb-2">Your Plan Features:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full capitalize">
                        {plan} Plan
                      </span>
                      <span className="px-2 py-1 bg-slate text-subtext text-xs rounded-full">
                        {features.videoDurationSeconds}s video limit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Wall of Love View */}
          {activeView === "wall" && (
            <motion.div
              key="wall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-black text-primary">Wall of Love</h1>
                <p className="text-subtext">Your approved testimonials</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials
                  .filter((t) => t.status === "approved")
                  .map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="p-6 bg-card border border-border/[0.08] rounded-[12px] relative overflow-hidden"
                    >
                      {/* Video badge */}
                      {testimonial.type === "video" && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                          <Play className="w-3 h-3 text-primary fill-current" />
                          <span className="text-[10px] font-medium text-primary">Video</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                            {testimonial.author_avatar_url ? (
                              <AvatarImage src={testimonial.author_avatar_url} alt={testimonial.author_name} />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {testimonial.author_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {testimonial.type === "video" && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                              <Play className="w-2.5 h-2.5 text-primary-foreground fill-current" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">
                            {testimonial.author_name}
                          </p>
                          {testimonial.author_title && (
                            <p className="text-xs text-subtext">{testimonial.author_title}</p>
                          )}
                          {testimonial.author_company && (
                            <p className="text-xs text-subtext">{testimonial.author_company}</p>
                          )}
                        </div>
                      </div>
                      {testimonial.rating && (
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-amber-400 text-sm">★</span>
                          ))}
                        </div>
                      )}
                      {testimonial.type === "video" && testimonial.video_url ? (
                        <video
                          src={testimonial.video_url}
                          controls
                          className="w-full rounded-lg mt-2"
                        />
                      ) : (
                        <p className="text-foreground/80 text-sm leading-relaxed">
                          {testimonial.content}
                        </p>
                      )}
                    </div>
                  ))}
              </div>

              {testimonials.filter((t) => t.status === "approved").length === 0 && (
                <div className="text-center py-16">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-primary/20" />
                  <p className="text-subtext">No approved testimonials yet</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Settings View */}
          {activeView === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-black text-primary">Settings</h1>
                <p className="text-subtext">Manage your workspace</p>
              </div>

              <div className="max-w-2xl space-y-6">
                {/* Plan & Upgrade Section */}
                <PlanUpgradeCard
                  currentPlan={plan}
                  features={features}
                  user={user}
                />

                <div className="p-6 bg-card border border-border/[0.08] rounded-[12px]">
                  <h3 className="font-semibold text-primary mb-4">Workspace</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-subtext">Name</label>
                      <p className="font-medium text-foreground">{workspace?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-subtext">Primary Color</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: workspace?.primary_color }}
                        />
                        <span className="text-foreground">{workspace?.primary_color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-card border border-border/[0.08] rounded-[12px]">
                  <h3 className="font-semibold text-primary mb-4">Account</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-subtext">Email</label>
                      <p className="font-medium text-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Sign Out */}
                <div className="md:hidden">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Widget Lab View */}
          {activeView === "widget" && (
            <WidgetLabView
              widgetSettings={widgetSettings}
              updateWidgetSettings={updateWidgetSettings}
              testimonials={testimonials}
              embedCode={embedCode}
            />
          )}
        </AnimatePresence>
      </main>

      <BottomNavigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default Dashboard;
