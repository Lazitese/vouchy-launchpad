import { useState } from "react";
import { useLocation } from "react-router-dom";
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
  MessageSquare,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import logoPrimary from "@/assets/logo-primary.svg";

type View = "spaces" | "analytics" | "wall" | "settings" | "widget";

const sidebarItems = [
  { id: "spaces" as View, icon: LayoutGrid, label: "Spaces" },
  { id: "analytics" as View, icon: BarChart3, label: "Analytics" },
  { id: "wall" as View, icon: Heart, label: "Wall of Love" },
  { id: "settings" as View, icon: Settings, label: "Settings" },
];

// Mock testimonials data
const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    company: "TechCorp",
    content: "Absolutely love this product! It has transformed how we collect feedback.",
    rating: 5,
    type: "text",
    status: "pending",
    date: "2 hours ago",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    company: "StartupXYZ",
    content: "The video testimonial feature is a game-changer for our landing page.",
    rating: 5,
    type: "video",
    status: "approved",
    date: "1 day ago",
  },
  {
    id: 3,
    name: "Emily Roberts",
    company: "Design Studio",
    content: "Clean interface, easy to use. Our clients love leaving reviews here.",
    rating: 4,
    type: "text",
    status: "pending",
    date: "2 days ago",
  },
];

const Dashboard = () => {
  const location = useLocation();
  const workspace = location.state?.workspace || { name: "My Workspace", color: "#1a3f64" };
  
  const [activeView, setActiveView] = useState<View>("spaces");
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [widgetSettings, setWidgetSettings] = useState({
    darkMode: false,
    layout: "grid",
    showVideoFirst: true,
  });

  const hasTestimonials = testimonials.length > 0;

  const handleApprove = (id: number) => {
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, status: "approved" } : t
    ));
  };

  const handleReject = (id: number) => {
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, status: "rejected" } : t
    ));
  };

  const embedCode = `<script src="https://vouchy.io/widget.js" data-id="abc123"></script>`;

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
              style={{ backgroundColor: workspace.color }}
            >
              {workspace.name?.charAt(0) || "W"}
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-primary truncate">
                    {workspace.name || "My Workspace"}
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

        {/* Create button */}
        <div className="p-4">
          <Button variant="hero" className={`w-full ${!sidebarOpen && "p-2"}`}>
            <Plus className="w-4 h-4" />
            {sidebarOpen && <span className="ml-2">New Space</span>}
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
                <Button variant="outline" className="gap-2">
                  <Link2 className="w-4 h-4" />
                  Copy Collection Link
                </Button>
              </div>

              {!hasTestimonials ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-24 h-24 mb-6 rounded-full bg-slate flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary/40" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    You haven't collected trust yet.
                  </h2>
                  <p className="text-subtext mb-8 text-center max-w-md">
                    Create a collection link and share it with your customers to start
                    gathering powerful testimonials.
                  </p>
                  <Button variant="hero" size="lg" className="gap-2">
                    <Link2 className="w-5 h-5" />
                    Create Collection Link
                  </Button>
                </div>
              ) : (
                /* Testimonial Cards */
                <div className="grid gap-4">
                  {testimonials.map((testimonial) => (
                    <motion.div
                      key={testimonial.id}
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
                              {testimonial.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-primary">
                              {testimonial.name}
                            </h3>
                            <span className="text-xs text-subtext">
                              {testimonial.company}
                            </span>
                            <span className="text-xs text-subtext/60">•</span>
                            <span className="text-xs text-subtext/60">
                              {testimonial.date}
                            </span>
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <span key={i} className="text-primary text-sm">★</span>
                            ))}
                          </div>
                          <p className="text-foreground/80 leading-relaxed">
                            {testimonial.content}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {testimonial.status === "pending" ? (
                            <>
                              <button
                                onClick={() => handleApprove(testimonial.id)}
                                className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(testimonial.id)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
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
                          <button className="p-2 rounded-lg hover:bg-slate transition-colors">
                            <Share2 className="w-4 h-4 text-subtext" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
                          checked={widgetSettings.darkMode}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({ ...widgetSettings, darkMode: checked })
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
                              onClick={() =>
                                setWidgetSettings({ ...widgetSettings, layout })
                              }
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                widgetSettings.layout === layout
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
                          checked={widgetSettings.showVideoFirst}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({ ...widgetSettings, showVideoFirst: checked })
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
                      onClick={() => navigator.clipboard.writeText(embedCode)}
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
                      widgetSettings.darkMode ? "bg-gray-900" : "bg-background"
                    }`}
                  >
                    <div
                      className={`grid gap-4 ${
                        widgetSettings.layout === "grid" ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-[8px] ${
                            widgetSettings.darkMode
                              ? "bg-gray-800"
                              : "bg-slate border border-border/[0.08]"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-6 h-6 rounded-full ${
                                widgetSettings.darkMode ? "bg-gray-700" : "bg-primary/10"
                              }`}
                            />
                            <div
                              className={`h-2 w-16 rounded ${
                                widgetSettings.darkMode ? "bg-gray-700" : "bg-foreground/10"
                              }`}
                            />
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, j) => (
                              <span
                                key={j}
                                className={`text-xs ${
                                  widgetSettings.darkMode ? "text-yellow-500" : "text-primary"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <div
                            className={`h-2 w-full rounded mb-1 ${
                              widgetSettings.darkMode ? "bg-gray-700" : "bg-foreground/10"
                            }`}
                          />
                          <div
                            className={`h-2 w-3/4 rounded ${
                              widgetSettings.darkMode ? "bg-gray-700" : "bg-foreground/10"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {activeView === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-black text-primary mb-2">Analytics</h1>
              <p className="text-subtext mb-8">Track your testimonial performance</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Views", value: "12,847", change: "+24%" },
                  { label: "Submissions", value: "89", change: "+12%" },
                  { label: "Conversion Rate", value: "3.2%", change: "+0.5%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-6 bg-card border border-border/[0.08] rounded-[12px]"
                  >
                    <p className="text-sm text-subtext mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-primary mb-2">{stat.value}</p>
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Wall of Love */}
          {activeView === "wall" && (
            <motion.div
              key="wall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-black text-primary mb-2">Wall of Love</h1>
              <p className="text-subtext">Your approved testimonials showcase</p>
            </motion.div>
          )}

          {/* Settings */}
          {activeView === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-black text-primary mb-2">Settings</h1>
              <p className="text-subtext">Manage your workspace settings</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
