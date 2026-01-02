import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  BarChart3,
  Heart,
  Settings,
  Plus,
  Link2,
  Check,
  X,
  Share2,
  Code2,
  Palette,
  Copy,
  ChevronDown,
  Sparkles,
  Video,
  Menu,
  LogOut,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useSpaces } from "@/hooks/useSpaces";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import { useToast } from "@/hooks/use-toast";
import logoPrimary from "@/assets/logo-primary.svg";

type View = "spaces" | "analytics" | "wall" | "settings" | "widget";

const sidebarItems = [
  { id: "spaces" as View, icon: LayoutGrid, label: "Spaces" },
  { id: "analytics" as View, icon: BarChart3, label: "Analytics" },
  { id: "wall" as View, icon: Heart, label: "Wall of Love" },
  { id: "settings" as View, icon: Settings, label: "Settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { workspace, widgetSettings, loading: workspaceLoading, updateWidgetSettings } = useWorkspace();
  const { spaces, loading: spacesLoading, createSpace } = useSpaces();
  const { testimonials, loading: testimonialsLoading, updateStatus, deleteTestimonial } = useTestimonials(
    spaces.map((s) => s.id)
  );
  const { toast } = useToast();

  const [activeView, setActiveView] = useState<View>("spaces");
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const embedCode = `<script src="${window.location.origin}/widget.js" data-id="${workspace?.id || ""}"></script>`;

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
      {/* Sidebar */}
      <motion.aside
        className={`bg-slate border-r border-border/[0.08] flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <img
            src={logoPrimary}
            alt="Vouchy"
            className={`transition-all duration-300 ${sidebarOpen ? "h-7" : "h-6"}`}
          />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-background/50 rounded-lg transition-colors"
          >
            <Menu className="w-4 h-4 text-subtext" />
          </button>
        </div>

        {/* Workspace */}
        <div className="px-4 mb-6">
          <button className="w-full p-3 bg-background rounded-[8px] flex items-center gap-3 hover:shadow-sm transition-shadow">
            <div
              className="w-8 h-8 rounded-[6px] flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: workspace?.primary_color || "#1a3f64" }}
            >
              {workspace?.name?.charAt(0) || "W"}
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-primary truncate">
                    {workspace?.name || "My Workspace"}
                  </p>
                  <p className="text-xs text-subtext">Free plan</p>
                </div>
                <ChevronDown className="w-4 h-4 text-subtext" />
              </>
            )}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full p-3 mb-1 rounded-[8px] flex items-center gap-3 transition-all duration-200 ${
                activeView === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-background/50"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}

          <div className="my-4 h-px bg-border/[0.08]" />

          <button
            onClick={() => setActiveView("widget")}
            className={`w-full p-3 rounded-[8px] flex items-center gap-3 transition-all duration-200 ${
              activeView === "widget"
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-background/50"
            }`}
          >
            <Palette className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Widget Lab</span>}
          </button>
        </nav>

        {/* Bottom actions */}
        <div className="p-4 space-y-2">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className={`w-full ${!sidebarOpen && "p-2"}`}>
                <Plus className="w-4 h-4" />
                {sidebarOpen && <span className="ml-2">New Space</span>}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new space</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Space name (e.g., Product Reviews)"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  maxLength={100}
                />
                <Button 
                  variant="hero" 
                  className="w-full" 
                  onClick={handleCreateSpace}
                  disabled={!newSpaceName.trim() || creatingSpace}
                >
                  {creatingSpace ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Space"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            className={`w-full text-subtext hover:text-foreground ${!sidebarOpen && "p-2"}`}
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
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
                {spaces.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => copyCollectionLink(spaces[0].slug)}
                  >
                    <Link2 className="w-4 h-4" />
                    Copy Collection Link
                  </Button>
                )}
              </div>

              {/* Spaces list */}
              {spaces.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-subtext mb-3">Your Spaces</h3>
                  <div className="flex flex-wrap gap-2">
                    {spaces.map((space) => (
                      <div
                        key={space.id}
                        className="px-4 py-2 bg-card border border-border/[0.08] rounded-lg flex items-center gap-3"
                      >
                        <span className="font-medium text-foreground">{space.name}</span>
                        <button
                          onClick={() => copyCollectionLink(space.slug)}
                          className="p-1 hover:bg-slate rounded transition-colors"
                          title="Copy link"
                        >
                          <Link2 className="w-3 h-3 text-subtext" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
              ) : !hasTestimonials && spaces.length > 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 mb-6 rounded-full bg-slate flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary/40" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-2">
                    No testimonials yet
                  </h2>
                  <p className="text-subtext mb-6 text-center max-w-md">
                    Share your collection link with customers to start receiving testimonials.
                  </p>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => copyCollectionLink(spaces[0].slug)}
                  >
                    <Link2 className="w-4 h-4" />
                    Copy Collection Link
                  </Button>
                </div>
              ) : (
                /* Testimonial Cards */
                <div className="grid gap-4">
                  {testimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onDelete={deleteTestimonial}
                    />
                  ))}
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Total Testimonials", value: testimonials.length },
                  { label: "Approved", value: testimonials.filter(t => t.status === "approved").length },
                  { label: "Pending", value: testimonials.filter(t => t.status === "pending").length },
                ].map((stat) => (
                  <div key={stat.label} className="p-6 bg-card border border-border/[0.08] rounded-[12px]">
                    <p className="text-sm text-subtext mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                ))}
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
                      className="p-6 bg-card border border-border/[0.08] rounded-[12px]"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {testimonial.author_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">
                            {testimonial.author_name}
                          </p>
                          {testimonial.author_company && (
                            <p className="text-xs text-subtext">{testimonial.author_company}</p>
                          )}
                        </div>
                      </div>
                      {testimonial.rating && (
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-primary text-sm">★</span>
                          ))}
                        </div>
                      )}
                      <p className="text-foreground/80 text-sm leading-relaxed">
                        {testimonial.content}
                      </p>
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

              <div className="max-w-xl space-y-6">
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
              </div>
            </motion.div>
          )}

          {/* Widget Lab */}
          {activeView === "widget" && (
            <motion.div
              key="widget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-black text-primary">Widget Lab</h1>
                <p className="text-subtext">Customize your embeddable wall</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Settings */}
                <div className="space-y-6">
                  <div className="p-6 bg-card border border-border/[0.08] rounded-[12px]">
                    <h3 className="font-semibold text-primary mb-6">Appearance</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Dark Mode</p>
                          <p className="text-sm text-subtext">Enable dark theme</p>
                        </div>
                        <Switch
                          checked={widgetSettings?.dark_mode || false}
                          onCheckedChange={(checked) =>
                            updateWidgetSettings({ dark_mode: checked })
                          }
                        />
                      </div>

                      <div className="h-px bg-border/[0.08]" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Layout</p>
                          <p className="text-sm text-subtext">Grid or Carousel</p>
                        </div>
                        <div className="flex gap-2">
                          {["grid", "carousel"].map((layout) => (
                            <button
                              key={layout}
                              onClick={() => updateWidgetSettings({ layout })}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                widgetSettings?.layout === layout
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-slate text-foreground/70"
                              }`}
                            >
                              {layout.charAt(0).toUpperCase() + layout.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-border/[0.08]" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Show Video First</p>
                          <p className="text-sm text-subtext">Prioritize video testimonials</p>
                        </div>
                        <Switch
                          checked={widgetSettings?.show_video_first || false}
                          onCheckedChange={(checked) =>
                            updateWidgetSettings({ show_video_first: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Code Generator */}
                  <div className="p-6 bg-card border border-border/[0.08] rounded-[12px]">
                    <div className="flex items-center gap-2 mb-4">
                      <Code2 className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-primary">Embed Code</h3>
                    </div>
                    <div className="bg-slate p-4 rounded-[8px] font-mono text-sm text-foreground/80 mb-4 overflow-x-auto">
                      {embedCode}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        navigator.clipboard.writeText(embedCode);
                        toast({ title: "Embed code copied" });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-6 bg-slate rounded-[12px]">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      Widget Preview
                    </span>
                  </div>
                  <div
                    className={`p-6 rounded-[12px] ${
                      widgetSettings?.dark_mode ? "bg-gray-900" : "bg-background"
                    }`}
                  >
                    <div
                      className={`grid gap-4 ${
                        widgetSettings?.layout === "grid" ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {testimonials
                        .filter((t) => t.status === "approved")
                        .slice(0, 4)
                        .map((t) => (
                          <div
                            key={t.id}
                            className={`p-4 rounded-[8px] ${
                              widgetSettings?.dark_mode
                                ? "bg-gray-800"
                                : "bg-slate border border-border/[0.08]"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20" />
                              <div>
                                <p className={`text-xs font-medium ${widgetSettings?.dark_mode ? "text-white" : "text-foreground"}`}>
                                  {t.author_name}
                                </p>
                              </div>
                            </div>
                            <p className={`text-xs ${widgetSettings?.dark_mode ? "text-gray-400" : "text-subtext"}`}>
                              {t.content?.slice(0, 60)}...
                            </p>
                          </div>
                        ))}
                      {testimonials.filter((t) => t.status === "approved").length === 0 && (
                        <p className="text-sm text-subtext col-span-2 text-center py-8">
                          Approve testimonials to see preview
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({
  testimonial,
  onApprove,
  onReject,
  onDelete,
}: {
  testimonial: Testimonial;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      className="p-6 bg-card border border-border/[0.08] rounded-[12px] hover:shadow-lg transition-shadow duration-300"
      layout
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {testimonial.type === "video" ? (
            <Video className="w-5 h-5 text-primary" />
          ) : (
            <span className="text-lg font-bold text-primary">
              {testimonial.author_name.charAt(0)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-primary">
              {testimonial.author_name}
            </h3>
            {testimonial.author_company && (
              <span className="text-xs text-subtext">
                {testimonial.author_company}
              </span>
            )}
            <span className="text-xs text-subtext/60">•</span>
            <span className="text-xs text-subtext/60">
              {timeAgo(testimonial.created_at)}
            </span>
          </div>
          {testimonial.rating && (
            <div className="flex gap-0.5 mb-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-primary text-sm">★</span>
              ))}
            </div>
          )}
          {testimonial.type === "video" && testimonial.video_url ? (
            <video
              src={testimonial.video_url}
              controls
              className="w-full max-w-md rounded-lg mt-2"
            />
          ) : (
            <p className="text-foreground/80 leading-relaxed">
              {testimonial.content}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {testimonial.status === "pending" ? (
            <>
              <button
                onClick={() => onApprove(testimonial.id)}
                className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(testimonial.id)}
                className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                testimonial.status === "approved"
                  ? "bg-green-500/10 text-green-600"
                  : "bg-red-500/10 text-red-600"
              }`}
            >
              {testimonial.status}
            </span>
          )}
          <button 
            className="p-2 rounded-lg hover:bg-slate transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(testimonial.content || testimonial.video_url || "");
            }}
          >
            <Share2 className="w-4 h-4 text-subtext" />
          </button>
          <button 
            className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
            onClick={() => onDelete(testimonial.id)}
          >
            <Trash2 className="w-4 h-4 text-subtext hover:text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
