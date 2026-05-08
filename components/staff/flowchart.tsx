"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, CheckCircle, XCircle, AlertTriangle, Database, Bell, Package, ShoppingCart, LogOut, User, Shield, Home } from "lucide-react";

interface FlowNode {
  id: string;
  type: "start" | "process" | "decision" | "input" | "output" | "database" | "connector";
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  branches?: {
    label: string;
    target: string;
    color?: string;
  }[];
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  color?: string;
}

export function StaffFlowchart() {
  const [activeSection, setActiveSection] = useState<string>("login");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: FlowNode[] = [
    // Login Authentication Flow
    { id: "start", type: "start", label: "Start", x: 400, y: 20, width: 120, height: 60 },
    { id: "input-credentials", type: "input", label: "Enter Staff Credentials", x: 340, y: 120, width: 240, height: 60 },
    { id: "validate-credentials", type: "decision", label: "Are Credentials Valid?", x: 360, y: 220, width: 200, height: 80 },
    { id: "error-message", type: "output", label: "Show Error Message", x: 180, y: 220, width: 140, height: 60 },
    { id: "dashboard", type: "process", label: "Access Staff Dashboard", x: 540, y: 220, width: 180, height: 60 },
    
    // Staff Dashboard Main Flow
    { id: "dashboard-main", type: "process", label: "Staff Dashboard", x: 360, y: 340, width: 200, height: 60 },
    { id: "check-low-stock", type: "decision", label: "Check Low Stock Alert?", x: 100, y: 460, width: 180, height: 80 },
    { id: "view-products", type: "decision", label: "View Product Records?", x: 360, y: 460, width: 180, height: 80 },
    { id: "view-orders", type: "decision", label: "View Pending Orders?", x: 620, y: 460, width: 180, height: 80 },
    { id: "sign-out", type: "decision", label: "Sign Out?", x: 360, y: 580, width: 200, height: 80 },
    
    // Low Stock Monitoring
    { id: "low-stock-detected", type: "decision", label: "Low Stock Detected?", x: 100, y: 600, width: 180, height: 80 },
    { id: "flag-item", type: "process", label: "Flag Item for Restocking", x: 20, y: 720, width: 160, height: 60 },
    { id: "notify-admin", type: "process", label: "Notify Admin", x: 20, y: 820, width: 160, height: 60 },
    { id: "notification-created", type: "output", label: "Notification Created", x: 20, y: 920, width: 160, height: 60 },
    
    // Product Inventory Management
    { id: "stock-adjustment", type: "decision", label: "Stock Adjustment Needed?", x: 360, y: 600, width: 180, height: 80 },
    { id: "update-stock", type: "input", label: "Update Stock Number", x: 280, y: 720, width: 160, height: 60 },
    { id: "is-update-valid", type: "decision", label: "Is Update Valid?", x: 280, y: 820, width: 160, height: 80 },
    { id: "update-error", type: "output", label: "Show Error Message", x: 460, y: 820, width: 140, height: 60 },
    { id: "update-database", type: "database", label: "Update Product Stock (Database)", x: 280, y: 920, width: 200, height: 60 },
    
    // Order Management
    { id: "pending-orders", type: "decision", label: "Pending Order Exists?", x: 620, y: 600, width: 180, height: 80 },
    { id: "review-order", type: "process", label: "Review Order Details", x: 540, y: 720, width: 160, height: 60 },
    { id: "update-status", type: "process", label: "Update Order Status", x: 540, y: 820, width: 160, height: 60 },
    { id: "update-order-db", type: "database", label: "Update Order Table (Database)", x: 520, y: 920, width: 200, height: 60 },
    
    // System Confirmation
    { id: "success-message", type: "output", label: "Show Success Message", x: 360, y: 1040, width: 180, height: 60 },
    { id: "return-dashboard", type: "process", label: "Return to Dashboard", x: 360, y: 1140, width: 180, height: 60 },
    
    // End
    { id: "end", type: "start", label: "End System", x: 560, y: 620, width: 120, height: 60 },
  ];

  const connections: FlowConnection[] = [
    // Login flow
    { from: "start", to: "input-credentials" },
    { from: "input-credentials", to: "validate-credentials" },
    { from: "validate-credentials", to: "error-message", color: "#ef4444" },
    { from: "validate-credentials", to: "dashboard", color: "#22c55e" },
    { from: "error-message", to: "input-credentials", color: "#ef4444" },
    { from: "dashboard", to: "dashboard-main" },
    
    // Dashboard to operations
    { from: "dashboard-main", to: "check-low-stock" },
    { from: "dashboard-main", to: "view-products" },
    { from: "dashboard-main", to: "view-orders" },
    { from: "dashboard-main", to: "sign-out" },
    
    // Low stock flow
    { from: "check-low-stock", to: "low-stock-detected" },
    { from: "low-stock-detected", to: "flag-item", color: "#ef4444" },
    { from: "low-stock-detected", to: "return-dashboard", color: "#22c55e" },
    { from: "flag-item", to: "notify-admin" },
    { from: "notify-admin", to: "notification-created" },
    { from: "notification-created", to: "success-message" },
    
    // Product management flow
    { from: "view-products", to: "stock-adjustment" },
    { from: "stock-adjustment", to: "update-stock", color: "#ef4444" },
    { from: "stock-adjustment", to: "return-dashboard", color: "#22c55e" },
    { from: "update-stock", to: "is-update-valid" },
    { from: "is-update-valid", to: "update-error", color: "#ef4444" },
    { from: "is-update-valid", to: "update-database", color: "#22c55e" },
    { from: "update-database", to: "success-message" },
    
    // Order management flow
    { from: "view-orders", to: "pending-orders" },
    { from: "pending-orders", to: "review-order", color: "#ef4444" },
    { from: "pending-orders", to: "return-dashboard", color: "#22c55e" },
    { from: "review-order", to: "update-status" },
    { from: "update-status", to: "update-order-db" },
    { from: "update-order-db", to: "success-message" },
    
    // System confirmation
    { from: "success-message", to: "return-dashboard" },
    { from: "return-dashboard", to: "dashboard-main" },
    
    // Logout flow
    { from: "sign-out", to: "return-dashboard", color: "#22c55e" },
    { from: "sign-out", to: "end", color: "#ef4444" },
  ];

  const getNodeIcon = (type: FlowNode["type"]) => {
    switch (type) {
      case "start":
        return <Circle className="w-4 h-4" />;
      case "decision":
        return <AlertTriangle className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "input":
        return <User className="w-4 h-4" />;
      case "output":
        return <Bell className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const renderNode = (node: FlowNode) => {
    const baseClasses = "absolute flex items-center justify-center border-2 transition-all duration-200 cursor-pointer";
    const isHovered = hoveredNode === node.id;
    
    let nodeClasses = "";
    let iconColor = "text-gray-600";
    
    switch (node.type) {
      case "start":
        nodeClasses = `${baseClasses} rounded-full bg-blue-50 border-blue-500 ${isHovered ? "bg-blue-100 shadow-lg" : ""}`;
        iconColor = "text-blue-600";
        break;
      case "decision":
        nodeClasses = `${baseClasses} transform rotate-45 bg-yellow-50 border-yellow-500 ${isHovered ? "bg-yellow-100 shadow-lg" : ""}`;
        iconColor = "text-yellow-600";
        break;
      case "database":
        nodeClasses = `${baseClasses} rounded-lg bg-purple-50 border-purple-500 ${isHovered ? "bg-purple-100 shadow-lg" : ""}`;
        iconColor = "text-purple-600";
        break;
      case "input":
        nodeClasses = `${baseClasses} rounded-lg bg-green-50 border-green-500 ${isHovered ? "bg-green-100 shadow-lg" : ""}`;
        iconColor = "text-green-600";
        break;
      case "output":
        nodeClasses = `${baseClasses} rounded-lg bg-orange-50 border-orange-500 ${isHovered ? "bg-orange-100 shadow-lg" : ""}`;
        iconColor = "text-orange-600";
        break;
      default:
        nodeClasses = `${baseClasses} rounded-lg bg-gray-50 border-gray-500 ${isHovered ? "bg-gray-100 shadow-lg" : ""}`;
        iconColor = "text-gray-600";
    }

    return (
      <div
        key={node.id}
        className={nodeClasses}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={() => setActiveSection(node.id)}
      >
        <div className={`transform ${node.type === "decision" ? "-rotate-45" : ""} text-center`}>
          <div className={iconColor}>{getNodeIcon(node.type)}</div>
          <div className="text-xs font-medium text-gray-800 mt-1 px-2">
            {node.label}
          </div>
        </div>
      </div>
    );
  };

  const renderConnection = (connection: FlowConnection) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;

    const x1 = fromNode.x + fromNode.width / 2;
    const y1 = fromNode.y + fromNode.height;
    const x2 = toNode.x + toNode.width / 2;
    const y2 = toNode.y;

    const isVertical = Math.abs(x2 - x1) < 50;
    const color = connection.color || "#6b7280";

    return (
      <svg
        key={`${connection.from}-${connection.to}`}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <marker
            id={`arrowhead-${connection.from}-${connection.to}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill={color}
            />
          </marker>
        </defs>
        <path
          d={`M ${x1} ${y1} ${isVertical ? `V ${y2 - 10}` : `H ${x2 - 10}`} ${isVertical ? `H ${x2}` : `V ${y2}`}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrowhead-${connection.from}-${connection.to})`}
        />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSection("login")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === "login" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Login
        </button>
        <button
          onClick={() => setActiveSection("dashboard-main")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === "dashboard-main" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <Home className="w-4 h-4 inline mr-2" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveSection("check-low-stock")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === "check-low-stock" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Inventory
        </button>
        <button
          onClick={() => setActiveSection("view-orders")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === "view-orders" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <ShoppingCart className="w-4 h-4 inline mr-2" />
          Orders
        </button>
      </div>

      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg" style={{ height: "1200px" }}>
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5">
            {[...Array(20)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-gray-900" style={{ top: `${i * 60}px` }} />
            ))}
            {[...Array(20)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-gray-900" style={{ left: `${i * 60}px` }} />
            ))}
          </div>

          {/* Connections */}
          {connections.map(renderConnection)}

          {/* Nodes */}
          {nodes.map(renderNode)}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Circle className="w-4 h-4 text-white" />
            </div>
            <span className="ml-2 font-semibold text-blue-900">Start/End</span>
          </div>
          <p className="text-sm text-blue-700">System entry and exit points</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 transform rotate-45 bg-yellow-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white -rotate-45" />
            </div>
            <span className="ml-2 font-semibold text-yellow-900">Decision</span>
          </div>
          <p className="text-sm text-yellow-700">Conditional logic branches</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="ml-2 font-semibold text-purple-900">Database</span>
          </div>
          <p className="text-sm text-purple-700">Data storage operations</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="ml-2 font-semibold text-green-900">Process</span>
          </div>
          <p className="text-sm text-green-700">System operations</p>
        </div>
      </div>
    </div>
  );
}

function Circle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
