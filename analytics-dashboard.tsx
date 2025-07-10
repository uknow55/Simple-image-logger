import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, TrendingUp, Users, Clock, Percent, MousePointer, Eye, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Click } from "@shared/schema";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7");
  const [searchTerm, setSearchTerm] = useState("");
  const chartRef = useRef<HTMLCanvasElement>(null);

  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: locationData = [] } = useQuery({
    queryKey: ["/api/analytics/locations"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/locations");
      if (!response.ok) throw new Error("Failed to fetch location data");
      return response.json();
    },
  });

  const { data: trendsData = [] } = useQuery({
    queryKey: ["/api/analytics/trends", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/trends?days=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch trends");
      return response.json();
    },
  });

  const { data: clicks = [] } = useQuery({
    queryKey: ["/api/clicks"],
    queryFn: async () => {
      const response = await fetch("/api/clicks");
      if (!response.ok) throw new Error("Failed to fetch clicks");
      return response.json() as Promise<Click[]>;
    },
  });

  // Filter clicks based on search term
  const filteredClicks = clicks.filter(click => 
    !searchTerm || 
    click.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    click.browser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    click.device?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple chart rendering using Canvas API
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas || !trendsData.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value for scaling
    const maxClicks = Math.max(...trendsData.map((d: any) => d.clicks));
    const scale = (height - 2 * padding) / (maxClicks || 1);

    // Draw grid lines
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw line chart
    ctx.strokeStyle = "#1976D2";
    ctx.lineWidth = 3;
    ctx.beginPath();

    trendsData.forEach((point: any, index: number) => {
      const x = padding + (index * (width - 2 * padding)) / (trendsData.length - 1);
      const y = height - padding - (point.clicks * scale);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    ctx.fillStyle = "#1976D2";
    trendsData.forEach((point: any, index: number) => {
      const x = padding + (index * (width - 2 * padding)) / (trendsData.length - 1);
      const y = height - padding - (point.clicks * scale);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [trendsData]);

  const exportAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/export");
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "imagelogger-analytics.json";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={exportAnalytics}
            className="bg-accent text-white hover:bg-accent/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalClicks?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.5% from last week
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <MousePointer className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.uniqueVisitors?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8.2% from last week
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.avgSessionDuration ? formatDuration(stats.avgSessionDuration) : "0m 0s"}
                </p>
                <p className="text-sm text-error mt-1 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  2.1% from last week
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Clock className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click-through Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.ctr?.toFixed(1) || "0.0"}%
                </p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  5.7% from last week
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Percent className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click Trends Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Click Trends</h3>
            </div>
            <canvas 
              ref={chartRef} 
              width={400} 
              height={200} 
              className="w-full h-64"
            />
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
            </div>
            <div className="space-y-4">
              {locationData.slice(0, 5).map((location: any, index: number) => {
                const percentage = stats?.totalClicks > 0 
                  ? ((location.count / stats.totalClicks) * 100).toFixed(1)
                  : "0.0";
                
                const colors = ["primary", "success", "accent", "warning", "error"];
                const color = colors[index % colors.length];
                
                return (
                  <div key={location.location} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-${color}/10 rounded-lg flex items-center justify-center`}>
                        <span className={`text-xs font-medium text-${color}`}>
                          {location.location?.slice(0, 2).toUpperCase() || "UN"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {location.location || "Unknown"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {location.count.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
              {locationData.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">
                  No location data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Click Data</h3>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search clicks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Browser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Click Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClicks.slice(0, 20).map((click) => (
                  <tr key={click.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(click.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {click.location || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {click.device || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {click.browser || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ({click.clickX}, {click.clickY})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                      {click.sessionId.slice(0, 12)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClicks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No clicks match your search criteria." : "No click data available."}
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{Math.min(20, filteredClicks.length)}</span> of{" "}
              <span className="font-medium">{filteredClicks.length}</span> clicks
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
